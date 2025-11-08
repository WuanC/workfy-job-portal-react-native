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
import { LinearGradient } from "expo-linear-gradient"
import SearchBar from "../../components/SearchBar"
import FeaturedJobsSection from "../../components/FeatureJobsSection"
import { useAuth } from "../../context/AuthContext"
import { getLatestPosts } from "../../services/postService"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../types/navigation"
import { useNavigation } from "@react-navigation/native"
import { getPopularIndustries, getTopAttractiveJobs } from "../../services/jobService"
import { colors } from "../../theme/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { getTopHiringEmployers } from "../../services/employerService"

type ExploreNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Blog"
>

const ExploreScreen = () => {
    const [searchValue, setSearchValue] = useState("")
    const [industries, setIndustries] = useState<any[]>([])
    const [careerAdvice, setCareerAdvice] = useState<any[]>([])
    const [topCompanies, setTopCompanies] = useState<any[]>([])
    const [topAttractiveJobs, setTopAttractiveJobs] = useState<any[]>([])
    const navigation = useNavigation<ExploreNavigationProp>()


    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getLatestPosts(5)
            setCareerAdvice(data)
        }
        const fecthTopCompanies = async () => {
            const datas = await getTopHiringEmployers(10)
            setTopCompanies(datas)
        }
        const fetchTopAttractiveJobs = async () => {
            const datas = await getTopAttractiveJobs(12)
            setTopAttractiveJobs(datas)
        }
        const fetchIndustries = async () => {
            try {
                const data = await getPopularIndustries(10)
                if (Array.isArray(data)) {
                    const flatColors = [
                        "#e0f2fe", // xanh nhạt
                        "#fee2e2", // đỏ nhạt
                        "#fef9c3", // vàng nhạt
                        "#dcfce7", // xanh lá nhạt
                        "#fae8ff", // tím nhạt
                        "#f3f4f6", // xám nhạt
                        "#ede9fe", // tím sáng
                        "#fef3c7", // cam nhạt
                    ]

                    const coloredIndustries = data.map((item: any, index: number) => ({
                        ...item,
                        color: flatColors[index % flatColors.length],
                    }))
                    setIndustries(coloredIndustries)
                }
            } catch (error) {
                console.error("❌ Lỗi khi load ngành nghề phổ biến:", error)
            }
        }
        fetchIndustries()
        fetchPosts()
        fecthTopCompanies()
        fetchTopAttractiveJobs()
    }, [])

    // const featuredJobs = [
    //     {
    //         id: 1,
    //         logo_path: require("../../../assets/App/logoJob.png"),
    //         job_title: "Tenant Management Staff",
    //         company_name: "Công Ty TNHH Becamex Tokyu",
    //         job_location: "Bình Dương",
    //         salary_range: "Thương lượng",
    //         time_passed: "2 ngày trước",
    //         applied: false,
    //     },
    //     {
    //         id: 2,
    //         logo_path: require("../../../assets/App/logoJob.png"),
    //         job_title:
    //             "[HCM - CẦN THƠ- ĐÀ NẴNG] NHÂN VIÊN TELESALE - ĐI LÀM NGAY",
    //         company_name: "Công Ty Cổ Phần Dược Tâm Dược",
    //         job_location: "Cần Thơ, Đà Nẵng, Hồ Chí Minh",
    //         salary_range: "15 triệu - 20 triệu",
    //         time_passed: "3 giờ trước",
    //         applied: false,
    //     },
    // ]

    // const topCompanies = [
    //     {
    //         id: 1,
    //         name: "Công Ty TNHH Vietnam Concentrix Service",
    //         jobCount: "Đang tuyển 226 công việc",
    //         location: "Hồ Chí Minh",
    //         logo: require("../../../assets/App/logoJob.png"),
    //         bgImage: require("../../../assets/App/banner.jpg"),
    //     },
    //     {
    //         id: 2,
    //         name: "Công Ty TNHH Aeon Việt Nam",
    //         jobCount: "Đang tuyển 19 công việc",
    //         location: "Hà Nội",
    //         logo: require("../../../assets/App/logoJob.png"),
    //         bgImage: require("../../../assets/App/banner.jpg"),
    //     },
    // ]

    const renderJobCategory = (category: any) => (
        <TouchableOpacity key={category.id}>
            <View style={[styles.categoryCard, { backgroundColor: category.color }]}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.jobCount} việc làm</Text>
            </View>
        </TouchableOpacity>
    );

    const renderCompany = (company: any) => (
        <TouchableOpacity key={company.id} style={styles.companyCard}>
            <Image source={
                company.backgroundUrl
                    ? typeof company.backgroundUrl === "string"
                        ? { uri: company.backgroundUrl }
                        : company.backgroundUrl
                    : require("../../../assets/App/companyBannerDefault.jpg")

            } style={styles.companyBackground} />
            <View style={styles.logoWrap}>
                <Image source={
                    company.avatarUrl
                        ? typeof company.avatarUrl === "string"
                            ? { uri: company.avatarUrl }
                            : company.avatarUrl
                        : require("../../../assets/App/companyLogoDefault.png")

                } style={styles.companyLogo} />
            </View>
            <View style={styles.companyContent}>
                <Text numberOfLines={2} style={styles.companyName}>
                    {company.companyName}
                </Text>
                <Text style={styles.companyJobCount}>Đang tuyển {company.numberOfHiringJobs} công việc</Text>
                <View style={styles.companyLocation}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.locationText}>{company.province.name}</Text>
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
            <StatusBar barStyle="light-content" backgroundColor={"#667eea"} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Modern Header with Gradient */}
                <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <Image
                            source={require("../../../assets/App/logo.png")}
                            style={styles.logo}
                        />
                        <Text style={styles.headerTitle}>Workify Job Portal</Text>
                        <Text style={styles.headerSubtitle}>
                            Ứng Dụng Tuyển Dụng dành cho{" "}
                            <Text style={styles.highlightText}>Mọi Người</Text>
                        </Text>
                    </View>

                    {/* Decorative circles */}
                    <View style={styles.decorativeCircle1} />
                    <View style={styles.decorativeCircle2} />
                </LinearGradient>
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
                    <FeaturedJobsSection featuredJobs={topAttractiveJobs} />
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
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1 },
    header: {
        paddingTop: 50,
        paddingBottom: 20, // giảm từ 30 xuống 20
        position: "relative",
        overflow: "hidden",
    },
    headerContent: { alignItems: "center", zIndex: 2 },
    decorativeCircle1: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.1)", top: -50, right: -50 },
    decorativeCircle2: { position: "absolute", width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.08)", bottom: -30, left: -30 },
    logo: { width: 70, height: 70, resizeMode: "contain", marginBottom: 8 }, // giảm marginBottom
    headerTitle: { fontSize: 32, fontWeight: "800", color: colors.text.inverse },
    headerSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.95)", textAlign: "center", marginTop: 4 },
    highlightText: { color: "#ffd700", fontWeight: "800" },
    section: {
        marginTop: 16,    // giảm từ 24 xuống 16
        marginBottom: 24, // giảm từ 32 xuống 24
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12, // giảm từ 16 xuống 12
    },
    sectionTitle: { fontSize: 22, fontWeight: "800", color: colors.text.primary },
    seeAllText: { fontSize: 15, color: colors.primary.start, fontWeight: "700" },
    categoriesWrapper: { gap: 8 }, // giảm gap
    categoryRow: { flexDirection: "row", marginBottom: 5 },
    companyCard: { backgroundColor: colors.surface, borderRadius: 20, marginRight: 12, marginTop: 8, width: 260, overflow: "hidden" },
    companyBackground: { width: "100%", height: 70, resizeMode: "cover" }, // giảm height
    logoWrap: { position: "absolute", top: 45, left: 12, backgroundColor: colors.surface, padding: 4, borderRadius: 6 },
    companyLogo: { width: 36, height: 36 },
    companyContent: { paddingTop: 26, paddingHorizontal: 12, paddingBottom: 10 },
    companyName: { fontSize: 15, fontWeight: "700", color: colors.text.primary, marginBottom: 4 },
    companyJobCount: { fontSize: 13, color: colors.primary.start, marginBottom: 4, fontWeight: "600" },
    companyLocation: { flexDirection: "row", alignItems: "center" },
    locationText: { fontSize: 12, color: colors.text.secondary, marginLeft: 4 },
    articleCard: { backgroundColor: colors.surface, borderRadius: 18, marginRight: 12, width: 240, overflow: "hidden" },
    articleImage: { width: "100%", height: 130, resizeMode: "cover" }, // giảm height
    articleContent: { padding: 12 },
    articleCategory: { fontSize: 11, color: "#f5576c", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
    articleTitle: { fontSize: 14, fontWeight: "700", color: colors.text.primary, marginTop: 4, marginBottom: 4, lineHeight: 20 },
    articleDate: { fontSize: 11, color: colors.text.tertiary, fontWeight: "500" },
    categoryCard: {
        width: 170,
        padding: 16,
        borderRadius: 24,
        marginRight: 12,
        minHeight: 100,
        justifyContent: "center",
        backgroundColor: "#ffffff",

        // đổ bóng mềm như JobCard
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,

        // viền nhẹ cho rõ ranh giới
        borderWidth: 1,
        borderColor: "#f2f2f2",
    },

    categoryTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
    },

    categoryCount: {
        fontSize: 13,
        fontWeight: "500",
        color: "#6b7280",
    },



})

export default ExploreScreen
