import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import JobCard from "../../components/JobCard";
import { getEmployerProfile, updateEmployerAvatar, updateEmployerBG } from "../../services/employerService";
import { getCompanySizeLabel } from "../../utilities/constant";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
type MyCompanyNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UpdateCompanyInfo" | "UpdateCompanyMedia"
>;
const MyCompany = () => {
  const navigation = useNavigation<MyCompanyNavigationProp>();
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");

  // Ảnh banner & logo
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);
  useFocusEffect(
    useCallback(() => {
      const fetchCompany = async () => {
        try {
          const data = await getEmployerProfile();
          setCompany(data);
        } catch (err) {
          Alert.alert("Lỗi", "Không thể tải thông tin công ty.");
        }
      };

      fetchCompany();
    }, [])
  );
  const jobs = [
    {
      id: "1",
      logo_path: require("../../../assets/App/logoJob.png"),
      job_title: "UI/UX Designer",
      company_name: "Công ty Cổ phần Deair",
      job_location: "Hà Nội",
      salary_range: "15-25 triệu",
      time_passed: "2 giờ trước",
    },
    {
      id: "2",
      logo_path: require("../../../assets/App/logoJob.png"),
      job_title: "Frontend Developer",
      company_name: "Công ty Cổ phần Deair",
      job_location: "TP. Hồ Chí Minh",
      salary_range: "20-30 triệu",
      time_passed: "5 giờ trước",
    },
  ];

  // 📸 Mở thư viện ảnh
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

  const onEditBanner = () => {
    pickImage(async (uri) => {
      try {
        console.log("Selected logo URI:", uri);
        setBannerUri(uri); // hiển thị tạm
        const updatedData = await updateEmployerBG(uri);
        setCompany((prev: any) => ({
          ...prev,
          backgroundUrl: updatedData.backgroundUrl,
        }));
        Alert.alert("Thành công", "Cập nhật bg thành công!");
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Cập nhật bg thất bại.");
      }
    });
  };

  const onEditLogo = () => {
    pickImage(async (uri) => {
      try {
        console.log("Selected logo URI:", uri);
        setLogoUri(uri); // hiển thị tạm
        const updatedData = await updateEmployerAvatar(uri);
        setCompany((prev: any) => ({
          ...prev,
          avatarUrl: updatedData.avatarUrl,
        }));
        Alert.alert("Thành công", "Cập nhật avatar thành công!");
      } catch (error) {
        console.error(error);
        //Alert.alert("Lỗi", error?.messag || "Cập nhật avatar thất bại.");
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
              company?.backgroundUrl
                ? { uri: company.backgroundUrl }
                : require("../../../assets/App/companyBannerDefault.jpg")
            }
            style={styles.banner}
          />
          <TouchableOpacity style={styles.editBannerButton} onPress={onEditBanner}>
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Company info */}
        <View style={styles.headerContainer}>
          <View style={{ position: "relative" }}>
            <Image
              source={
                company?.avatarUrl
                  ? { uri: company.avatarUrl }
                  : require("../../../assets/App/companyLogoDefault.png")
              }
              style={styles.logo}
            />
            <TouchableOpacity style={styles.editLogoButton} onPress={onEditLogo}>
              <Ionicons name="create-outline" size={16} color="#007bff" />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.companyName}>{company?.companyName}</Text>
            <Text style={styles.companyLocation}>{company?.district.name}, {company?.province.name}, Việt Nam</Text>
            <Text style={styles.companySize}> {getCompanySizeLabel(company?.companySize)} </Text>
          </View>

          <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate("UpdateCompanyInfo", { id: company?.id })}>
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

        {/* Content */}
        {activeTab === "about" ? (
          <View style={styles.contentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Giới thiệu công ty</Text>

            </View>

            <Text style={styles.description}>
              {company?.aboutCompany || "Chưa có mô tả về công ty."}
            </Text>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Phương tiện & Liên hệ</Text>
              <TouchableOpacity style={styles.editSmallButton} onPress={() => navigation.navigate("UpdateCompanyMedia")}>
                <Ionicons name="create-outline" size={18} color="#007bff" />
              </TouchableOpacity>
            </View>
            {/* ✅ Hiển thị danh sách website động */}
            {company?.websiteUrls && company.websiteUrls.length > 0 ? (
              company.websiteUrls.map((url: string, index: number) => (
                <View style={styles.infoRow} key={index}>
                  <Ionicons name="globe-outline" size={18} color="#007bff" />
                  <Text style={styles.infoText}>{url}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#555", marginVertical: 4 }}>Không có website</Text>
            )}

            {/* 🌍 Facebook */}
            {company?.facebookUrl && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-facebook" size={18} color="#007bff" />
                <Text style={styles.infoText}>{company.facebookUrl}</Text>
              </View>
            )}

            {/* 💼 LinkedIn */}
            {company?.linkedinUrl && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-linkedin" size={18} color="#007bff" />
                <Text style={styles.infoText}>{company.linkedinUrl}</Text>
              </View>
            )}

            {/* 📺 YouTube */}
            {company?.youtubeUrl && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-youtube" size={18} color="#007bff" />
                <Text style={styles.infoText}>{company.youtubeUrl}</Text>
              </View>
            )}

            {/* 🟢 Google */}
            {company?.googleUrl && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-google" size={18} color="#007bff" />
                <Text style={styles.infoText}>{company.googleUrl}</Text>
              </View>
            )}

            {/* 🐦 Twitter */}
            {company?.twitterUrl && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-twitter" size={18} color="#007bff" />
                <Text style={styles.infoText}>{company.twitterUrl}</Text>
              </View>
            )}

            {/* <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hình ảnh</Text>
              <TouchableOpacity style={styles.editSmallButton}>
                <Ionicons name="create-outline" size={18} color="#007bff" />
              </TouchableOpacity>
            </View>

            <View style={styles.photoRow}>
              <Image
                source={require("../../../assets/App/logo.png")}
                style={styles.photo}
              />
              <Image
                source={require("../../../assets/App/logo.png")}
                style={styles.photo}
              />
              <Image
                source={require("../../../assets/App/logo.png")}
                style={styles.photo}
              />
            </View> */}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Việc làm đang tuyển</Text>
              <TouchableOpacity style={styles.editSmallButton}>
                <Ionicons name="create-outline" size={18} color="#007bff" />
              </TouchableOpacity>
            </View>

            {jobs.map((item) => (
              <JobCard
                key={item.id}
                id={1}
                logo_path={item.logo_path}
                job_title={item.job_title}
                company_name={item.company_name}
                job_location={item.job_location}
                salary_range={item.salary_range}
                time_passed={item.time_passed}
              />
            ))}
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
  photoRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  photo: { width: 100, height: 70, borderRadius: 8 },
});

export default MyCompany;
