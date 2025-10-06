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

const EmployerSettingScreen = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "notification">("profile");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("bo11082007@gmail.com");
  const [showEmailForm, setShowEmailForm] = useState(false); // 👈 Thêm state này
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Chọn ảnh đại diện
  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền truy cập thư viện ảnh.");
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

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <Text style={styles.header}>Cài đặt</Text>
      <Text style={styles.subHeader}>
        Quản lý cài đặt cá nhân và tổ chức của bạn.
      </Text>

      {/* ---------- TAB ---------- */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setActiveTab("profile")}
          style={[styles.tabButton, activeTab === "profile" && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === "profile" && styles.activeText]}>
            Đăng nhập và hồ sơ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("notification")}
          style={[styles.tabButton, activeTab === "notification" && styles.activeTab]}
        >
          <Text
            style={[styles.tabText, activeTab === "notification" && styles.activeText]}
          >
            Thông báo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {activeTab === "profile" ? (
          <>
            {/* ---------- HỒ SƠ ---------- */}
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

              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryText}>Cập nhật hồ sơ</Text>
              </TouchableOpacity>
            </View>

            {/* ---------- EMAIL ---------- */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Email</Text>
              <Text style={styles.sectionDesc}>
                Quản lý và thay đổi địa chỉ email cá nhân của bạn.
              </Text>
              <Text style={styles.emailText}>
                Email hiện tại: <Text style={styles.email}>{email}</Text>
              </Text>

              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => setShowEmailForm(!showEmailForm)} // 👈 Toggle form
              >
                <Text style={styles.outlineText}>Cập nhật email</Text>
              </TouchableOpacity>

              {/* 👇 Thêm form xổ ra */}
              {showEmailForm && (
                <View style={styles.expandArea}>
                  <TextInput
                    placeholder="Nhập mật khẩu hiện tại"
                    secureTextEntry
                    style={styles.input}
                  />
                  <TextInput placeholder="Nhập email mới" style={styles.input} />
                  <TextInput placeholder="Nhập xác nhận email mới" style={styles.input} />
                  <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryText}>Cập nhật email</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* ---------- MẬT KHẨU ---------- */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mật khẩu</Text>
              <Text style={styles.sectionDesc}>
                Thay đổi mật khẩu hiện tại của bạn.
              </Text>

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

              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryText}>Cập nhật mật khẩu</Text>
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
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { fontSize: 22, fontWeight: "700", color: "#202124", marginTop: 16, marginHorizontal: 16 },
  subHeader: { color: "#5f6368", marginHorizontal: 16, marginBottom: 16 },
  tabRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  tabButton: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabText: { fontSize: 15, color: "#5f6368" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#1a73e8" },
  activeText: { color: "#1a73e8", fontWeight: "600" },
  scroll: { flex: 1 },
  section: {
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginHorizontal: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4, color: "#202124" },
  sectionDesc: { color: "#5f6368", fontSize: 14, marginBottom: 12 },
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
    borderColor: "#dadce0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  primaryText: { color: "#fff", fontWeight: "600", fontSize: 15 },
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
