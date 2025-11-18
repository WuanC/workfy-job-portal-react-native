import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import JobCard from "../../components/JobCard";
import { colors } from "../../theme/colors";
import { spacing, borderRadius, shadows } from "../../theme/spacing";
import {
  getEmployerProfile,
  updateEmployerAvatar,
  updateEmployerBG,
} from "../../services/employerService";
import { getCompanySizeLabel } from "../../utilities/constant";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { getEmployerJobOpenings } from "../../services/jobService";
import RenderHTML from "react-native-render-html";
import { useI18n } from "../../hooks/useI18n";

type MyCompanyNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UpdateCompanyInfo" | "UpdateCompanyMedia"
>;

const MyCompany = () => {
  const navigation = useNavigation<MyCompanyNavigationProp>();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");

  const [companyId, setCompanyId] = useState<number | null>(null);
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      const fetchCompany = async () => {
        try {
          const data = await getEmployerProfile();
          setCompany(data);
          setCompanyId(data.id);
        } catch (err) {
          const { ToastService } = require("../../services/toastService");
          ToastService.error("Lỗi", "Không thể tải thông tin công ty.");
        }
      };
      fetchCompany();
    }, [])
  );

  const fetchOpenJobs = async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      setPageNumber(1);
      const data = await getEmployerJobOpenings(companyId, 1, pageSize);
      setOpenJobs(data.items || []);
      if (!data.items || data.items.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      const { ToastService } = require("../../services/toastService");
      ToastService.error("Lỗi", "Không thể tải danh sách công việc.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreJobs = async () => {
    if (loadingMore || !hasMore || !companyId) return;
    try {
      setLoadingMore(true);
      const nextPage = pageNumber + 1;
      const data = await getEmployerJobOpenings(companyId, nextPage, pageSize);
      const newJobs = data.items || [];
      if (newJobs.length === 0) {
        setHasMore(false);
        return;
      }
      setOpenJobs(prev => [...prev, ...newJobs]);
      setPageNumber(nextPage);
      if (newJobs.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Lỗi khi tải thêm công việc:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (companyId) {
        fetchOpenJobs();
      }
    }, [companyId])
  );

  const pickImage = async (onPicked: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const { ToastService } = require("../../services/toastService");
      ToastService.warning("Quyền truy cập bị từ chối", "Vui lòng cấp quyền truy cập ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      onPicked(result.assets[0].uri);
    }
  };

  const onEditBanner = () => {
    pickImage(async (uri) => {
      try {
        setBannerUri(uri);
        const updatedData = await updateEmployerBG(uri);
        setCompany((prev: any) => ({
          ...prev,
          backgroundUrl: updatedData.backgroundUrl,
        }));
        const { ToastService } = require("../../services/toastService");
        ToastService.success("Thành công", "Cập nhật background thành công!");
      } catch (error) {
        console.error(error);
        const { ToastService } = require("../../services/toastService");
        ToastService.error("Lỗi", "Cập nhật background thất bại.");
      }
    });
  };

  const onEditLogo = () => {
    pickImage(async (uri) => {
      try {
        setLogoUri(uri);
        const updatedData = await updateEmployerAvatar(uri);
        setCompany((prev: any) => ({
          ...prev,
          avatarUrl: updatedData.avatarUrl,
        }));
        const { ToastService } = require("../../services/toastService");
        ToastService.success("Thành công", "Cập nhật avatar thành công!");
      } catch (error) {
        console.error(error);
        const { ToastService } = require("../../services/toastService");
        ToastService.error("Lỗi", "Cập nhật avatar thất bại.");
      }
    });
  };

  const Header = () => (
    <View>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={
            bannerUri
              ? { uri: bannerUri }
              : company?.backgroundUrl
              ? { uri: company.backgroundUrl }
              : require("../../../assets/App/companyBannerDefault.jpg")
          }
          style={styles.banner}
        />
        <TouchableOpacity
          style={styles.editBannerButton}
          onPress={onEditBanner}
        >
          <Ionicons name="create-outline" size={20} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>

      {/* Company Info Card */}
      <View style={{ paddingHorizontal: spacing.md }}>
        <View style={styles.headerContainer}>
          <View style={{ position: "relative" }}>
            <Image
              source={
                logoUri
                  ? { uri: logoUri }
                  : company?.avatarUrl
                  ? { uri: company.avatarUrl }
                  : require("../../../assets/App/companyLogoDefault.png")
              }
              style={styles.logo}
            />
            <TouchableOpacity
              style={styles.editLogoButton}
              onPress={onEditLogo}
            >
              <Ionicons name="create-outline" size={16} color={colors.primary.start} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.companyName}>{company?.companyName}</Text>
            <Text style={styles.companyLocation}>
              {company?.district?.name}, {company?.province?.name}, Việt Nam
            </Text>
            <Text style={styles.companySize}>
              {getCompanySizeLabel(company?.companySize)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editIcon}
            onPress={() =>
              navigation.navigate("UpdateCompanyInfo", { id: company?.id })
            }
          >
            <Ionicons name="create-outline" size={20} color={colors.primary.start} />
          </TouchableOpacity>
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
              {t('company.aboutCompany')}
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
              {t('job.jobTitle')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {activeTab === "about" ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header />
          <View style={styles.contentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('company.aboutCompany')}</Text>
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
                <Text style={{ color: "#555" }}>{t('company.aboutCompany')}</Text>
              )}
            </Text>

            {/* Liên hệ */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('job.contactInfo')}</Text>
              <TouchableOpacity
                style={styles.editSmallButton}
                onPress={() => navigation.navigate("UpdateCompanyMedia")}
              >
                <Ionicons name="create-outline" size={18} color="#007bff" />
              </TouchableOpacity>
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
                  {t('search.noResults')}
                </Text>
              );
            })()}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          ListHeaderComponent={<Header />}
          data={openJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              id={item.id}
              logo_path={item.author.avatarUrl}
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
              isEmployer = {true}
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
  editBannerButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    ...shadows.soft,
  },
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
  editLogoButton: {
    position: "absolute",
    bottom: -spacing.sm,
    right: -spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.soft,
  },
  companyName: { fontSize: 20, fontWeight: "800", color: colors.text.primary },
  companyLocation: { fontSize: 14, color: colors.text.secondary },
  companySize: { fontSize: 13, color: colors.text.tertiary },
  editIcon: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    ...shadows.soft,
  },
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
  editSmallButton: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    ...shadows.soft,
  },
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
});

export default MyCompany;