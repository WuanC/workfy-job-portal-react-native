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
import { useI18n } from "../../../hooks/useI18n";
import { colors } from "../../../theme";
type MenuNavigationProp = NativeStackNavigationProp<RootStackParamList, "ChangePassword">;
const ChangePasswordScreen = () => {
  const navigation = useNavigation<MenuNavigationProp>();
  const { logout } = useAuth()
  const { t } = useI18n()
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
      ToastService.warning(t('common.error'), t('menu.fillAllFields'));
      return;
    }
    const curPasswordError = validateField(oldPassword, "password");
    if (curPasswordError) {
      ToastService.error(t('menu.invalidPassword'), curPasswordError);
      return;
    }
    const passwordError = validateField(newPassword, "password");
    if (passwordError) {
      ToastService.error(t('menu.invalidPassword'), passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      ToastService.error(t('common.error'), t('menu.passwordMismatch'));
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
        ToastService.success(t('common.success'), t('menu.passwordUpdateSuccess'));
        // emulate user clicking OK — wait a moment then logout
        setTimeout(() => handleLogout(), 1200);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "Đã xảy ra lỗi";

      const { ToastService } = require("../../../services/toastService");
      if (status === 400) {
        ToastService.error(t('common.error'), t('menu.invalidData'));
      } else if (status === 401) {
        ToastService.error(t('common.error'), t('menu.invalidToken'));
      } else if (status === 411) {
        ToastService.error(t('common.error'), t('menu.incorrectPassword'));
      } else {
        ToastService.error(t('common.error'), message);
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

        <Text style={styles.headerTitle}>{t('menu.changePassword')}</Text>
        <View style={styles.side} />
      </View>

      <View style={styles.content}>
        {/* Mật khẩu cũ */}
        <Text style={styles.label}>{t('menu.currentPassword')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showOld}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder={t('menu.enterPassword')}
            placeholderTextColor="#6B7280"
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
          <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        {/* Mật khẩu mới */}
        <Text style={styles.label}>{t('menu.newPassword')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t('menu.newPassword')}
            placeholderTextColor="#6B7280"
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
        <Text style={styles.label}>{t('menu.confirmPassword')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('menu.confirmPassword')}
            placeholderTextColor="#6B7280"
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
            <Text style={styles.submitText}>{t('menu.changePassword')}</Text>
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
