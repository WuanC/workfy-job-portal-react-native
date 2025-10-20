import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import SimilarJobCard from "../../components/SimilarJobCard";
import { Ionicons } from "@expo/vector-icons";
import AppliedJobCard from "../../components/AppliedJobCard";
import JobCard from "../../components/JobCard";
import Modal from "react-native-modal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";

type JobDetailNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "JobDetail"
>;

const MyJobScreen = () => {
    const [activeTab, setActiveTab] = useState("Thông báo");
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const navigation = useNavigation<JobDetailNavigationProp>();


    const [similarJobs, setSimilarJobs] = useState([
        { id: "1", title: "Frontend Developer - Thu nhập Lên đến 50 triệu / tháng", location: "Hà Nội", notificationState: true },
        { id: "2", title: "Backend Developer", location: "Hà Nội", notificationState: false },
        { id: "3", title: "Market Research Executive", location: "Hà Nội", notificationState: true },
        { id: "4", title: "Market Research Executive", location: "Hà Nội", notificationState: false },
        { id: "5", title: "Market Research Executive", location: "Hà Nội", notificationState: true },
    ])

    const [appliedJobs, setAppliedJobs] = useState([
        { id: "1", title: "Frontend Developer - Thu nhập Lên đến 50 triệu / tháng", company_name: "Hà Nội", readState: true, applied_time: "tháng 0 20, 2025", logo_path: require("../../../assets/App/logoJob.png"), },
        { id: "2", title: "Backend Developer", company_name: "Hà Nội", readState: false, applied_time: "tháng 0 20, 2025", logo_path: require("../../../assets/App/logoJob.png") },
        { id: "3", title: "Market Research Executive", company_name: "Hà Nội", readState: true, applied_time: "tháng 0 20, 2025", logo_path: require("../../../assets/App/logoJob.png") },
        { id: "4", title: "Market Research Executive", company_name: "Hà Nội", readState: false, applied_time: "tháng 0 20, 2025", logo_path: require("../../../assets/App/logoJob.png") },
        { id: "5", title: "Market Research Executive", company_name: "Hà Nội", readState: true, applied_time: "tháng 0 20, 2025", logo_path: require("../../../assets/App/logoJob.png") },
    ])
    const [savedJobs, setSavedJobs] = useState([
        {
            id: "1",
            logo_path: require("../../../assets/App/logoJob.png"),
            job_title: "Market Research Executive",
            company_name: "Công ty TNHH Became Tokyu",
            job_location: "Bình Dương",
            slary_range: "Thương lượng",
            time_passed: "một giờ trước",
        },
        {
            id: "2",
            logo_path: require("../../../assets/App/logoJob.png"),
            job_title: "Frontend Developer - Thu nhập Lên đến 50 triệu / tháng",
            company_name: "Công ty TNHH ABC",
            job_location: "Hồ Chí Minh",
            slary_range: "20-30 triệu",
            time_passed: "2 giờ trước",
        },
        {
            id: "3",
            logo_path: require("../../../assets/App/logoJob.png"),
            job_title: "UI/UX Designer",
            company_name: "Công ty TNHH XYZ",
            job_location: "Hà Nội",
            slary_range: "15-25 triệu",
            time_passed: "5 giờ trước",
        },

    ]);



    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Việc của tôi</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {["Thông báo", "Việc đã ứng tuyển", "Việc đã lưu"].map((tab) => (
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
                                navigation.navigate("JobDetail", {id: 1})
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
                        data={appliedJobs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <AppliedJobCard
                                id={item.id}
                                title={item.title}
                                company_name={item.company_name}
                                logo_path={item.logo_path}
                                applied_time={item.applied_time}
                                readState={item.readState}
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa ứng tuyển công việc nào.</Text>}

                    />

                </View>
            )}
            {activeTab === "Việc đã lưu" && (
                <View style={styles.content}>
                    <FlatList
                        style={styles.content}
                        data={savedJobs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <JobCard
                                id = {1}
                                logo_path={item.logo_path}
                                job_title={item.job_title}
                                company_name={item.company_name}
                                job_location={item.job_location}
                                salary_range={item.slary_range}
                                time_passed={item.time_passed}
                                applied={true}
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa ứng tuyển công việc nào.</Text>}

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
        paddingTop: 12,
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
