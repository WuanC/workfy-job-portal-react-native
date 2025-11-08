// ChangePasswordScreen.tsx
import React, { use, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";// 👈 đổi lại nếu service ở nơi khác
import { updateUserPassword } from "../../../services/employeeService";
import { useAuth } from "../../../context/AuthContext";
import { RootStackParamList } from "../../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserPassword(
        oldPassword,
        newPassword,
      );

      if (res.status === 200) {
        Alert.alert("Thành công", "Cập nhật mật khẩu thành công", [
          { text: "OK", onPress: () => handleLogout() },
        ]);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "Đã xảy ra lỗi";

      if (status === 400) {
        Alert.alert("Lỗi", "Dữ liệu không hợp lệ hoặc mật khẩu mới sai định dạng");
      } else if (status === 401) {
        Alert.alert("Lỗi", "Token không hợp lệ, vui lòng đăng nhập lại");
      } else if (status === 411) {
        Alert.alert("Lỗi", "Mật khẩu hiện tại không khớp");
      } else {
        Alert.alert("Lỗi", message);
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
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={styles.side} />
      </View>

      <View style={styles.content}>
        {/* Mật khẩu cũ */}
        <Text style={styles.label}>Mật khẩu</Text>
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

// ====================== STYLES ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  side: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#111",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
  },
  eyeBtn: {
    padding: 4,
  },
  forgotText: {
    color: "#007AFF",
    fontSize: 14,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
