import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EmployerJobCard from "../../components/Employer/EmployerJobCard";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type EmployerJobNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "PostJob"
>;
export default function EmployerJobScreen() {
    const navigation = useNavigation<EmployerJobNavigationProp>();
    const [search, setSearch] = useState("");
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter dropdown modal state
    const [filterModal, setFilterModal] = useState<"status" | "career" | "location" | null>(null);

    // Selected filters
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedCareer, setSelectedCareer] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);

    // Mock dữ liệu API
    const [statusOptions, setStatusOptions] = useState<{ id: number; name: string }[]>([]);
    const [careerOptions, setCareerOptions] = useState<{ id: number; name: string }[]>([]);
    const [locationOptions, setLocationOptions] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        // Giả lập gọi API
        setLoading(true);
        setTimeout(() => {
            setStatusOptions([
                { id: 1, name: "Bản tạm" },
                { id: 2, name: "Đang chờ" },
                { id: 3, name: "Kích hoạt" },
                { id: 4, name: "Hết hạn" },
                { id: 5, name: "Ẩn" },
            ]);
            setCareerOptions([
                { id: 1, name: "IT - Phần mềm" },
                { id: 2, name: "Kinh doanh" },
                { id: 3, name: "Thiết kế" },
                { id: 4, name: "Kế toán" },
            ]);
            setLocationOptions([
                { id: 1, name: "TP. Hồ Chí Minh" },
                { id: 2, name: "Hà Nội" },
                { id: 3, name: "Đà Nẵng" },
            ]);

            // Dữ liệu job giả
            setJobs([
                {
                    id: 1,
                    status: "Bản tạm",
                    title: "(Chưa có tiêu đề)",
                    duration: "60 ngày",
                    dateRange: "9 thg 9 2025 - 9 thg 11 2025",
                    applications: 0,
                    views: 0,
                },
                {
                    id: 2,
                    status: "Kích hoạt",
                    title: "Nhân viên kinh doanh",
                    duration: "30 ngày",
                    dateRange: "1 thg 10 2025 - 30 thg 10 2025",
                    applications: 5,
                    views: 47,
                },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Chọn / Bỏ chọn filter
    const toggleSelect = (id: number, name: string, selected: string[], setter: any) => {
        if (selected.includes(name)) setter(selected.filter((s) => s !== name));
        else setter([...selected, name]);
    };

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Công việc của tôi</Text>

            <TouchableOpacity style={styles.newJobButton} onPress={() => navigation.navigate("PostJob")}>
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
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModal("status")}>
                    <Text>Trạng thái</Text>
                    <Ionicons name="chevron-down" size={16} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModal("career")}>
                    <Text>Ngành nghề</Text>
                    <Ionicons name="chevron-down" size={16} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModal("location")}>
                    <Text>Nơi làm việc</Text>
                    <Ionicons name="chevron-down" size={16} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={jobs.filter((j) =>
                        j.title.toLowerCase().includes(search.toLowerCase())
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <EmployerJobCard
                            status={item.status === "Bản tạm" ? "draft" : "active"}
                            title={item.title}
                            duration={item.duration}
                            dateRange={item.dateRange}
                            applications={item.applications}
                            views={item.views}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}

            {renderFilterModal("status")}
            {renderFilterModal("career")}
            {renderFilterModal("location")}
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
});
