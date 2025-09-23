import { useNavigation } from "@react-navigation/native";
import { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";

const FilterScreen = () => {
  const [selectedDate, setSelectedDate] = useState("1");
  const [selectedRank, setSelectedRank] = useState<string | null>(null);

  const [dateFilter] = useState([
    { id: "1", label: "Ngày cập nhật" },
    { id: "2", label: "Ngày đăng" },
    { id: "3", label: "Ngày hết hạn" },
  ]);

  const [location] = useState([
    { id: "1", label: "Hồ Chí Minh" },
    { id: "2", label: "Hà Nội" },
    { id: "3", label: "Đà Nẵng" },
    { id: "4", label: "Hải Phòng" },
  ]);

  const [rank] = useState([
    { id: "1", label: "Thực tập sinh" },
    { id: "2", label: "Mới đi làm" },
  ]);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showLocationSheet, setShowLocationSheet] = useState(false);

  const navigation = useNavigation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const toggleLocation = (id: string) => {
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const displayLocations =
    selectedLocations.length > 0
      ? location
          .filter((l) => selectedLocations.includes(l.id))
          .map((l) => l.label)
          .join(", ")
      : "Chọn địa điểm";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.cancel} onPress={() => navigation.goBack()}>
            Hủy
          </Text>
          <Text style={styles.title}>Bộ lọc tìm kiếm</Text>
          <Text style={styles.reset}>Đặt lại</Text>
        </View>

        {/* Date filter */}
        <Text style={styles.sectionTitle}>Tìm kiếm theo</Text>
        <View style={styles.row}>
          {dateFilter.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                selectedDate === item.id && styles.chipSelected,
              ]}
              onPress={() => setSelectedDate(item.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedDate === item.id && styles.chipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>Nhập tỉnh, thành phố</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => {
            setShowLocationSheet(true);
            console.log("pressed")
            bottomSheetRef.current?.expand();
          }}
        >
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.inputText} numberOfLines={1}>
            {displayLocations}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Rank */}
        <Text style={styles.sectionTitle}>Cấp bậc</Text>
        <View style={styles.rowWrap}>
          {rank.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                selectedRank === item.id && styles.chipSelected,
              ]}
              onPress={() => setSelectedRank(item.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedRank === item.id && styles.chipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Apply button */}
      <TouchableOpacity style={styles.applyBtn}>
        <Text style={styles.applyText}>Áp dụng</Text>
      </TouchableOpacity>

      {/* Bottom Sheet cho Location */}
      {showLocationSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onClose={() => setShowLocationSheet(false)}
        >
          <View style={styles.sheetContent}>
            <Text style={styles.modalTitle}>Chọn tỉnh, thành phố</Text>
            <FlatList
              data={location}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedLocations.includes(item.id);
                return (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => toggleLocation(item.id)}
                  >
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={22}
                      color={isSelected ? "#007AFF" : "#666"}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16, paddingBottom: 80 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cancel: { color: "black", fontSize: 16 },
  title: { fontWeight: "bold", fontSize: 18 },
  reset: { color: "#007AFF", fontSize: 16 },
  sectionTitle: { marginVertical: 10, fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", marginBottom: 16 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  chipSelected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  chipText: { fontSize: 14, color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputText: { flex: 1, marginLeft: 8, fontSize: 14, color: "#333" },
  applyBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  applyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  sheetContent: { flex: 1, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  modalItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  modalItemText: { fontSize: 16, color: "#333" },
});
