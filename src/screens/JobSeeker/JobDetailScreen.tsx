import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
const logoImg = require("../../../assets/App/logoJob.png")
const bannerImg = require("../../../assets/App/banner.jpg")
const keywords = [
  "Tiếng Anh",
  "Marketing",
  "TP Thủ Dầu Một",
  "Nghiên cứu và phát triển (R&D)",
  "Nhân viên nghiên cứu thị trường",
];
export default function JobDetailScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],  // kéo xuống 100px thì header hiện rõ
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerHide, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>Market Research Executive</Text>
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
        <Image
          source={bannerImg}
          style={styles.banner}
        />

        {/* Header: Logo + Công ty + Chức danh */}
        <View style={styles.infoContainerHeader}>
          <View style={styles.header}>
            <Image
              source={logoImg}
              style={styles.logo}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.company}>Công Ty TNHH Becamex Tokyu</Text>
              <Text style={styles.title}>Market Research Executive</Text>
            </View>

          </View>

          {/* Box thông tin */}

          <View style={styles.infoBox}>
            <Text style={styles.info}>📍 Thành phố Thủ Dầu Một, Bình Dương</Text>
            <Text style={[styles.info, { color: "orange" }]}>💰 Thương lượng</Text>
            <Text style={styles.info}>🧰 2 - 5 năm kinh nghiệm</Text>
            <Text style={styles.info}>
              📅 14 tháng 9, 2025 | hết hạn sau 15 ngày tới
            </Text>
          </View>
        </View>

        {/* Mô tả công việc */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Mô tả công việc</Text>
          <View style={styles.section}>
            <Text>- Conduct market and competitor research & analysis.</Text>
            <Text>- Plan Marketing strategies and campaigns.</Text>
            <Text>- Perform other tasks as assigned by Manager.</Text>
            <Text>- Working hours: 8:00 - 17:00 (Mon-Fri).</Text>
          </View>
        </View>

        {/* Phúc lợi */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Phúc lợi</Text>
          <View style={styles.section}>
            <Text>✔ Travel and annual general health check-up</Text>
            <Text>✔ 13th-month salary, Union bonus</Text>
            <Text>✔ Free bus card, shuttle bus from HCMC</Text>
            <Text>✔ Support lunch & phone expenses</Text>
            <Text>✔ Full insurance, annual leave, overtime</Text>
            <Text>✔ Company laptop</Text>
            <Text>✔ Premium health care package</Text>
            <Text>✔ Support tuition for courses</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Chi tiết công việc</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Loại công việc</Text>
              <Text style={styles.detailValue}>Nhân viên toàn thời gian</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Giới tính</Text>
              <Text style={styles.detailValue}>Nam / Nữ</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cấp bậc</Text>
              <Text style={styles.detailValue}>Nhân viên, Kỹ thuật viên / Kỹ sư</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Trình độ học vấn</Text>
              <Text style={styles.detailValue}>Cử nhân</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Ngành nghề</Text>
              <Text style={styles.detailValue}>Quảng cáo, Khuyến mãi, Đối ngoại, BĐS, Tiếp thị</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <View style={styles.section}>
              <Text>✔ Travel and annual general health check-up</Text>
              <Text>✔ 13th-month salary, Union bonus</Text>
              <Text>✔ Free bus card, shuttle bus from HCMC</Text>
              <Text>✔ Support lunch & phone expenses</Text>
              <Text>✔ Full insurance, annual leave, overtime</Text>
              <Text>✔ Company laptop</Text>
              <Text>✔ Premium health care package</Text>
              <Text>✔ Support tuition for courses</Text>
            </View>
          </View>


        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>về công ty</Text>
          <View style={styles.section}>
            <Text>✔ Travel and annual general health check-up</Text>
            <Text>✔ 13th-month salary, Union bonus</Text>
            <Text>✔ Free bus card, shuttle bus from HCMC</Text>
            <Text>✔ Support lunch & phone expenses</Text>
            <Text>✔ Full insurance, annual leave, overtime</Text>
            <Text>✔ Company laptop</Text>
            <Text>✔ Premium health care package</Text>
            <Text>✔ Support tuition for courses</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {/* Về công ty */}
          <Text style={styles.sectionTitle}>Về công ty</Text>
          <View style={styles.companyBox}>
            <Image
              source={require("../../../assets/App/logoJob.png")}
              style={styles.companyLogo}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.companyName}>Công Ty TNHH Becamex Tokyu</Text>
              <View style={styles.row}>
                <Ionicons name="briefcase-outline" size={16} color="#555" />
                <Text style={styles.companyInfo}> 15 việc đang tuyển</Text>
                <Ionicons
                  name="people-outline"
                  size={16}
                  color="#555"
                  style={{ marginLeft: 10 }}
                />
                <Text style={styles.companyInfo}> 100 - 499</Text>
              </View>
            </View>
          </View>

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

        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyText}>Nộp đơn ngay</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e1eff5ff" },
  banner: { width: "100%", height: 120, resizeMode: "cover" },
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
  companyBox: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
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
  },
});
