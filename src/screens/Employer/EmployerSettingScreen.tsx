import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { updateEmployerPassword } from "../../services/employerService"; // 👈 thêm import
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type EmployerSettingNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmployerLogin"
>;
const EmployerSettingScreen = () => {
  const navigation = useNavigation<EmployerSettingNavigationProp>();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "notification">("profile");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("bo11082007@gmail.com");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 loading state

  // 📸 Chọn ảnh đại diện
  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const { ToastService } = require("../../services/toastService");
      ToastService.warning("Quyền bị từ chối", "Vui lòng cấp quyền truy cập thư viện ảnh.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace("EmployerLogin"); // hoặc navigation.navigate("Login")
  };
  // 🔐 Đổi mật khẩu
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      const { ToastService } = require("../../services/toastService");
      ToastService.error("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      const { ToastService } = require("../../services/toastService");
      ToastService.error("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await updateEmployerPassword(currentPassword, newPassword);
      const { ToastService } = require("../../services/toastService");
      ToastService.success("✅ Thành công", res.message || "Cập nhật mật khẩu thành công.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const { ToastService } = require("../../services/toastService");
      ToastService.error("❌ Lỗi", err.message || "Cập nhật mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.header}>Cài đặt</Text>
        <Text style={styles.subHeader}>Quản lý cài đặt cá nhân và tổ chức của bạn.</Text>
      </LinearGradient>

      {/* Modern Segmented Control */}
      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab("profile")}
            style={[styles.tabButton, activeTab === "profile" && styles.activeTab]}
          >
            {activeTab === "profile" ? (
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeTabGradient}
              >
                <Text style={styles.activeText}>Đăng nhập và hồ sơ</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.tabText}>Đăng nhập và hồ sơ</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("notification")}
            style={[styles.tabButton, activeTab === "notification" && styles.activeTab]}
          >
            {activeTab === "notification" ? (
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeTabGradient}
              >
                <Text style={styles.activeText}>Thông báo</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.tabText}>Thông báo</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll}>
        {activeTab === "profile" ? (
          <>
            {/* Hồ sơ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hồ sơ</Text>
              <Text style={styles.sectionDesc}>
                Quản lý thông tin chi tiết về hồ sơ cá nhân của bạn.
              </Text>

              <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={{ fontSize: 30 }}>🏢</Text>
                  </View>
                )}
                <Text style={styles.avatarBtn}>Chỉnh sửa ảnh đại diện</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập họ và tên"
                value={fullName}
                onChangeText={setFullName}
              />

              <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryText}>Cập nhật hồ sơ</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Mật khẩu */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mật khẩu</Text>
              <Text style={styles.sectionDesc}>Thay đổi mật khẩu hiện tại của bạn.</Text>

              <TextInput
                style={styles.input}
                placeholder="Mật khẩu hiện tại"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? ["#999", "#999"] : ["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryText}>
                    {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Đăng xuất</Text>


              <TouchableOpacity
                onPress={handleLogout}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#f093fb", "#f5576c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryText}>Đăng xuất</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông báo</Text>
            <Text style={styles.sectionDesc}>Cấu hình thông báo của bạn ở đây.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default EmployerSettingScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    paddingTop: 50,
  },
  header: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#ffffff",
    marginBottom: 8,
  },
  subHeader: { 
    color: "rgba(255, 255, 255, 0.9)", 
    fontSize: 15,
  },
  tabContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  tabRow: { 
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  tabButton: { 
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  activeTabGradient: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabText: { 
    fontSize: 14, 
    color: "#999",
    fontWeight: "600",
    paddingVertical: 12,
    textAlign: "center",
  },
  activeTab: {},
  activeText: { 
    color: "#ffffff", 
    fontWeight: "700",
    fontSize: 14,
  },
  scroll: { flex: 1 },
  section: {
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginHorizontal: 20,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "800", 
    marginBottom: 6, 
    color: "#1a1a1a",
  },
  sectionDesc: { 
    color: "#999", 
    fontSize: 14, 
    marginBottom: 16,
  },
  avatarContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e8eaed",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarBtn: {
    color: "#1a73e8",
    marginLeft: 12,
    fontWeight: "500",
    borderWidth: 1,
    borderColor: "#1a73e8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  label: { color: "#202124", fontWeight: "500", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    color: "#1a1a1a",
  },
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: { 
    color: "#fff", 
    fontWeight: "800", 
    fontSize: 16,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  outlineText: { color: "#1a73e8", fontWeight: "600" },
  emailText: { fontSize: 15, marginBottom: 6 },
  email: { color: "#1a73e8", fontWeight: "600" },
  expandArea: {
    marginTop: 10,
    backgroundColor: "#ffffffff",
    padding: 12,
    borderRadius: 8,
  }, // 👈 thêm vùng expand email
});
