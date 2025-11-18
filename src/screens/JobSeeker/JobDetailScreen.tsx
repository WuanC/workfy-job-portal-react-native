import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { Benefit, getJobById } from "../../services/jobService";
import {
  getCompanySizeLabel,
  getEducationLevelLabel,
  getExperienceLevelLabel,
  getJobGenderLabel,
  getJobLevelLabel,
  getJobTypeLabel,
} from "../../utilities/constant";
import RenderHTML, { MixedStyleDeclaration } from "react-native-render-html";
import { colors } from "../../theme/colors";
import { checkJobSaved, toggleSaveJob } from "../../services/saveJobService";
import { useI18n } from "../../hooks/useI18n";

type JobSubmitNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "JobSubmit" | "CompanyDetail"
>;

const keywords = [
  "Tiếng Anh",
  "Marketing",
  "TP Thủ Dầu Một",
  "R&D",
  "Nhân viên nghiên cứu thị trường",
];

const JobDetailScreen = ({ route }: any) => {
  const { id } = route.params as { id: number };
  const navigation = useNavigation<JobSubmitNavigationProp>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { t, isEnglish } = useI18n();
  const { width } = useWindowDimensions();

  const [job, setJob] = useState<any>(null);
  const [isSavedJob, setIsSaveJob] = useState<boolean>(false)
  const [loading, setLoading] = useState(true);

  // Header animation
  const HEADER_MAX_HEIGHT = 76;
  const HEADER_MIN_HEIGHT = 76;
  const HEADER_SCROLL_DISTANCE = 120;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 1.5],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(id);
        const isSavedJob = await checkJobSaved(id);
        setIsSaveJob(isSavedJob);
        if (!cancelled) setJob(jobData);
      } catch (err) {
        console.error("Lỗi load job:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);
  const handleToggleSave = async () => {
    try {
      await toggleSaveJob(id)
      setIsSaveJob(!isSavedJob)
    }
    catch (e) {
      console.error(e)
    }

  };
  // Loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.start} />
        <Text style={styles.loadingText}>{t('job.loadingJob')}</Text>
      </View>
    );
  }

  // Not found
  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle" size={48} color={colors.error.start} />
        <Text style={styles.errorText}>{t('job.notFound')}</Text>
        <TouchableOpacity
          style={styles.backErrorBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backErrorText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* Header khi scroll xuống */}
        <Animated.View
          style={[
            styles.scrollHeader,
            {
              height: headerHeight,
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <View style={styles.scrollHeaderContent}>
            <TouchableOpacity
              style={styles.backBtnScroll}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
            </TouchableOpacity>

            <Text style={styles.scrollHeaderTitle} numberOfLines={1}>
              {job.jobTitle}
            </Text>
            <View style={{ width: 40 }} />
          </View>
        </Animated.View>

        {/* Nội dung */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Banner */}
          <View style={styles.bannerContainer}>
            <Image
              source={
                job.author.backgroundUrl
                  ? { uri: job.author.backgroundUrl }
                  : require("../../../assets/App/companyBannerDefault.jpg")
              }
              style={styles.banner}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.bannerOverlay}
            />
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.companyHeader}>
              <View style={styles.logoWrapper}>
                <Image
                  source={
                    job.author.avatarUrl
                      ? { uri: job.author.avatarUrl }
                      : require("../../../assets/App/companyLogoDefault.png")
                  }
                  style={styles.logo}
                />
              </View>
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{job.companyName}</Text>
                <Text style={styles.jobTitle}>{job.jobTitle}</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.infoGrid}>
              <InfoBox
                icon="location"
                gradient={["#667eea", "#764ba2"]}
                label={t('job.location')}
                value={`${job.jobLocations[0]?.district?.name || ""}, ${job.jobLocations[0]?.province?.name || ""}`}
              />
              <InfoBox
                icon="cash"
                gradient={["#f2994a", "#f2c94c"]}
                label={t('job.salary')}
                value={
                  job.salaryType === "RANGE"
                    ? `${(job.minSalary || 0).toLocaleString()} - ${(job.maxSalary || 0).toLocaleString()} ${job.salaryUnit || ""}`
                    : job.salaryType === "GREATER_THAN"
                      ? `Trên ${(job.minSalary || 0).toLocaleString()} ${job.salaryUnit || ""}`
                      : job.salaryType === "NEGOTIABLE"
                        ? "Thỏa thuận"
                        : job.salaryType === "COMPETITIVE"
                          ? "Cạnh tranh"
                          : "Không rõ"
                }
              />
              <InfoBox
                icon="briefcase"
                gradient={["#11998e", "#38ef7d"]}
                label={t('job.experience')}
                value={getExperienceLevelLabel(job.experienceLevel)}
              />
              <InfoBox
                icon="calendar"
                gradient={["#4facfe", "#00f2fe"]}
                label={t('job.deadline')}
                value={job.expirationDate}
              />
            </View>
          </View>

          {/* Mô tả */}
          <Section title={t('job.jobDescription')}>
            <RenderHTML
              contentWidth={width - 40}
              source={{ html: job.jobDescription || "<p>Chưa có mô tả.</p>" }}
              tagsStyles={htmlStyles}
            />
          </Section>
          <Section title={t('job.benefits')}>
            {job.jobBenefits?.length > 0 ? (
              job.jobBenefits.map((b: Benefit, i: number) => (
                <View key={i} style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>{b.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>{t('job.noBenefits')}</Text>
            )}
          </Section>
          {/* Yêu cầu */}
          <Section title={t('job.requirements')}>
            <RenderHTML
              contentWidth={width - 40}
              source={{ html: job.requirement || "<p>Chưa có yêu cầu.</p>" }}
              tagsStyles={htmlStyles}
            />
          </Section>

          {/* Chi tiết */}
          <Section title={t('job.recruitmentDetails')}>
            <View style={styles.detailGrid}>
              <DetailBox label={t('job.jobType')} value={getJobTypeLabel(job.jobType)} />
              <DetailBox label={t('job.gender')} value={getJobGenderLabel(job.gender)} />
              <DetailBox label={t('job.jobLevel')} value={getJobLevelLabel(job.jobLevel)} />
              <DetailBox label={t('job.educationLevel')} value={getEducationLevelLabel(job.educationLevel)} />
            </View>
            <View style={styles.detailBoxFull}>
              <Text style={styles.detailLabel}>{t('job.industry')}</Text>
              <Text style={styles.detailValue}>
                {job.industries?.length > 0
                  ? job.industries.map((i: any) => isEnglish ? i.engName : i.name).join(", ")
                  : isEnglish ? "Not specified" : "Không xác định"}
              </Text>
            </View>
          </Section>

          {/* Phúc lợi */}

          {/* Thông tin liên hệ*/}
          <Section title={t('job.contactInfo')}>
            <RenderHTML
              contentWidth={width - 40}
              source={{ html: job.description || "<p>Chưa có yêu cầu.</p>" }}
              tagsStyles={htmlStyles}
            />
          </Section>
          {/* Về công ty */}
          <Section title={t('company.aboutCompany')}>
            <TouchableOpacity
              style={styles.companyCard}
              onPress={() => navigation.navigate("CompanyDetail", { id: job.author.id })}
            >
              <Image
                source={
                  job.author.avatarUrl
                    ? { uri: job.author.avatarUrl }
                    : require("../../../assets/App/companyLogoDefault.png")
                }
                style={styles.companyLogo}
              />
              <View style={styles.companyCardInfo}>
                <Text style={styles.companyCardName}>{job.companyName}</Text>
                <View style={styles.row}>
                  <Ionicons name="briefcase-outline" size={14} color="#666" />
                  <Text style={styles.companyMeta}>15 việc đang tuyển</Text>
                  <Ionicons name="people-outline" size={14} color="#666" style={{ marginLeft: 12 }} />
                  <Text style={styles.companyMeta}>{getCompanySizeLabel(job.companySize)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            {/* {job.aboutCompany && (
              <RenderHTML
                contentWidth={width - 40}
                source={{ html: job.aboutCompany }}
                tagsStyles={htmlStyles}
              />
            )} */}
          </Section>

          {/* Từ khóa */}
          {/* <Section title={t('job.keywords')}>
            <View style={styles.keywordContainer}>
              {keywords.map((kw, i) => (
                <TouchableOpacity key={i} style={styles.keywordTag}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section> */}
        </Animated.ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary.start} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleToggleSave}>
            <Ionicons
              name={isSavedJob ? "heart" : "heart-outline"}
              size={24}
              color={isSavedJob ? "#f5576c" : colors.primary.start}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => navigation.navigate("JobSubmit", { jobId: job.id, jobName: job.jobTitle })}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.applyGradient}
            >
              <Text style={styles.applyText}>{t('job.applyNow')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ==== COMPONENT CON =====
const InfoBox = ({ icon, gradient, label, value }: any) => (
  <View style={styles.infoItem}>
    <LinearGradient colors={gradient} style={styles.iconCircle}>
      <Ionicons name={icon} size={18} color="#fff" />
    </LinearGradient>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  </View>
);

const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const DetailBox = ({ label, value }: any) => (
  <View style={styles.detailBox}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default JobDetailScreen;

// ==== STYLES ====
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#666" },
  errorText: { fontSize: 18, color: colors.error.start, fontWeight: "600" },
  backErrorBtn: { marginTop: 16, backgroundColor: colors.primary.start, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  backErrorText: { color: "#fff", fontWeight: "600" },

  scrollHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  scrollHeaderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backBtnScroll: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" },
  scrollHeaderTitle: { flex: 1, textAlign: "center", fontWeight: "700", fontSize: 16, color: "#1a1a1a" },

  bannerContainer: { position: "relative" },
  banner: { width: "100%", height: 220 },
  bannerOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: 120 },
  backBtn: { position: "absolute", top: 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCard: { backgroundColor: "#fff", marginTop: -24, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 24, paddingHorizontal: 20 },
  companyHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  logoWrapper: { width: 72, height: 72, borderRadius: 20, backgroundColor: "#fff", padding: 6, elevation: 6 },
  logo: { width: "100%", height: "100%", borderRadius: 14 },
  companyInfo: { flex: 1, marginLeft: 16 },
  companyName: { fontSize: 15, color: "#666", fontWeight: "600" },
  jobTitle: { fontSize: 22, fontWeight: "800", color: "#1a1a1a", marginTop: 4 },

  infoGrid: {
    flexDirection: "column",
    marginTop: 8,
    gap: 10,
  },

  infoItem: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  infoLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "700",
  },

  section: { backgroundColor: "#fff", marginTop: 16, paddingHorizontal: 20, paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 14, color: "#1a1a1a" },

  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  detailBox: { backgroundColor: "#f8f9fa", padding: 14, borderRadius: 14, width: "47%", borderWidth: 1, borderColor: "#eee" },
  detailBoxFull: { backgroundColor: "#f8f9fa", padding: 14, borderRadius: 14, marginTop: 12, borderWidth: 1, borderColor: "#eee" },
  detailLabel: { fontSize: 12, color: "#777" },
  detailValue: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", marginTop: 4 },

  benefitItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  benefitDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary.start, marginRight: 8 },
  benefitText: { fontSize: 14, color: "#333" },
  emptyText: { color: "#999", fontStyle: "italic" },

  companyCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8f9fa", borderRadius: 16, padding: 14 },
  companyLogo: { width: 50, height: 50, borderRadius: 12 },
  companyCardInfo: { flex: 1, marginLeft: 12 },
  companyCardName: { fontWeight: "700", fontSize: 15 },
  companyMeta: { fontSize: 12, color: "#666", marginLeft: 4 },

  keywordContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  keywordTag: { backgroundColor: "#eef1ff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  keywordText: { color: colors.primary.start, fontWeight: "600" },

  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderTopWidth: 1, borderTopColor: "#eee" },
  iconBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  applyBtn: { flex: 1, marginLeft: 14, borderRadius: 30, overflow: "hidden" },
  applyGradient: { paddingVertical: 14, alignItems: "center", borderRadius: 30 },
  applyText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

const htmlStyles: Record<string, MixedStyleDeclaration> = {
  p: { color: "#333", lineHeight: 22, fontSize: 14, marginBottom: 10 },
  strong: { fontWeight: "bold" },
  ul: { marginLeft: 16, marginBottom: 8 },
  li: { marginBottom: 6 },
};
