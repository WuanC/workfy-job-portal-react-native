import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import JobCard from "../../components/JobCard";

const MyCompany = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");

  // Ảnh banner & logo
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [logoUri, setLogoUri] = useState<string | null>(null);

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
    pickImage((uri) => setBannerUri(uri));
  };

  const onEditLogo = () => {
    pickImage((uri) => setLogoUri(uri));
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
                : require("../../../assets/App/banner.jpg")
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
                logoUri
                  ? { uri: logoUri }
                  : require("../../../assets/App/logoJob.png")
              }
              style={styles.logo}
            />
            <TouchableOpacity style={styles.editLogoButton} onPress={onEditLogo}>
              <Ionicons name="create-outline" size={16} color="#007bff" />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.companyName}>CÔNG TY CỔ PHẦN DEAIR</Text>
            <Text style={styles.companyLocation}>Hà Nội, Việt Nam</Text>
            <Text style={styles.companySize}>Quy mô: 51 - 150 nhân viên</Text>
          </View>

          <TouchableOpacity style={styles.editIcon}>
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
              <TouchableOpacity style={styles.editSmallButton}>
                <Ionicons name="create-outline" size={18} color="#007bff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.description}>
              DEAIR là công ty công nghệ phát triển các giải pháp phần mềm hiện đại
              cho doanh nghiệp Việt Nam và quốc tế. Với đội ngũ nhân sự trẻ trung,
              sáng tạo, chúng tôi tập trung vào việc tạo ra các sản phẩm chất lượng
              cao, mang lại giá trị thiết thực cho khách hàng.
            </Text>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Phương tiện & Liên hệ</Text>
              <TouchableOpacity style={styles.editSmallButton}>
                <Ionicons name="create-outline" size={18} color="#007bff" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={18} color="#007bff" />
              <Text style={styles.infoText}>www.deair.vn</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="logo-facebook" size={18} color="#007bff" />
              <Text style={styles.infoText}>facebook.com/deair.vn</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="logo-linkedin" size={18} color="#007bff" />
              <Text style={styles.infoText}>linkedin.com/company/deair</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="logo-youtube" size={18} color="#007bff" />
              <Text style={styles.infoText}>youtube.com/@deair</Text>
            </View>

            <View style={styles.sectionHeader}>
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
            </View>
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
