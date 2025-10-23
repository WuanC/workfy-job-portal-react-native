import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  useWindowDimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import JobCard from "../../components/JobCard";
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

type MyCompanyNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UpdateCompanyInfo" | "UpdateCompanyMedia"
>;

const MyCompany = () => {
  const navigation = useNavigation<MyCompanyNavigationProp>();
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");

  const [companyId, setCompanyId] = useState<number | null>(null);
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);

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
          Alert.alert("Lỗi", "Không thể tải thông tin công ty.");
        }
      };
      fetchCompany();
    }, [])
  );

  // Lấy danh sách job khi có company.id
  useFocusEffect(
    useCallback(() => {
      console.log("Fetching open jobs for companyId:", companyId);
      if (!companyId) return;
      const fetchOpenJobs = async () => {
        try {
          const data = await getEmployerJobOpenings(companyId);
          setOpenJobs(data.items);
        } catch (err) {
          Alert.alert("Lỗi", "Không thể tải danh sách công việc.");
        }
      };
      fetchOpenJobs();
    }, [companyId])
  );

  // 📸 Hàm chọn ảnh chung
  const pickImage = async (onPicked: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền truy cập bị từ chối", "Vui lòng cấp quyền truy cập ảnh.");
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

  // 🖼️ Cập nhật banner
  const onEditBanner = () => {
    pickImage(async (uri) => {
      try {
        setBannerUri(uri);
        const updatedData = await updateEmployerBG(uri);
        setCompany((prev: any) => ({
          ...prev,
          backgroundUrl: updatedData.backgroundUrl,
        }));
        Alert.alert("Thành công", "Cập nhật background thành công!");
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Cập nhật background thất bại.");
      }
    });
  };

  // 🖼️ Cập nhật logo
  const onEditLogo = () => {
    pickImage(async (uri) => {
      try {
        setLogoUri(uri);
        const updatedData = await updateEmployerAvatar(uri);
        setCompany((prev: any) => ({
          ...prev,
          avatarUrl: updatedData.avatarUrl,
        }));
        Alert.alert("Thành công", "Cập nhật avatar thành công!");
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Cập nhật avatar thất bại.");
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Company Info */}
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
              <Ionicons name="create-outline" size={16} color="#007bff" />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
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
            <Ionicons name="create-outline" size={20} color="#007bff" />
          </TouchableOpacity>
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

        {/* Nội dung */}
        {activeTab === "about" ? (
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
            {/* Các link */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Phương tiện & Liên hệ</Text>
              <TouchableOpacity
                style={styles.editSmallButton}
                onPress={() => navigation.navigate("UpdateCompanyMedia")}
              >
                <Ionicons name="create-outline" size={18} color="#007bff" />
              </TouchableOpacity>
            </View>
            {company?.websiteUrls?.length ? (
              company.websiteUrls.map((url: string, i: number) => (
                <View style={styles.infoRow} key={i}>
                  <Ionicons name="globe-outline" size={18} color="#007bff" />
                  <Text style={styles.infoText}>{url}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#555", marginVertical: 4 }}>
                Không có website
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Việc làm đang tuyển</Text>
            </View>
            {openJobs.length > 0 ? (
              <FlatList
                data={openJobs}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // ❗ Không cho FlatList tự cuộn
                nestedScrollEnabled={false}
                renderItem={({ item }) => (
                  <JobCard
                    id={item.id}
                    logo_path={item.avatarUrl}
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
  container: { flex: 1, backgroundColor: "#fff" },
  bannerContainer: { position: "relative" },
  banner: { width: "100%", height: 180, resizeMode: "cover" },
  editBannerButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    padding: 6,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 15,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  editLogoButton: {
    position: "absolute",
    bottom: 0,
    right: -5,
    borderRadius: 12,
    padding: 4,
  },
  companyName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  companyLocation: { fontSize: 14, color: "#555", marginTop: 2 },
  companySize: { fontSize: 13, color: "#777", marginTop: 2 },
  editIcon: { padding: 5 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeTab: { backgroundColor: "#007bff20" },
  tabText: { color: "#333", fontWeight: "500" },
  activeTabText: { color: "#007bff", fontWeight: "700" },
  contentContainer: { paddingHorizontal: 15, paddingBottom: 30 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  editSmallButton: { padding: 5 },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    textAlign: "justify",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  infoText: { marginLeft: 8, color: "#007bff" },
});

export default MyCompany;
