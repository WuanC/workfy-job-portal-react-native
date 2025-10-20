import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import JobCard from "../../components/JobCard";

const CompanyDetailScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");

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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../../assets/App/banner.jpg")}
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
            source={require("../../../assets/App/logoJob.png")}
            style={styles.logo}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.companyName}>CÔNG TY CỔ PHẦN DEAIR</Text>
            <Text style={styles.companyLocation}>Hà Nội, Việt Nam</Text>
            <Text style={styles.companySize}>Quy mô: 51 - 150 nhân viên</Text>
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
            <Text style={styles.sectionTitle}>Giới thiệu công ty</Text>
            <Text style={styles.description}>
              DEAIR là công ty công nghệ phát triển các giải pháp phần mềm hiện đại
              cho doanh nghiệp Việt Nam và quốc tế. Với đội ngũ nhân sự trẻ trung,
              sáng tạo, chúng tôi tập trung vào việc tạo ra các sản phẩm chất lượng
              cao, mang lại giá trị thiết thực cho khách hàng.
            </Text>

            <Text style={styles.sectionTitle}>Phương tiện & Liên hệ</Text>
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

            <Text style={styles.sectionTitle}>Hình ảnh</Text>
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
            <Text style={styles.sectionTitle}>Việc làm đang tuyển</Text>
            {jobs.map((item) => (
              <JobCard
                id = {1}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    position: "relative",
  },
  banner: {
    width: "100%",
    height: 180,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
    alignSelf: "flex-start",
    zIndex: 10,
    elevation: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 25,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  companyLocation: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  companySize: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
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
  activeTab: {
    backgroundColor: "#007bff20",
  },
  tabText: {
    color: "#333",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007bff",
    fontWeight: "700",
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
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
  infoText: {
    marginLeft: 8,
    color: "#007bff",
  },
  photoRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  photo: {
    width: 100,
    height: 70,
    borderRadius: 8,
  },
});

export default CompanyDetailScreen;
