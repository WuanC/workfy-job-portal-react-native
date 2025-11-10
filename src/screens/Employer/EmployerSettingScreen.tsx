import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { updateEmployerPassword } from "../../services/employerService";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { validateField } from "../../utilities/validation";

type EmployerSettingNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmployerLogin"
>;

const EmployerSettingScreen = () => {
  const navigation = useNavigation<EmployerSettingNavigationProp>();
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigation.replace("EmployerLogin");
  };

  const handleChangePassword = async () => {
    const { ToastService } = require("../../services/toastService");
    if (!currentPassword || !newPassword || !confirmPassword) {
      ToastService.error("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      ToastService.error("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }
    const curPwdError = validateField(currentPassword, "password");
    if (curPwdError) {
      ToastService.error("Lỗi", curPwdError);
      return;
    }
    // Validate password complexity
    const pwdError = validateField(newPassword, "password");
    if (pwdError) {
      ToastService.error("Lỗi", pwdError);
      return;
    }

    setLoading(true);
    try {
      const res = await updateEmployerPassword(currentPassword, newPassword);
      ToastService.success("✅ Thành công", res.message || "Cập nhật mật khẩu thành công.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      ToastService.error("❌ Lỗi", err.message || "Cập nhật mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 50 }}
      >
        {/* Mật khẩu */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
          <Text style={styles.sectionDesc}>
            Nhập mật khẩu hiện tại và mật khẩu mới của bạn.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu hiện tại"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu mới"
            placeholderTextColor="#aaa"
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
              colors={
                loading
                  ? ["#aaa", "#aaa"]
                  : [colors.primary.start, colors.primary.end || "#667eea"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>
                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Đăng xuất */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Đăng xuất</Text>
          <Text style={styles.sectionDesc}>
            Thoát khỏi tài khoản nhà tuyển dụng của bạn.
          </Text>

          <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary.start, colors.primary.end || "#667eea"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.btn, { shadowColor: "#f5576c" }]}
            >
              <Text style={styles.btnText}>Đăng xuất</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EmployerSettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { padding: 6 },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },

  // CARD STYLE
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(102,126,234,0.08)",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary.start,
    marginBottom: 6,
  },
  sectionDesc: {
    color: "#777",
    fontSize: 13,
    marginBottom: spacing.md,
    lineHeight: 18,
  },

  // INPUT
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: spacing.md,
  },

  // BUTTON
  btn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: colors.primary.start,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
