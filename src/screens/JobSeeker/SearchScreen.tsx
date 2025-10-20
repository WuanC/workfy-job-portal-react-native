import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import SearchBar from "../../components/SearchBar";
import JobCard from "../../components/JobCard";
import { getAllIndustries, Industry } from "../../services/industryService"; // 👈 import đúng API của bạn
import { AdvancedJobQuery, getAdvancedJobs } from "../../services/jobService";

type FilterNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "SearchFilter"
>;

const SearchScreen = ({ route }: any) => {
    const initialTab = (route.params as any)?.initialTab || "jobs";


    const [advanceFilter, setAdvanceFilter] = useState<AdvancedJobQuery | null>(null);
    const navigation = useNavigation<FilterNavigationProp>();
    const [activeTab, setActiveTab] = useState<"jobs" | "industries">(initialTab);

    // --- Jobs demo ---
    const [searchText, setSearchText] = useState<string>("")
    const [jobs, setJobs] = useState<any[]>([]);

    // --- Industries ---
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (activeTab === "industries") {
            fetchIndustries();
        }
    }, [activeTab]);
    useEffect(() => {
        if (advanceFilter) {
            fetchFilteredJobs(advanceFilter);
        }
    }, [advanceFilter]);
    const fetchFilteredJobs = async (filter: any) => {
        try {
            setLoading(true);
            const data = await getAdvancedJobs(filter);
            setJobs(data.items);
        } catch (error) {
            console.error("❌ Lỗi khi lấy danh sách công việc đã lọc:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchIndustries = async () => {
        try {
            setLoading(true);
            const data = await getAllIndustries(); // ⬅️ gọi API bạn viết sẵn
            setIndustries(data);
        } catch (error) {
            console.error("❌ Lỗi khi load ngành nghề:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 🔍 Thanh tìm kiếm */}
            <SearchBar
                placeholder="Tìm kiếm công việc, công ty..."
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text)
                    setAdvanceFilter((prev) => ({
                        ...prev,
                        keyword: text,
                    }));
                }}
                onSubmit={() => {
                    if (advanceFilter) fetchFilteredJobs(advanceFilter);
                }}
            />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <View style={styles.tabRow}>
                    <TouchableOpacity
                        style={activeTab === "jobs" ? styles.activeTab : styles.inactiveTab}
                        onPress={() => setActiveTab("jobs")}
                    >
                        <Text
                            style={
                                activeTab === "jobs"
                                    ? styles.activeTabText
                                    : styles.inactiveTabText
                            }
                        >
                            Công việc
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            activeTab === "industries"
                                ? styles.activeTab
                                : styles.inactiveTab
                        }
                        onPress={() => setActiveTab("industries")}
                    >
                        <Text
                            style={
                                activeTab === "industries"
                                    ? styles.activeTabText
                                    : styles.inactiveTabText
                            }
                        >
                            Ngành nghề
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.inactiveTab}
                    onPress={() =>
                        navigation.navigate("SearchFilter", {
                            currentFilter: advanceFilter,
                            onApply: (newFilter: any) => {
                                setAdvanceFilter(newFilter);
                            },
                        })
                    }
                >
                    <Ionicons name="filter" size={25} color="black" style={styles.icon} />
                </TouchableOpacity>
            </View>

            {/* 🔄 Nội dung thay đổi theo tab */}
            {activeTab === "jobs" ? (
                <View style={styles.listContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.countText}>{jobs.length} việc làm</Text>
                        <Text style={styles.notifyText}>Tạo thông báo</Text>
                    </View>

                    <FlatList
                        data={jobs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <JobCard
                                id = {item.id}
                                logo_path={item.avatarUrl}
                                job_title={item.jobTitle}
                                company_name={item.companyName}
                                job_location={item.jobLocations[0].province.name}
                                salary_range={
                                    item.salaryType === "RANGE"
                                        ? `${item.minSalary?.toLocaleString()} ${item.salaryUnit}  - ${item.maxSalary?.toLocaleString()} ${item.salaryUnit} `
                                        : item.salaryType === "GREATER_THAN"
                                            ? `Trên ${item.minSalary?.toLocaleString()}`
                                            : item.salaryType === "NEGOTIABLE"
                                                ? "Thỏa thuận"
                                                : item.salaryType === "COMPETITIVE"
                                                    ? "Cạnh tranh"
                                                    : "Không rõ"
                                }
                                time_passed={item.expirationDate}
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : (
                <ScrollView
                    style={styles.industryContainer}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
                    ) : (
                        industries.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.industryCard}
                                onPress={() => {
                                    const newFilter = {
                                        ...advanceFilter,
                                        industryIds: [item.id], // ✅ chỉ giữ 1 industry được chọn
                                    };

                                    setAdvanceFilter(newFilter);
                                    setActiveTab("jobs");     // ✅ chuyển về tab "Công việc"
                                    fetchFilteredJobs(newFilter); // ✅ gọi lại API lấy danh sách việc làm
                                }}
                            >
                                <View style={styles.iconBox}>
                                    <Ionicons name="briefcase-outline" size={22} color="#007bff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.industryName}>{item.name}</Text>
                                    {item.engName && (
                                        <Text style={styles.industryEng}>{item.engName}</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
    },
    tabContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
    },
    tabRow: {
        flexDirection: "row",
        marginTop: 8,
        marginBottom: 12,
    },
    activeTab: {
        backgroundColor: "#e0f0ff",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    inactiveTab: {
        backgroundColor: "#f5f5f5",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    activeTabText: {
        color: "#007bff",
        fontWeight: "600",
    },
    inactiveTabText: {
        color: "#333",
    },
    icon: {
        paddingVertical: 6,
        justifyContent: "center",
    },
    listContainer: {
        flex: 1,
        backgroundColor: "#E6F0FA",
        paddingHorizontal: 10,
        paddingTop: 15,
        marginTop: 10,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    countText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    notifyText: {
        fontSize: 14,
        color: "#007bff",
    },
    industryContainer: {
        flex: 1,
        marginTop: 10,
    },
    industryCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFD",
        borderWidth: 1,
        borderColor: "#E0E7F0",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#E6F0FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    industryName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    industryEng: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
});
