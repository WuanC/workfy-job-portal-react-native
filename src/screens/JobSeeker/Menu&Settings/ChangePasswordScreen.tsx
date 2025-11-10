// ChangePasswordScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { validateField } from "../../../utilities/validation";
import { updateUserPassword } from "../../../services/employeeService";
import { useAuth } from "../../../context/AuthContext";
import { RootStackParamList } from "../../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../../theme";
type MenuNavigationProp = NativeStackNavigationProp<RootStackParamList, "ChangePassword">;
const ChangePasswordScreen = () => {
  const navigation = useNavigation<MenuNavigationProp>();
  const { logout } = useAuth()
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    await logout()
    navigation.replace("Login")
  }
  const handleChangePassword = async () => {
    const { ToastService } = require("../../../services/toastService");
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      ToastService.warning("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường");
      return;
    }
    const curPasswordError = validateField(oldPassword, "password");
    if (curPasswordError) {
      ToastService.error("Mật khẩu không hợp lệ", curPasswordError);
      return;
    }
    const passwordError = validateField(newPassword, "password");
    if (passwordError) {
      ToastService.error("Mật khẩu không hợp lệ", passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      ToastService.error("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserPassword(
        oldPassword,
        newPassword,
      );

      if (res.status === 200) {
        const { ToastService } = require("../../../services/toastService");
        ToastService.success("Thành công", "Cập nhật mật khẩu thành công");
        // emulate user clicking OK — wait a moment then logout
        setTimeout(() => handleLogout(), 1200);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "Đã xảy ra lỗi";

      const { ToastService } = require("../../../services/toastService");
      if (status === 400) {
        ToastService.error("Lỗi", "Dữ liệu không hợp lệ hoặc mật khẩu mới sai định dạng");
      } else if (status === 401) {
        ToastService.error("Lỗi", "Token không hợp lệ, vui lòng đăng nhập lại");
      } else if (status === 411) {
        ToastService.error("Lỗi", "Mật khẩu hiện tại không khớp");
      } else {
        ToastService.error("Lỗi", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.side}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={styles.side} />
      </View>

      <View style={styles.content}>
        {/* Mật khẩu cũ */}
        <Text style={styles.label}>Mật khẩu hiện tại</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showOld}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Nhập mật khẩu"
          />
          <TouchableOpacity
            onPress={() => setShowOld(!showOld)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showOld ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Mật khẩu mới */}
        <Text style={styles.label}>Mật khẩu mới</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nhập mật khẩu mới"
          />
          <TouchableOpacity
            onPress={() => setShowNew(!showNew)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showNew ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Xác nhận mật khẩu */}
        <Text style={styles.label}>Xác nhận mật khẩu</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập lại mật khẩu mới"
          />
          <TouchableOpacity
            onPress={() => setShowConfirm(!showConfirm)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showConfirm ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Nút đổi mật khẩu */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Đổi mật khẩu</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  side: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary.dark,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: "#333",
  },
  eyeBtn: {
    padding: 8,
  },
  forgotText: {
    color: colors.primary.light,
    fontSize: 14,
    marginBottom: 24,
    textAlign: "right",
  },
  submitBtn: {
    backgroundColor: colors.primary.start,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
