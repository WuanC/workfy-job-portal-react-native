import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";

const SearchScreen = () => {
    // State chứa danh sách job
    const [jobs, setJobs] = useState([
        {
            id: "1",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "Market Research Executive",
            company_name: "Công ty TNHH Became Tokyu",
            job_location: "Bình Dương",
            slary_range: "Thương lượng",
            time_passed: "một giờ trước",
        },
        {
            id: "2",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "Software Engineer",
            company_name: "Công ty TNHH ABC",
            job_location: "Hồ Chí Minh",
            slary_range: "20-30 triệu",
            time_passed: "2 giờ trước",
        },
        {
            id: "3",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "UI/UX Designer",
            company_name: "Công ty TNHH XYZ",
            job_location: "Hà Nội",
            slary_range: "15-25 triệu",
            time_passed: "5 giờ trước",
        },
        {
            id: "4",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "UI/UX Designer",
            company_name: "Công ty TNHH XYZ",
            job_location: "Hà Nội",
            slary_range: "15-25 triệu",
            time_passed: "5 giờ trước",
        },
        {
            id: "5",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "UI/UX Designer",
            company_name: "Công ty TNHH XYZ",
            job_location: "Hà Nội",
            slary_range: "15-25 triệu",
            time_passed: "5 giờ trước",
        },
        {
            id: "6",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "UI/UX Designer",
            company_name: "Công ty TNHH XYZ",
            job_location: "Hà Nội",
            slary_range: "15-25 triệu",
            time_passed: "5 giờ trước",
        },
        {
            id: "7",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "UI/UX Designer",
            company_name: "Công ty TNHH XYZ",
            job_location: "Hà Nội",
            slary_range: "15-25 triệu",
            time_passed: "5 giờ trước",
        },
        {
            id: "8",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "UI/UX Designer",
            company_name: "Công ty TNHH XYZ",
            job_location: "Hà Nội",
            slary_range: "15-25 triệu",
            time_passed: "5 giờ trước",
        },
        {
            id: "9",
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "UI/UX Designer",
            company_name: "Công ty TNHH XYZ",
            job_location: "Hà Nội",
            slary_range: "15-25 triệu",
            time_passed: "5 giờ trước",
        },

    ]);

    return (

            <View style={styles.container}>
                {/* Search bar */}
                <SearchBar
                    placeholder="Tìm công việc tại đây..."
                    value=""
                    onChangeText={() => { }}
                    onSubmit={() => { }}
                />

                {/* Tabs */}
                <View style={styles.tabRow}>
                    <TouchableOpacity style={styles.activeTab}>
                        <Text style={styles.activeTabText}>Công việc</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inactiveTab}>
                        <Text style={styles.inactiveTabText}>Ngành nghề</Text>
                    </TouchableOpacity>
                </View>

                {/* Header */}
                <View style={styles.listContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.countText}>{jobs.length} việc làm</Text>
                        <Text style={styles.notifyText}>Tạo thông báo</Text>
                    </View>

                    {/* Danh sách job */}
                    <FlatList
                        data={jobs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <JobCard
                                logo_path={item.logo_path}
                                job_title={item.job_title}
                                company_name={item.company_name}
                                job_location={item.job_location}
                                salary_range={item.slary_range}
                                time_passed={item.time_passed}
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
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
    },
    listContainer: {
        flex: 1,
        backgroundColor: "#E6F0FA", // 👈 xanh nhạt giống hình bạn gửi
        paddingHorizontal: 10,
        paddingTop: 15,
        marginTop: 10,
    },
    activeTabText: {
        color: "#007bff",
        fontWeight: "600",
    },
    inactiveTabText: {
        color: "#333",
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
});

export default SearchScreen;
