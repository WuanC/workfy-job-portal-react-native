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
  // Render component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Công việc của tôi</Text>

      <TouchableOpacity
        style={styles.newJobButton}
        onPress={() => navigation.navigate("PostJob")}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>+ Đăng công việc mới</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Tìm công việc"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModal("status")}
        >
          <Text>Trạng thái</Text>
          <Ionicons name="chevron-down" size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModal("career")}
        >
          <Text>Ngành nghề</Text>
          <Ionicons name="chevron-down" size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModal("location")}
        >
          <Text>Nơi làm việc</Text>
          <Ionicons name="chevron-down" size={16} />
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
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 12 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  newJobButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  filterRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  filterButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    marginHorizontal: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 300,
    paddingVertical: 10,
  },
  optionRow: { flexDirection: "row", alignItems: "center", padding: 10 },
  optionText: { fontSize: 15 },

  // Action menu
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 220,
    paddingVertical: 5,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
    center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
