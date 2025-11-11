"use client"

import { useCallback, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../../types/navigation"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useAuth } from "../../../context/AuthContext"
import { colors } from "../../../theme/colors"
import { getEmployerProfile } from "../../../services/authService"
import { getUserProfile, updateEmployeeAvatar } from "../../../services/employeeService"

type MenuNavigationProp = NativeStackNavigationProp<RootStackParamList, "Setting">

const MenuScreen = () => {
  const { logout } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const navigation = useNavigation<MenuNavigationProp>()
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const pickImage = async (onPicked: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const { ToastService } = require("../../../services/toastService");
      ToastService.warning("Quyền truy cập bị từ chối", "Vui lòng cấp quyền truy cập ảnh.");
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
  const onEditLogo = () => {
    pickImage(async (uri) => {
      try {
        setLogoUri(uri);
        const updatedData = await updateEmployeeAvatar(uri);
        setProfile((prev: any) => ({
          ...prev,
          avatarUrl: updatedData.avatarUrl,
        }));
        const { ToastService } = require("../../../services/toastService");
        ToastService.success("Thành công", "Cập nhật avatar thành công!");
      } catch (error) {
        console.error(error);
        const { ToastService } = require("../../../services/toastService");
        ToastService.error("Lỗi", "Cập nhật avatar thất bại.");
      }
    });
  };
  const toggleMoreOptions = () => setShowMoreOptions(!showMoreOptions)

  const handleLogout = async () => {
    await logout()
    navigation.replace("Login")
  }
  useFocusEffect(
    useCallback(() => {
      const fetchCompany = async () => {
        try {
          const data = await getUserProfile();
          setProfile(data);
        } catch (err) {
          const { ToastService } = require("../../../services/toastService");
          ToastService.error("Lỗi", "Không thể tải thông tin bản thân.");
        }
      };
      fetchCompany();
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* === Profile Card === */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={onEditLogo}>
              <Image
              source={
                logoUri
                  ? { uri: logoUri }
                  : profile?.avatarUrl
                    ? { uri: profile.avatarUrl }
                    : require("../../../../assets/App/userAvt.jpeg")
              }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{profile?.fullName}</Text>
              <Text style={styles.userEmail}>{profile?.email}</Text>
            </View>
          </View>

          {/* <TouchableOpacity style={styles.employersSection}>
            <View>
              <Text style={styles.employersLabel}>Nhà tuyển dụng đã xem</Text>
              <Text style={styles.employersCount}>0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </TouchableOpacity> */}

          <Text style={styles.registrationDate}>Ngày đăng ký: {profile?.createdAt}</Text>
        </View>

        {/* === My CareerLink Section === */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>My CareerLink</Text>
          <View style={styles.menuGrid}>
            <TouchableOpacity style={[styles.menuCard, { borderColor: colors.primary.light }]}>
              <Ionicons name="document-text" size={24} color={colors.primary.start} />
              <Text style={styles.menuText}>Hồ sơ của tôi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuCard, { borderColor: colors.primary.light }]}>
              <Ionicons name="mail" size={24} color={colors.primary.start} />
              <Text style={styles.menuText}>Thư xin việc</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* === Settings Section === */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Setting")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings" size={20} color={colors.text.secondary} />
              <Text style={styles.menuItemText}>Cài đặt</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="globe" size={20} color={colors.text.secondary} />
              <Text style={styles.menuItemText}>Ngôn ngữ</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={toggleMoreOptions}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
              <Text style={styles.menuItemText}>Thêm</Text>
            </View>
            <Ionicons
              name={showMoreOptions ? "chevron-up" : "chevron-down"}
              size={16}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          {showMoreOptions && (
            <View style={styles.moreOptions}>
              {["Thoả thuận sử dụng", "Chính sách bảo mật", "Liên hệ", "Về chúng tôi"].map(
                (text, i) => (
                  <TouchableOpacity key={i} style={styles.moreOptionItem}>
                    <Text style={styles.moreOptionText}>{text}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}
        </View>

        {/* === Logout Button === */}
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary.start, colors.primary.end || "#667eea"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.btn, { shadowColor: colors.error.start || "#f5576c" }]}
          >
            <Text style={styles.btnText}>Đăng xuất</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.versionText}>Phiên bản 1.0.19</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: 16,
  },

  // Profile Card
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border.light,
    marginRight: 12,
  },
  profileInfo: { flex: 1 },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.text.secondary,
  },

  employersSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary.light + "20",
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  employersLabel: {
    fontSize: 13,
    color: colors.primary.start,
  },
  employersCount: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary.dark,
  },
  registrationDate: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 6,
  },

  // Section Title
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 10,
  },

  // Menu Grid
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuCard: {
    flex: 0.48,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.primary,
    marginTop: 6,
  },

  // Menu Items
  menuItem: {
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 15,
    color: colors.text.primary,
    marginLeft: 10,
  },

  // More Options
  moreOptions: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginTop: 6,
    paddingVertical: 4,
  },
  moreOptionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  moreOptionText: {
    fontSize: 13,
    color: colors.text.secondary,
  },

  // Logout
  logoutButton: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  logoutText: {
    fontSize: 15,
    color: colors.error.start,
    fontWeight: "500",
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: colors.primary.start,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 14,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  versionText: {
    textAlign: "center",
    fontSize: 11,
    color: colors.text.tertiary,
    marginBottom: 16,
  },
})

export default MenuScreen
