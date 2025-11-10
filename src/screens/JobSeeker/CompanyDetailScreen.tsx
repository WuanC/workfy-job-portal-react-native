import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import JobCard from "../../components/JobCard";
import { getEmployerById } from "../../services/employerService";
import { getCompanySizeLabel } from "../../utilities/constant";
import RenderHTML from "react-native-render-html";
import { getEmployerJobOpenings } from "../../services/jobService";
import { colors } from "../../theme/colors";
import { spacing, borderRadius, shadows } from "../../theme/spacing";

const CompanyDetailScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");
  const { id } = route.params as { id: number };
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>()
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { width } = useWindowDimensions();
  useEffect(() => {
    let cancelled = false; // flag để tránh setState sau unmount

    const load = async () => {
      try {
        setLoading(true);
        const companyData = await getEmployerById(id);
        setCompany(companyData)
        if (cancelled) return;

      } catch (err: any) {
        if (cancelled) return;
        console.error("Lỗi load", err);
      } finally {
        if (!cancelled) { }
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);



  const fetchOpenJobs = async (page: number = 1, append: boolean = false) => {
    if (!id) return;
    try {
      if (page === 1) setLoading(true);
      const data = await getEmployerJobOpenings(id, page, pageSize);
      const items = data?.items || [];
      if (append) setOpenJobs((prev) => [...prev, ...items]);
      else setOpenJobs(items);

      if (!items || items.length < pageSize) setHasMore(false);
      else setHasMore(true);

      setPageNumber(page);
    } catch (err) {
      const { ToastService } = require("../../services/toastService");
      ToastService.error("Lỗi", "Không thể tải danh sách công việc.");
    } finally {
      if (page === 1) setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreJobs = async () => {
    if (loadingMore || loading || !hasMore) return;
    try {
      setLoadingMore(true);
      const next = pageNumber + 1;
      await fetchOpenJobs(next, true);
    } catch (err) {
      console.error("Lỗi khi tải thêm công việc:", err);
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      // load first page when screen focuses or id changes
      setHasMore(true);
      fetchOpenJobs(1, false);
    }, [id])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={{ marginTop: 10, color: "#333" }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const Header = () => (
    <View>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={
            company.backgroundUrl
              ? typeof company.backgroundUrl === "string"
                ? { uri: company.backgroundUrl }
                : company.backgroundUrl
              : require("../../../assets/App/companyBannerDefault.jpg")
          }
          style={styles.banner}
        />
      </View>

      {/* Company Info Card */}
      <View style={{ paddingHorizontal: spacing.md }}>
        <View style={styles.headerContainer}>
          <Image
            source={
              company.avatarUrl
                ? typeof company.avatarUrl === "string"
                  ? { uri: company.avatarUrl }
                  : company.avatarUrl
                : require("../../../assets/App/companyLogoDefault.png")
            }
            style={styles.logo}
          />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.companyName}>{company?.companyName}</Text>
            <Text style={styles.companyLocation}>
              {company?.district?.name}, {company?.province?.name}, Việt Nam
            </Text>
            <Text style={styles.companySize}>
              {getCompanySizeLabel(company?.companySize)}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "about" && styles.activeTab]}
          onPress={() => setActiveTab("about")}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={activeTab === "about" ? colors.text.inverse : colors.text.primary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.activeTabText,
              ]}
            >
              About us
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "jobs" && styles.activeTab]}
          onPress={() => setActiveTab("jobs")}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Ionicons
              name="briefcase-outline"
              size={18}
              color={activeTab === "jobs" ? colors.text.inverse : colors.text.primary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "jobs" && styles.activeTabText,
              ]}
            >
              Opening jobs
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
      {activeTab === "about" ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header />
          <View style={styles.contentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Giới thiệu công ty</Text>
            </View>
            <Text style={styles.description}>
              {company?.aboutCompany ? (
                <RenderHTML
                  contentWidth={width}
                  source={{ html: company.aboutCompany }}
                  tagsStyles={{
                    p: { color: "#444", fontSize: 14, lineHeight: 20, textAlign: "justify" },
                    b: { fontWeight: "bold" },
                    strong: { fontWeight: "bold" },
                    i: { fontStyle: "italic" },
                  }}
                />
              ) : (
                <Text style={{ color: "#555" }}>Chưa có mô tả về công ty.</Text>
              )}
            </Text>

            {/* Liên hệ */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Phương tiện & Liên hệ</Text>
            </View>

            {/* Website + Mạng xã hội */}
            {(() => {
              const links = [
                ...(company?.websiteUrls || []).map((url: string, i: number) => ({
                  icon: "globe-outline",
                  color: "#007bff",
                  url,
                })),
                { icon: "logo-facebook", color: "#3b5998", url: company?.facebookUrl },
                { icon: "logo-twitter", color: "#1DA1F2", url: company?.twitterUrl },
                { icon: "logo-linkedin", color: "#0077b5", url: company?.linkedinUrl },
                { icon: "logo-google", color: "#DB4437", url: company?.googleUrl },
                { icon: "logo-youtube", color: "#FF0000", url: company?.youtubeUrl },
              ].filter((l) => l.url);

              return links.length > 0 ? (
                links.map((l, i) => (
                  <View style={styles.infoRow} key={i}>
                    <Ionicons name={l.icon as any} size={18} color={l.color} />
                    <Text style={styles.infoText}>{l.url}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "#555", marginVertical: 4 }}>
                  Không có mạng xã hội
                </Text>
              );
            })()}
          </View>
        </ScrollView>
      ) : (
        <FlatList
            ListHeaderComponent={<Header />}
            data={openJobs}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <JobCard
                id={item.id}
                logo_path={company.avatarUrl}
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
            onEndReached={loadMoreJobs}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() =>
              loadingMore ? (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.primary.start} />
                </View>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bannerContainer: { position: "relative", backgroundColor: colors.primary.start },
  banner: { width: "100%", height: 200 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.soft,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: colors.primary.start,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  companyName: { fontSize: 20, fontWeight: "800", color: colors.text.primary },
  companyLocation: { fontSize: 14, color: colors.text.secondary },
  companySize: { fontSize: 13, color: colors.text.tertiary },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  activeTab: { backgroundColor: colors.primary.start },
  tabText: { color: colors.text.primary, fontWeight: "600", fontSize: 15 },
  activeTabText: { color: colors.text.inverse, fontWeight: "700" },
  contentContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: "justify",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 10,
    ...shadows.soft,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 10,
    ...shadows.soft,
  },
  infoText: { marginLeft: spacing.md, color: colors.primary.start, fontSize: 15 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
  },
  safeArea: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    marginTop: Platform.OS === "ios" ? 10 : 30,
    marginLeft: 15,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 22,
    padding: 6,
    alignSelf: "flex-start",
  },
});


export default CompanyDetailScreen;