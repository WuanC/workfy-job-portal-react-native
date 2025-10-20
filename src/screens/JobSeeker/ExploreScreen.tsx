"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    FlatList,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SearchBar from "../../components/SearchBar"
import FeaturedJobsSection from "../../components/FeatureJobsSection"
import { useAuth } from "../../context/AuthContext"
import { getLatestPosts } from "../../services/postService"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../types/navigation"
import { useNavigation } from "@react-navigation/native"
import { getPopularIndustries } from "../../services/jobService"

type ExploreNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Blog"
>

const ExploreScreen = () => {
    const [searchValue, setSearchValue] = useState("")
    const [industries, setIndustries] = useState<any[]>([])
    const [careerAdvice, setCareerAdvice] = useState<any[]>([])
    const { user, logout } = useAuth()
    const navigation = useNavigation<ExploreNavigationProp>()

    const colorPalette = [
        "#B3D9FF",
        "#FFE4B3",
        "#FFD1DC",
        "#D1FFD1",
        "#B3FFE6",
        "#E6D1FF",
        "#D1E6FF",
        "#FFEBB3",
    ]

    const handleSearch = () => {
        console.log("Searching for:", searchValue)
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getLatestPosts(5)
            setCareerAdvice(data)
        }
        const fetchIndustries = async () => {
            try {
                const data = await getPopularIndustries(10)
                if (Array.isArray(data)) {
                    const coloredIndustries = data.map((item: any, index: number) => ({
                        ...item,
                        color: colorPalette[index % colorPalette.length],
                    }))
                    setIndustries(coloredIndustries)
                }
            } catch (error) {
                console.error("❌ Lỗi khi load ngành nghề phổ biến:", error)
            }
        }
        fetchIndustries()
        fetchPosts()
    }, [])

    const featuredJobs = [
        {
            id: 1,
            logo_path: require("../../../assets/App/logoJob.png"),
            job_title: "Tenant Management Staff",
            company_name: "Công Ty TNHH Becamex Tokyu",
            job_location: "Bình Dương",
            salary_range: "Thương lượng",
            time_passed: "2 ngày trước",
            applied: false,
        },
        {
            id: 2,
            logo_path: require("../../../assets/App/logoJob.png"),
            job_title:
                "[HCM - CẦN THƠ- ĐÀ NẴNG] NHÂN VIÊN TELESALE - ĐI LÀM NGAY",
            company_name: "Công Ty Cổ Phần Dược Tâm Dược",
            job_location: "Cần Thơ, Đà Nẵng, Hồ Chí Minh",
            salary_range: "15 triệu - 20 triệu",
            time_passed: "3 giờ trước",
            applied: false,
        },
    ]

    const topCompanies = [
        {
            id: 1,
            name: "Công Ty TNHH Vietnam Concentrix Service",
            jobCount: "Đang tuyển 226 công việc",
            location: "Hồ Chí Minh",
            logo: require("../../../assets/App/logoJob.png"),
            bgImage: require("../../../assets/App/banner.jpg"),
        },
        {
            id: 2,
            name: "Công Ty TNHH Aeon Việt Nam",
            jobCount: "Đang tuyển 19 công việc",
            location: "Hà Nội",
            logo: require("../../../assets/App/logoJob.png"),
            bgImage: require("../../../assets/App/banner.jpg"),
        },
    ]

    const renderJobCategory = (category: any) => (
        <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: category.color }]}
        >
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text style={styles.categoryCount}>{category.jobCount} Việc làm</Text>
        </TouchableOpacity>
    )

    const renderCompany = (company: any) => (
        <TouchableOpacity key={company.id} style={styles.companyCard}>
            <Image source={company.bgImage} style={styles.companyBackground} />
            <View style={styles.logoWrap}>
                <Image source={company.logo} style={styles.companyLogo} />
            </View>
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
        const firstRow = industries.slice(0, Math.ceil(industries.length / 2))
        const secondRow = industries.slice(Math.ceil(industries.length / 2))

        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriesWrapper}>
                    <View style={styles.categoryRow}>{firstRow.map(renderJobCategory)}</View>
                    <View style={styles.categoryRow}>{secondRow.map(renderJobCategory)}</View>
                </View>
            </ScrollView>
        )
    }

    return (
        <View style={styles.container}>

            {/* Nội dung */}

            <ScrollView style={styles.content}>
                <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
                {/* Header cố định */}
                <View style={styles.header}>
                    <Image
                        source={require("../../../assets/App/logo.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.headerTitle}>Workify Job Portal</Text>
                    <Text style={styles.headerSubtitle}>
                        Ứng Dụng Tuyển Dụng dành cho{" "}
                        <Text style={styles.highlightText}>Mọi Người</Text>
                    </Text>

                    {/* <View style={{ marginTop: 10, width: "100%", paddingHorizontal: 20 }}>
                        <SearchBar
                            value={searchValue}
                            onChangeText={setSearchValue}
                            onSubmit={handleSearch}
                            placeholder="Tìm kiếm công việc, công ty..."
                        />
                    </View> */}
                </View>
                {/* Job Categories */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Công việc hấp dẫn</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("SearchMain", { initialTab: "industries" })}
                        >
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
                        <TouchableOpacity onPress={() => navigation.navigate("Blog")}>
                            <Text style={styles.seeAllText}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={careerAdvice}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.articleCard}
                                onPress={() => {
                                    if (item?.id) {
                                        console.log("Đi đến bài viết ID:", item.id);
                                        navigation.navigate("ArticleDetail", { id: item.id }); // 👈 Truyền đúng key "id"
                                    } else {
                                        console.warn("⚠️ Bài viết không có id hợp lệ:", item);
                                    }
                                }}>
                                <Image source={item.image} style={styles.articleImage} />
                                <View style={styles.articleContent}>
                                    <Text style={styles.articleCategory}>{item.category}</Text>
                                    <Text style={styles.articleTitle} numberOfLines={3}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.articleDate}>{item.date}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    header: {
        backgroundColor: "#1e3a8a",
        paddingTop: 50,
        paddingBottom: 20,
        alignItems: "center",
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "white",
        textAlign: "center",
    },
    highlightText: { color: "#ff6b35", fontWeight: "bold" },
    content: { flex: 1 },
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
        fontWeight: "bold",
        color: "#333",
    },
    seeAllText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "600",
    },
    categoriesWrapper: { gap: 10 },
    categoryRow: { flexDirection: "row" },
    categoryCard: {
        width: 160,
        padding: 15,
        borderRadius: 12,
        marginRight: 12,
        minHeight: 85,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 5,
        marginBottom: 10,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
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
        top: 50,
        left: 15,
        backgroundColor: "#fff",
        padding: 6,
        borderRadius: 8,
        elevation: 3,
    },
    companyLogo: { width: 40, height: 40, resizeMode: "contain" },
    companyContent: { paddingTop: 30, paddingHorizontal: 15, paddingBottom: 12 },
    companyName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
    },
    companyJobCount: { fontSize: 14, color: "#007AFF", marginBottom: 5 },
    companyLocation: { flexDirection: "row", alignItems: "center" },
    locationText: { fontSize: 13, color: "#666", marginLeft: 4 },
    articleCard: {
        backgroundColor: "white",
        borderRadius: 12,
        marginRight: 15,
        width: 250,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    articleImage: { width: "100%", height: 120, resizeMode: "cover" },
    articleContent: { padding: 12 },
    articleCategory: { fontSize: 12, color: "#ff6b35", fontWeight: "600" },
    articleTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    articleDate: { fontSize: 12, color: "#999" },
})

export default ExploreScreen
