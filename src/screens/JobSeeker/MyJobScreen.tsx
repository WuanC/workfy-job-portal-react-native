import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator, RefreshControl } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import SimilarJobCard from "../../components/SimilarJobCard";
import { Ionicons } from "@expo/vector-icons";
import AppliedJobCard from "../../components/AppliedJobCard";
import JobCard from "../../components/JobCard";
import Modal from "react-native-modal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getMyApplications } from "../../services/applicationService";
import { formatDate } from "../../utilities/constant";
import { getSavedJobs } from "../../services/saveJobService";

type JobDetailNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "JobDetail"
>;

const MyJobScreen = () => {
    const [activeTab, setActiveTab] = useState("Việc đã ứng tuyển");
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const navigation = useNavigation<JobDetailNavigationProp>();

    const [isApplicationRefreshing, setIsApplicationRefreshing] = useState(false);
    const [isSaveJobRefreshing, setIsSaveJobRefreshing] = useState(false);

    const [applications, setApplications] = useState<any[]>([]);
    const [saveJobs, setSaveJobs] = useState<any[]>([])

    const [applicationPageNumber, setApplicationPageNumber] = useState(1);
    const [isApplicationLoading, setIsApplicationLoading] = useState(false);
    const [applicationHasMore, setApplicationHasMore] = useState(true);

    const [saveJobPageNumber, setSaveJobPageNumber] = useState(1);
    const [isSaveJobLoading, setIsSaveJobLoading] = useState(false);
    const [saveJobHasMore, setSaveJobHasMore] = useState(true);
    const fetchApplications = async (page = 1) => {
        if (isApplicationLoading || !applicationHasMore) return;

        setIsApplicationLoading(true);
        try {
            const res = await getMyApplications({
                pageNumber: page,
                pageSize: 10,
                sorts: "createdAt,desc"
            });

            if (page === 1) {
                setApplications(res.items);
            } else {
                setApplications(prev => [...prev, ...res.items]);
            }
            setApplicationHasMore(page < res.totalPages);
            setApplicationPageNumber(page);
        } catch (err) {
            setApplicationHasMore(false);
        } finally {
            setIsApplicationLoading(false);
        }
    };
    const applicationListRef = useRef<FlatList>(null);
    const saveJobListRef = useRef<FlatList>(null);

    // Khi muốn reset progress:
    const resetApplicationList = () => {
        applicationListRef.current?.scrollToOffset({ offset: 0, animated: false });
    };

    const resetSaveJobList = () => {
        saveJobListRef.current?.scrollToOffset({ offset: 0, animated: false });
    };
    const fetchSaveJobs = async (page = 1) => {
        if (isSaveJobLoading || !saveJobHasMore) return;

        setIsSaveJobLoading(true);
        try {
            const res = await getSavedJobs({
                pageNumber: page,
                pageSize: 10,
            });
            if (page === 1) {

                setSaveJobs(res.items);
            } else {
                setSaveJobs(prev => [...prev, ...res.items]);
            }
            setSaveJobHasMore(page < res.totalPages);
            setSaveJobPageNumber(page);
        } catch (err) {
            setSaveJobHasMore(false);
        } finally {
            setIsSaveJobLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchSaveJobs()
    //     fetchApplications()
    // }, []);
    // useFocusEffect(
    //     useCallback(() => {
    //         if (activeTab === "Việc đã ứng tuyển") {
    //             setApplicationPageNumber(1);
    //             setApplicationHasMore(true);
    //             fetchApplications(1, false);
    //         } else if (activeTab === "Việc đã lưu") {
    //             setSaveJobPageNumber(1);
    //             setSaveJobHasMore(true);
    //             fetchSaveJobs(1, false);
    //         }
    //     }, [activeTab])
    // );
    useFocusEffect(
        useCallback(() => {
            resetApplicationList()
            resetSaveJobList()
            setIsApplicationLoading(false)
            setIsSaveJobLoading(false)
            fetchSaveJobs(1);
            fetchApplications(1);
        }, [])
    );

    const [similarJobs, setSimilarJobs] = useState([
        { id: "1", title: "Frontend Developer - Thu nhập Lên đến 50 triệu / tháng", location: "Hà Nội", notificationState: true },
        { id: "2", title: "Backend Developer", location: "Hà Nội", notificationState: false },
        { id: "3", title: "Market Research Executive", location: "Hà Nội", notificationState: true },
        { id: "4", title: "Market Research Executive", location: "Hà Nội", notificationState: false },
        { id: "5", title: "Market Research Executive", location: "Hà Nội", notificationState: true },
    ])
    const handleApplicationLoadMore = () => {
        if (applicationHasMore && !isApplicationLoading) {
            fetchApplications(applicationPageNumber + 1);
        }
    };
    const handleSaveJobLoadMore = () => {
        if (saveJobHasMore && !isSaveJobLoading) {
            fetchSaveJobs(saveJobPageNumber + 1);
        }
    };
    const handleRefreshApplications = async () => {
        setIsApplicationLoading(false)
        setApplicationHasMore(true)
        setIsApplicationRefreshing(true);
        await fetchApplications(1); // tải lại trang đầu
        setIsApplicationRefreshing(false);
    };

    const handleRefreshSaveJobs = async () => {
        setIsSaveJobLoading(false)
        setSaveJobHasMore(true)
        setIsSaveJobRefreshing(true);
        await fetchSaveJobs(1);
        setIsSaveJobRefreshing(false);
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Việc của tôi</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {["Việc đã ứng tuyển", "Việc đã lưu"].map((tab) => (
                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                        {activeTab === tab && <View style={styles.activeLine} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}

            {activeTab === "Thông báo" && (
                <View style={styles.content}>
                    <FlatList
                        style={styles.content}
                        data={similarJobs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <SimilarJobCard
                                id={item.id}
                                title={item.title}
                                location={item.location}
                                notificationState={item.notificationState}
                                onPressEllipsis={toggleModal}
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa ứng tuyển công việc nào.</Text>}

                    />

                    {/* Bottom Button */}
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.bottomButton}>
                            <Ionicons name="notifications-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.bottomButtonText}>Tạo thông báo việc làm</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        isVisible={isModalVisible}
                        onBackdropPress={toggleModal}
                        style={styles.modal}
                    >
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.option} onPress={() => {
                                toggleModal();
                                navigation.navigate("JobDetail", { id: 1 })
                            }
                            }>
                                <Ionicons name="eye-outline" size={20} color="#333" />
                                <Text style={styles.optionText}>Xem công việc gốc</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.option}>
                                <Ionicons name="create-outline" size={20} color="#333" />
                                <Text style={styles.optionText}>Chỉnh sửa thông báo việc làm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.option}>
                                <Ionicons name="trash-outline" size={20} color="red" />
                                <Text style={[styles.optionText, { color: "red" }]}>
                                    Xoá thông báo việc làm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            )}
            {activeTab === "Việc đã ứng tuyển" && (
                <View style={styles.content}>
                    <FlatList
                        style={styles.content}
                        data={applications}
                        keyExtractor={(item) => item.id}
                        ref = {applicationListRef}
                        renderItem={({ item }) => (
                            <View>
                                <AppliedJobCard
                                    id={item.id}
                                    title={item.job?.jobTitle}
                                    company_name={item.job?.employer?.companyName}
                                    logo_path={item.job.employer?.avatarUrl}
                                    applied_time={formatDate(item.createdAt)}
                                    cvUrl={item.cvUrl}
                                    coverLetter={item.coverLetter}
                                    status={item.status}
                                />
                            </View>

                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa ứng tuyển công việc nào.</Text>}
                        onEndReached={handleApplicationLoadMore}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={
                            isApplicationLoading ? <ActivityIndicator size="small" style={{ margin: 10 }} /> : null
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={isApplicationRefreshing}
                                onRefresh={handleRefreshApplications}
                                colors={["#0066CC"]}
                            />
                        }
                    />

                </View>
            )}
            {activeTab === "Việc đã lưu" && (
                <View style={styles.content}>
                    <FlatList
                        style={styles.content}
                        data={saveJobs}
                        keyExtractor={(item) => item.id}
                        ref={saveJobListRef}
                        renderItem={({ item }) => (
                            <JobCard
                                id={item.id}
                                logo_path={item.author.avatarUrl}
                                job_title={item.jobTitle}
                                company_name={item.companyName}
                                job_location={item.jobLocations[0]?.province?.name}
                                salary_range={
                                    item.salaryType === "RANGE"
                                        ? `${item.minSalary} - ${item.maxSalary} ${item.salaryUnit}`
                                        : item.salaryType === "NEGOTIABLE"
                                            ? "Thỏa thuận"
                                            : "Không rõ"
                                }
                                time_passed={item.expirationDate}
                                applied={true}
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa lưu công việc nào.</Text>}
                        onEndReached={handleSaveJobLoadMore}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={
                            isSaveJobLoading ? <ActivityIndicator size="small" style={{ margin: 10 }} /> : null
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={isSaveJobRefreshing}
                                onRefresh={handleRefreshSaveJobs}
                                colors={["#0066CC"]}
                                progressViewOffset={10}
                            />
                        }

                    />

                </View>
            )}


        </View>
    );
};

export default MyJobScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F6F6",
    },
    header: {
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderBottomColor: "#ddd",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
    },
    tab: {
        alignItems: "center",
        paddingVertical: 10,
    },
    tabText: {
        fontSize: 14,
        color: "#555",
    },
    activeTabText: {
        color: "#0066CC",
        fontWeight: "bold",
    },
    activeLine: {
        marginTop: 4,
        height: 2,
        backgroundColor: "#0066CC",
        width: "100%",
    },
    content: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 0,
        marginBottom: 12,
    },

    emptyText: { textAlign: "center", color: "#888", marginTop: 20 },
    bottomContainer: {
        backgroundColor: "#fff",
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

    },
    bottomButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0066CC",
        paddingVertical: 12,
        margin: 12,
        borderRadius: 8,
    },
    bottomButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
    },
    optionText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#333",
    },
});
