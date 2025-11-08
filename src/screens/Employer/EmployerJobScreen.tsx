import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { closeJob, deleteJob, getMyJobs } from "../../services/jobService";
import { EmployerJobCard } from "../../components/Employer/EmployerJobCard";

type EmployerJobNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostJob" | "UpdateJob"
>;

export default function EmployerJobScreen() {
  const navigation = useNavigation<EmployerJobNavigationProp>();

  const [selectedId, setSelectedId] = useState<number>(-1)

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter dropdown modal
  const [filterModal, setFilterModal] = useState<"status" | "career" | "location" | null>(null);

  // Action menu state
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Mock filter data
  const [statusOptions, setStatusOptions] = useState<{ id: number; name: string }[]>([]);
  const [careerOptions, setCareerOptions] = useState<{ id: number; name: string }[]>([]);
  const [locationOptions, setLocationOptions] = useState<{ id: number; name: string }[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getMyJobs();
      if (res.status === 200) {

        setJobs(res.data.items);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách công việc:", err);
    } finally {
      setLoading(false);
    }
  };
  // Fetch job list
  // useEffect(() => {

  //   fetchJobs();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );
  // Chọn / Bỏ chọn filter
  const toggleSelect = (id: number, name: string, selected: string[], setter: any) => {
    if (selected.includes(name)) setter(selected.filter((s) => s !== name));
    else setter([...selected, name]);
  };

  // Render modal filter
  const renderFilterModal = (type: "status" | "career" | "location") => {
    const data =
      type === "status"
        ? statusOptions
        : type === "career"
          ? careerOptions
          : locationOptions;

    const selected =
      type === "status"
        ? selectedStatus
        : type === "career"
          ? selectedCareer
          : selectedLocation;

    const setter =
      type === "status"
        ? setSelectedStatus
        : type === "career"
          ? setSelectedCareer
          : setSelectedLocation;

    return (
      <Modal visible={filterModal === type} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setFilterModal(null)}>
          <View style={styles.modalBox}>
            <ScrollView>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionRow}
                  onPress={() => toggleSelect(item.id, item.name, selected, setter)}
                >
                  <Ionicons
                    name={selected.includes(item.name) ? "checkbox" : "square-outline"}
                    size={22}
                    color="#007bff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    );
  };
  const handleDeleteJob = async (id: number) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa công việc này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteJob(id);
              if (res.status === 200) {
                Alert.alert("✅ Thành công", res.message);
                fetchJobs()
                // Gọi lại API load danh sách công việc
              }
            } catch (error: any) {
              const msg =
                error.response?.data?.message ||
                "Không thể xóa công việc. Vui lòng thử lại.";
              Alert.alert("❌ Lỗi", msg);
            }
          },
        },
      ]
    );
  };

  const handleCloseJob = async (id: number) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn đóng tin tuyển dụng này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đóng tin",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await closeJob(id);
              if (res.status === 200) {
                Alert.alert("✅ Thành công", res.message);
                await fetchJobs(); // 🔁 Cập nhật lại danh sách công việc
              }
            } catch (error: any) {
              const msg =
                error.response?.data?.message ||
                "Không thể đóng tin tuyển dụng. Vui lòng thử lại.";
              Alert.alert("❌ Lỗi", msg);
            }
          },
        },
      ]
    );
  };
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      );
    }
  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Công việc của tôi</Text>
      </LinearGradient>

      {/* Modern New Job Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("PostJob")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#11998e", "#38ef7d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.newJobButton}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.newJobButtonText}>Đăng công việc mới</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Modern Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm công việc..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Modern Filter Chips */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setFilterModal("status")}
        >
          <Ionicons name="funnel-outline" size={16} color="#667eea" />
          <Text style={styles.filterChipText}>Trạng thái</Text>
          <Ionicons name="chevron-down" size={14} color="#667eea" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setFilterModal("career")}
        >
          <Ionicons name="briefcase-outline" size={16} color="#667eea" />
          <Text style={styles.filterChipText}>Ngành nghề</Text>
          <Ionicons name="chevron-down" size={14} color="#667eea" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setFilterModal("location")}
        >
          <Ionicons name="location-outline" size={16} color="#667eea" />
          <Text style={styles.filterChipText}>Địa điểm</Text>
          <Ionicons name="chevron-down" size={14} color="#667eea" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={jobs.filter((j) =>
            j?.jobTitle?.toLowerCase().includes(search.toLowerCase())
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EmployerJobCard
              status={item.status}
              title={item.jobTitle}
              duration={"60 ngày"}
              dateRange={`${new Date(item.createdAt).toLocaleDateString(
                "vi-VN"
              )} - ${new Date(item.expirationDate).toLocaleDateString("vi-VN")}`}
              applications={0}
              views={0}
              onOptionsPress={() => {
                setSelectedJob(item);
                setShowActionMenu(true);
                setSelectedId(item.id)
              }}
            />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* Filter modals */}
      {renderFilterModal("status")}
      {renderFilterModal("career")}
      {renderFilterModal("location")}

      {/* Action menu */}
      <Modal
        visible={showActionMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.menuBox}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Đăng việc này</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={[styles.menuText, { color: "#ff6600" }]}>Ẩn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}
              onPress={() => {
                setShowActionMenu(false);
                handleDeleteJob(selectedId)
              }}>
              <Text style={[styles.menuText, { color: "#ff0000" }]}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}
              onPress={() => {
                setShowActionMenu(false);
                handleCloseJob(selectedId)
              }}>
              <Text style={[styles.menuText, { color: "#ff0000" }]}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, { borderTopWidth: 1, borderColor: "#eee" }]}
              onPress={() => {
                setShowActionMenu(false);
                navigation.navigate("UpdateJob", { id: selectedId })
              }}
            >
              <Text style={styles.menuText}>Sửa</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 50,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#ffffff",
  },
  newJobButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#11998e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  newJobButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1a1a1a",
  },
  filterRow: { 
    flexDirection: "row", 
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterChipText: {
    fontSize: 13,
    color: "#667eea",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 24,
    maxHeight: 400,
    paddingVertical: 20,
  },
  optionRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  optionText: { 
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "500",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: 240,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
  },
    center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
