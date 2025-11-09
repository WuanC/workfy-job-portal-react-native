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

const CompanyDetailScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");
  const { id } = route.params as { id: number };
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>()
  const [openJobs, setOpenJobs] = useState<any[]>([]);

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



  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      const fetchOpenJobs = async () => {
        try {
          const data = await getEmployerJobOpenings(id);
          setOpenJobs(data.items);
        } catch (err) {
          const { ToastService } = require("../../services/toastService");
          ToastService.error("Lỗi", "Không thể tải danh sách công việc.");
        }
      };
      fetchOpenJobs();
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

          {/* Back button */}
          <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Company info */}
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
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.companyName}>{company.companyName}</Text>
            <Text style={styles.companyLocation}>{company.district.name}, {company.province.name}, Việt Nam</Text>
            <Text style={styles.companySize}>{getCompanySizeLabel(company.companySize)}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.activeTabText,
              ]}
            >
              About us
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "jobs" && styles.activeTab]}
            onPress={() => setActiveTab("jobs")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "jobs" && styles.activeTabText,
              ]}
            >
              Opening jobs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "about" ? (
          <View style={styles.contentContainer}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Giới thiệu công ty</Text>
              {company?.aboutCompany ? (
                <RenderHTML
                  contentWidth={width}
                  source={{ html: company.aboutCompany }}
                  tagsStyles={{
                    p: {
                      color: "#374151",
                      fontSize: 14,
                      lineHeight: 22,
                      textAlign: "justify",
                      marginBottom: 8,
                    },
                    b: { fontWeight: "bold" },
                    strong: { fontWeight: "bold" },
                    i: { fontStyle: "italic" },
                  }}
                />
              ) : (
                <Text style={styles.emptyText}>Chưa có mô tả về công ty.</Text>
              )}
            </View>
            <View style={styles.sectionCard}>
              {/* Card: Phương tiện & Liên hệ */}
              <Text style={styles.sectionTitle}>Phương tiện & Liên hệ</Text>

              <View style={styles.contactList}>
                {company?.websiteUrls?.length > 0 ? (
                  company.websiteUrls.map((url: string, index: number) => (
                    <View style={styles.contactRow} key={`website-${index}`}>
                      <Text style={styles.contactLabel}>🌐 Website</Text>
                      <Text style={styles.contactValue}>{url}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>Không có website</Text>
                )}

                {company?.facebookUrl && (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>📘 Facebook</Text>
                    <Text style={styles.contactValue}>{company.facebookUrl}</Text>
                  </View>
                )}
                {company?.linkedinUrl && (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>💼 LinkedIn</Text>
                    <Text style={styles.contactValue}>{company.linkedinUrl}</Text>
                  </View>
                )}
                {company?.youtubeUrl && (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>▶️ YouTube</Text>
                    <Text style={styles.contactValue}>{company.youtubeUrl}</Text>
                  </View>
                )}
                {company?.googleUrl && (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>🟢 Google</Text>
                    <Text style={styles.contactValue}>{company.googleUrl}</Text>
                  </View>
                )}
                {company?.twitterUrl && (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>🐦 Twitter</Text>
                    <Text style={styles.contactValue}>{company.twitterUrl}</Text>
                  </View>
                )}
              </View>
            </View>

          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Việc làm đang tuyển</Text>
            {openJobs.length > 0 ? (
              <FlatList
                data={openJobs}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // ❗ Không cho FlatList tự cuộn
                nestedScrollEnabled={false}
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
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={{ color: "#777", marginTop: 10 }}>
                Chưa có công việc nào.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },

  bannerContainer: {
    position: "relative",
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
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

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginRight: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  companyLocation: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  companySize: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 2,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: "#e6f0ff",
  },
  tabText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#1d4ed8",
    fontWeight: "700",
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  sectionCard: {
    // backgroundColor: "#fff",
    // borderRadius: 20,
    // padding: 16,
     marginBottom: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 6,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    textAlign: "justify",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 8,
    color: "#2563eb",
    fontSize: 13,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 1,
  },

  contactList: {
    marginTop: 8,
  },

  contactRow: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    flexDirection: "column",
  },

  contactLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },

  contactValue: {
    fontSize: 13,
    color: "#2563eb",
    lineHeight: 18,
    flexShrink: 1,
  },

});


export default CompanyDetailScreen;
