import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ActivityIndicator
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { getJobById } from "../../services/jobService";
import { getCompanySizeLabel, getEducationLevelLabel, getExperienceLevelLabel, getJobGenderLabel, getJobLevelLabel, getJobTypeLabel } from "../../utilities/constant";

const bannerImg = require("../../../assets/App/banner.jpg")
const keywords = [
  "Tiếng Anh",
  "Marketing",
  "TP Thủ Dầu Một",
  "Nghiên cứu và phát triển (R&D)",
  "Nhân viên nghiên cứu thị trường",
];
type JobSubmitNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "JobSubmit" | "CompanyDetail"
>;

const JobDetailScreen = ({ route }: any) => {
  const { id } = route.params as { id: number };
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const navigation = useNavigation<JobSubmitNavigationProp>();
  const [job, setJob] = useState<any>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false; // flag để tránh setState sau unmount

    const load = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(id);
        setJob(jobData)
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
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={{ marginTop: 10, color: "#333" }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // ❌ Nếu không có dữ liệu
  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red" }}>Không tìm thấy thông tin công việc</Text>
        <TouchableOpacity onPress={() => {
          console.log("Back 1")
          navigation.goBack()
        }

        } style={{ marginTop: 10 }}>
          <Text style={{ color: "#0066ff" }}>← Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerHide, { opacity: headerOpacity }]}>
        <TouchableOpacity style={[styles.backBtnHide]} onPress={() => {
          console.log("Back 2")
          navigation.goBack()

        }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{job.jobTitle}</Text>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Banner */}
        <View style={{ position: "relative" }}>
          {/* <Image
            source={bannerImg}
            style={styles.banner}
          /> */}
          <Image
            source={
              job.author.backgroundUrl
                ? typeof job.author.backgroundUrl === "string"
                  ? { uri: job.author.backgroundUrl }
                  : job.author.backgroundUrl
                : require("../../../assets/App/companyBannerDefault.jpg")

            }
            style={styles.banner}
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              navigation.goBack()

            }}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Header: Logo + Công ty + Chức danh */}
        <View style={styles.infoContainerHeader}>
          <View style={styles.header}>
            {/* <Image
              source={logoImg}
              style={styles.logo}
            /> */}
            <Image
              source={
                job.author.avatarUrl
                  ? typeof job.author.avatarUrl === "string"
                    ? { uri: job.author.avatarUrl }
                    : job.author.avatarUrl
                  : require("../../../assets/App/companyLogoDefault.png")

              }
              style={styles.logo}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.company}>{job.companyName}</Text>
              <Text style={styles.title}>{job.jobTitle}</Text>
            </View>

          </View>

          {/* Box thông tin */}

          <View style={styles.infoBox}>
            <Text style={styles.info}>📍 {job.jobLocations[0].district.name}, {job.jobLocations[0].province.name}</Text>
            <Text
              style={[
                styles.info,
                job.salaryType === "NEGOTIABLE"
                  ? { color: "orange" }
                  : job.salaryType === "COMPETITIVE"
                    ? { color: "green" }
                    : { color: "#000" }, // mặc định
              ]}
            >
              {job.salaryType === "RANGE"
                ? `💰 ${job.minSalary?.toLocaleString() || "?"} ${job.salaryUnit || ""} - ${job.maxSalary?.toLocaleString() || "?"} ${job.salaryUnit || ""}`
                : job.salaryType === "GREATER_THAN"
                  ? `💰 Trên ${job.minSalary?.toLocaleString() || "?"} ${job.salaryUnit || ""}`
                  : job.salaryType === "NEGOTIABLE"
                    ? "💰 Thỏa thuận"
                    : job.salaryType === "COMPETITIVE"
                      ? "💰 Cạnh tranh"
                      : "💰 Không rõ"}
            </Text>
            <Text style={styles.info}>🧰 {getExperienceLevelLabel(job.experienceLevel)}</Text>
            <Text style={styles.info}>
              📅 {job.expirationDate}
            </Text>
          </View>
        </View>

        {/* Mô tả công việc */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Mô tả công việc</Text>
          <View style={styles.section}>
            <Text>{job.jobDescription}</Text>
          </View>
        </View>

        {/* Phúc lợi */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Yêu cầu công việc</Text>
          <View style={styles.section}>
            <Text>{job.requirement}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Chi tiết công việc</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Loại công việc</Text>
              <Text style={styles.detailValue}> {getJobTypeLabel(job.jobType)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Giới tính</Text>
              <Text style={styles.detailValue}>{getJobGenderLabel(job.gender)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cấp bậc</Text>
              <Text style={styles.detailValue}>{getJobLevelLabel(job.jobLevel)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Trình độ học vấn</Text>
              <Text style={styles.detailValue}> {getEducationLevelLabel(job.educationLevel)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Ngành nghề</Text>
              <Text style={styles.detailValue}>
                {job.industries && job.industries.length > 0
                  ? job.industries.map((ind: any) => ind.name).join(", ")
                  : "Không rõ"}
              </Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <View style={styles.section}>
              <Text>{job.description}</Text>
            </View>
          </View>


        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Về công ty</Text>
          <View style={styles.section}>
            <Text>{job.aboutCompany}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {/* Về công ty */}
          <Text style={styles.sectionTitle}>Về công ty</Text>
          <TouchableOpacity style={styles.companyBox} onPress={() => {
            console.log(job.author.id)
            navigation.navigate("CompanyDetail", {id: job.author.id})}}>
            <Image
              source={
                job.author.avatarUrl
                  ? typeof job.author.avatarUrl === "string"
                    ? { uri: job.author.avatarUrl }
                    : job.author.avatarUrl
                  : require("../../../assets/App/companyLogoDefault.png")

              }
              style={styles.logo}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.companyName}>{job.companyName}</Text>
              <View style={styles.row}>
                <Ionicons name="briefcase-outline" size={16} color="#555" />
                <Text style={styles.companyInfo}> 15 việc đang tuyển</Text>
                <Ionicons
                  name="people-outline"
                  size={16}
                  color="#555"
                  style={{ marginLeft: 10 }}
                />
                <Text style={styles.companyInfo}> {getCompanySizeLabel(job.companySize)}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Nơi làm việc */}
          <Text style={styles.sectionTitle}>Nơi làm việc:</Text>
          <View style={styles.mapBox}>
            {/* Fake map bằng 1 hình demo, thực tế có thể dùng react-native-maps */}
            <Image
              source={{ uri: "https://via.placeholder.com/400x200.png?text=Map" }}
              style={{ width: "100%", height: 150, borderRadius: 8 }}
            />
          </View>

          {/* VP Chính */}
          <View style={styles.addressBox}>
            <MaterialCommunityIcons name="office-building" size={20} color="#004aad" />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.addressTitle}>VP Chính</Text>
              <Text style={styles.addressDetail}>
                Tầng 15, Tòa nhà WTC Tower, Số 1 đường Hùng Vương, phường Hòa Phú,
                TP Thủ Dầu Một, Bình Dương
              </Text>
            </View>
          </View>

          {/* Tòa nhà WESTGATE */}
          <View style={styles.addressBox}>
            <MaterialCommunityIcons name="office-building" size={20} color="#004aad" />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.addressTitle}>Tòa nhà WESTGATE</Text>
              <Text style={styles.addressDetail}>
                TT. Tân Túc, Bình Chánh, HCM, Huyện Bình Chánh, Hồ Chí Minh
              </Text>
            </View>
          </View>
        </View>


        <View style={styles.infoContainer}>
          {/* Về công ty */}
          <Text style={styles.sectionTitle}>Từ khóa</Text>
          <View style={styles.keywordContainer}>
            {keywords.map((item, index) => (
              <TouchableOpacity key={index} style={styles.keywordTag}>
                <Text style={styles.keywordText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Thanh nút dưới cùng */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={30} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={30} color="red" />
          <Text style={{ fontSize: 12, color: "#333", marginTop: 2 }}>Lưu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton} onPress={() => navigation.navigate("JobSubmit")}>
          <Text style={styles.applyText}>Nộp đơn ngay</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
export default JobDetailScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e1eff5ff" },
  banner: {
    width: "100%",
    height: 200, // tuỳ chỉnh chiều cao banner
    resizeMode: "cover",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  backBtn: {
    position: "absolute",   // đẩy xuống 1 chút cho thoát khỏi status bar
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)", // nền mờ để dễ nhìn
    padding: 8,
    borderRadius: 24,
    borderWidth: 2,
    marginTop: 22,
      zIndex: 100,         // 👈 thêm dòng này
    elevation: 10,
  },
  backBtnHide: {
    position: "absolute",   // đẩy xuống 1 chút cho thoát khỏi status bar
    left: 16, // nền mờ để dễ nhìn
    padding: 8,
    borderRadius: 24,
    marginTop: 10,
    zIndex: 100,         // 👈 thêm dòng này

  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  logo: { width: 50, height: 50, marginRight: 10 },
  company: { fontSize: 14, color: "#666" },
  title: { fontSize: 18, fontWeight: "bold", color: "#000" },
  infoBox: {
    backgroundColor: "#c3d8f5ff",
    margin: 15,
    padding: 12,
    borderRadius: 10,
  },
  info: { fontSize: 14, marginBottom: 4 },
  infoContainerHeader: {
    backgroundColor: "#f1f7ff",

  },
  infoContainer: {
    backgroundColor: "#f1f7ff",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 15,
    marginBottom: 5,
    color: "#004aad",
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",        // Cho phép xuống dòng
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  detailItem: {
    backgroundColor: "#e6f0ff",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    width: "47%",            // 2 cột (gần bằng 50%)
  },

  detailLabel: {
    fontSize: 12,
    color: "#004aad",
    fontWeight: "bold",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    color: "#333",
  },
  companyBox: { flexDirection: "row", alignItems: "center", marginBottom: 15, paddingLeft: 15 },
  companyLogo: { width: 50, height: 50, marginRight: 10 },
  companyName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center" },
  companyInfo: { fontSize: 13, color: "#555" },

  mapBox: { marginBottom: 15 },

  addressBox: {
    flexDirection: "row",
    backgroundColor: "#f1f7ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#004aad",
  },
  addressTitle: { fontWeight: "bold", color: "#004aad", fontSize: 14 },
  addressDetail: { fontSize: 13, color: "#333", marginTop: 2 },
  keywordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 15,
  },
  keywordTag: {
    backgroundColor: "#c9c4c4ff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 13,
    color: "#333",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconButton: {
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#d4cdcdff",
    flexDirection: "row",
    padding: 6,
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#0066ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  headerHide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    paddingLeft: 60,
    paddingRight: 40
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
});
