"use client"

import { useState, useRef } from "react"
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
    Animated,
    type NativeSyntheticEvent,
    type NativeScrollEvent,
    ImageBackground,
    FlatList,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SearchBar from "../components/SearchBar"
import JobCard from "../components/JobCard"
import FeaturedJobsSection from "../components/FeatureJobsSection"

const { width } = Dimensions.get("window")

const ExploreScreen = () => {
    const [searchValue, setSearchValue] = useState("")
    const scrollY = useRef(new Animated.Value(0)).current
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
    const HEADER_MAX_HEIGHT = 250
    const HEADER_MIN_HEIGHT = 70 // Reduced min height for compact header
    const chunkArray = (arr: any[], size: number) => {
        const result = []
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size))
        }
        return result
    }
    const handleSearch = () => {
        console.log("Searching for:", searchValue)
    }

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: "clamp",
    })

    const headerContentOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0],
        extrapolate: "clamp",
    })
    const contentPaddingTop = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT, 0], // hoặc [HEADER_MAX_HEIGHT, 0] nếu bạn muốn mất hẳn
        extrapolate: "clamp",
    })
    const searchBarTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 0], // Remove translateY to keep search bar in original position
        extrapolate: "clamp",
    })

    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 500],
        outputRange: ["rgba(30, 58, 138, 1)", "rgba(250, 250, 250, 1)"],
        extrapolate: "clamp",
    })

    const jobCategories = [
        { id: 1, title: "An Ninh / Bảo Vệ", count: "72 Việc làm", color: "#B3D9FF" },
        { id: 2, title: "An Toàn Lao Động", count: "254 Việc làm", color: "#FFE4B3" },
        { id: 3, title: "Bán hàng / Kinh doanh", count: "15098 Việc làm", color: "#FFD1DC" },
        { id: 4, title: "Bán lẻ", count: "3083 Việc làm", color: "#D1FFD1" },
        { id: 5, title: "Mới tốt nghiệp / Thực tập", count: "2131 Việc làm", color: "#B3FFE6" },
        { id: 6, title: "Ngân hàng / Chứng khoán", count: "928 Việc làm", color: "#E6D1FF" },
        { id: 7, title: "Nghệ thuật / Thiết kế / Giải trí", count: "626 Việc làm", color: "#D1E6FF" },
        { id: 8, title: "Người giúp việc", count: "4 Việc làm", color: "#FFEBB3" },
    ]

    const featuredJobs = [
        {
            id: 1,
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "Tenant Management Staff",
            company_name: "Công Ty TNHH Becamex Tokyu",
            job_location: "Bình Dương",
            salary_range: "Thương lượng",
            time_passed: "2 ngày trước",
            applied: false,
        },
        {
            id: 2,
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "[HCM - CẦN THƠ- ĐÀ NẴNG] NHÂN VIÊN TELESALE - ĐI LÀM NGAY",
            company_name: "Công Ty Cổ Phần Dược Tâm Dược",
            job_location: "Cần Thơ, Đà Nẵng, Hồ Chí Minh",
            salary_range: "15 triệu - 20 triệu",
            time_passed: "3 giờ trước",
            applied: false,
        },
        {
            id: 3,
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "Nhân Viên Sales",
            company_name: "Công ty TNHH DK Vina",
            job_location: "Hồ Chí Minh",
            salary_range: "10 triệu - 13 triệu",
            time_passed: "13 giờ trước",
            applied: false,
        },
        {
            id: 4,
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "3D Game Designer (Thiết Kế Đồ Họa Game 3D) - Thu Nhập Lên Đến 35...",
            company_name: "Beetechsoft",
            job_location: "Hồ Chí Minh, Hà Nội",
            salary_range: "20 triệu - 30 triệu",
            time_passed: "5 ngày trước",
            applied: false,
        },
        {
            id: 5,
            logo_path: require("../../assets/App/logoJob.png"),
            job_title: "[HN] Intern Tester (Tiếng Nhật N3 Trở Lên)",
            company_name: "CÔNG TY CỔ PHẦN VNEXT SOFTWARE",
            job_location: "Hà Nội",
            salary_range: "3 triệu",
            time_passed: "7 ngày trước",
            applied: false,
        },
    ]

    const topCompanies = [
        {
            id: 1,
            name: "Công Ty TNHH Vietnam Concentrix Service",
            jobCount: "Đang tuyển 226 công việc",
            location: "Hồ Chí Minh",
            logo: require("../../assets/App/logoJob.png"),
            bgImage: require("../../assets/App/banner.jpg"),
        },
        {
            id: 2,
            name: "Công Ty TNHH Aeon Việt Nam",
            jobCount: "Đang tuyển 19 công việc",
            location: "Hà Nội",
            logo: require("../../assets/App/logoJob.png"),
            bgImage: require("../../assets/App/banner.jpg"),
        },
    ]

    const careerAdvice = [
        {
            id: 1,
            title: "PQC Là Gì? Tất Tần Tật Về Công Việc Nhân Viên Kiểm Soát Quy Trình",
            category: "Tư vấn nghề nghiệp",
            date: "Th09 23, 2025",
            image: require("../../assets/App/banner.jpg"),
        },
        {
            id: 2,
            title: "Top Kỹ Năng Của Nhân Viên Kỹ Thuật",
            category: "Tư vấn nghề nghiệp",
            date: "Th09 23, 2025",
            image: require("../../assets/App/banner.jpg"),
        },
    ]

    const renderJobCategory = (category: any) => (
        <TouchableOpacity key={category.id} style={[styles.categoryCard, { backgroundColor: category.color }]}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryCount}>{category.count}</Text>
        </TouchableOpacity>
    )


    const renderCompany = (company: any) => (
        <TouchableOpacity key={company.id} style={styles.companyCard}>
            {/* Background ảnh */}
            <Image source={company.bgImage} style={styles.companyBackground} />

            {/* Logo nổi giữa background và nội dung */}
            <View style={styles.logoWrap}>
                <Image source={company.logo} style={styles.companyLogo} />
            </View>

            {/* Nội dung text */}
            <View style={styles.companyContent}>
                <Text numberOfLines={2} style={styles.companyName}>
                    {company.name}
                </Text>
                <Text style={styles.companyJobCount}>{company.jobCount}</Text>
                <View style={styles.companyLocation}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.locationText}>{company.location}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )


    const renderJobCategoriesGrid = () => {
        const firstRow = jobCategories.slice(0, Math.ceil(jobCategories.length / 2))
        const secondRow = jobCategories.slice(Math.ceil(jobCategories.length / 2))

        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                <View style={styles.categoriesWrapper}>
                    <View style={styles.categoryRow}>{firstRow.map(renderJobCategory)}</View>
                    <View style={styles.categoryRow}>{secondRow.map(renderJobCategory)}</View>
                </View>
            </ScrollView>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#cbd6f1ff" />

            <Animated.View
                style={[
                    styles.header,
                    {
                        height: headerHeight,
                        backgroundColor: headerBackgroundColor,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.headerContent,
                        {
                            opacity: headerContentOpacity,
                        },
                    ]}
                >
                    <Image source={require("../../assets/App/logo.png")} style={styles.logo} />
                    <Text style={styles.headerTitle}>Workify Job Portal</Text>
                    <Text style={styles.headerSubtitle}>
                        Ứng Dụng Tuyển Dụng dành cho <Text style={styles.highlightText}>Mọi Người</Text>
                    </Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.searchContainer,
                        {
                            transform: [{ translateY: searchBarTranslateY }],
                            position: "absolute",
                            bottom: 10,
                            left: 20,
                            right: 20,
                        },
                    ]}
                >
                    <SearchBar
                        value={searchValue}
                        onChangeText={setSearchValue}
                        onSubmit={handleSearch}
                        placeholder="Tìm kiếm công việc, công ty..."
                    />
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                style={[styles.content, { paddingTop: contentPaddingTop, }]}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: false,
                    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                        const offsetY = event.nativeEvent.contentOffset.y
                        setIsHeaderCollapsed(offsetY > 50)
                    },
                })}
                scrollEventThrottle={16}
            >
                {/* Job Categories */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Công việc hấp dẫn</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    {renderJobCategoriesGrid()}
                </View>

                {/* Featured Jobs */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gợi ý việc làm</Text>
                    <FeaturedJobsSection featuredJobs={featuredJobs} />
                </View>


                {/* Top Companies */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nhà tuyển dụng hàng đầu</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {topCompanies.map(renderCompany)}

                    </ScrollView>
                </View>

                {/* Career Advice */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Cẩm nang tìm việc</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={careerAdvice}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.articleCard}>
                                <Image source={item.image} style={styles.articleImage} />
                                <View style={styles.articleContent}>
                                    <Text style={styles.articleCategory}>{item.category}</Text>
                                    <Text style={styles.articleTitle} numberOfLines={3}>{item.title}</Text>
                                    <Text style={styles.articleDate}>{item.date}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />

                </View>
            </Animated.ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        paddingBottom: 40,
        paddingHorizontal: 20,
        justifyContent: "space-between", // Better spacing for header content
    },
    headerContent: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    logo: {
        width: 60, // Reduced initial logo size
        height: 60,
        resizeMode: "contain",
        marginBottom: 8, // Reduced margin
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "white",
        textAlign: "center",
        lineHeight: 22,
    },
    highlightText: {
        color: "#ff6b35",
        fontWeight: "bold",
    },
    content: {
        flex: 1,
    },
    searchContainer: {},
    section: {
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "#333",
    },
    seeAllText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "600",
    },
    categoriesContainer: {
        flexDirection: "row",
    },
    categoriesWrapper: {
        gap: 10,
    },
    categoryRow: {
        flexDirection: "row",
    },
    categoryCard: {
        width: 160,
        padding: 15,
        borderRadius: 12,
        marginRight: 12,
        minHeight: 85,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
        lineHeight: 18,
    },
    categoryCount: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    companyInfo: {
        flex: 1,
    },
    articleCard: {
        backgroundColor: "white",
        borderRadius: 12,
        marginRight: 15,
        width: 250,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    articleImage: {
        width: "100%",
        height: 120,
        resizeMode: "cover",
    },
    articleContent: {
        padding: 12,
    },
    articleCategory: {
        fontSize: 12,
        color: "#ff6b35",
        fontWeight: "600",
        marginBottom: 5,
    },
    articleTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        lineHeight: 18,
        marginBottom: 8,
    },
    articleDate: {
        fontSize: 12,
        color: "#999",
    },
    companyCard: {
        backgroundColor: "white",
        borderRadius: 12,
        marginRight: 15,
        marginTop: 10,
        width: 280,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        overflow: "hidden",
    },

    companyBackground: {
        width: "100%",
        height: 80,
        resizeMode: "cover",
    },

    logoWrap: {
        position: "absolute",
        top: 50, // nằm chồng lên phần dưới của background
        left: 15,
        backgroundColor: "#fff",
        padding: 6,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },

    companyLogo: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },

    companyContent: {
        paddingTop: 30, // để tránh bị logo che
        paddingHorizontal: 15,
        paddingBottom: 12,
    },

    companyName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
        lineHeight: 20,
    },

    companyJobCount: {
        fontSize: 14,
        color: "#007AFF",
        marginBottom: 5,
        fontWeight: "600",
    },

    companyLocation: {
        flexDirection: "row",
        alignItems: "center",
    },

    locationText: {
        fontSize: 13,
        color: "#666",
        marginLeft: 4,
    },

})

export default ExploreScreen
