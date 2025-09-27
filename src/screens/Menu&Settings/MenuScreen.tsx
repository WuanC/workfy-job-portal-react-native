"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
type MenuNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Setting"
>;
const MenuScreen = () => {
  const navigation = useNavigation<MenuNavigationProp>();
  const [showMoreOptions, setShowMoreOptions] = useState(false)

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/60x60/6B7280/FFFFFF?text=WC" }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Wuan C</Text>
              <Text style={styles.userEmail}>bo11082007@gmail.com</Text>
            </View>
          </View>

          {/* Employers Viewed Section */}
          <TouchableOpacity style={styles.employersSection}>
            <View style={styles.employersInfo}>
              <Text style={styles.employersLabel}>Nhà tuyển dụng đã xem</Text>
              <Text style={styles.employersCount}>0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.registrationDate}>Ngày đăng kí: 09/09/2025</Text>
        </View>

        {/* My CareerLink Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My CareerLink</Text>

          <View style={styles.menuGrid}>
            <TouchableOpacity style={styles.menuCard}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="document-text" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.menuText}>Hồ sơ của tôi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="mail" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.menuText}>Thư xin việc</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Setting")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings" size={20} color="#666" />
              <Text style={styles.menuItemText}>Cài đặt</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="globe" size={20} color="#666" />
              <Text style={styles.menuItemText}>Ngôn ngữ</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={toggleMoreOptions}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              <Text style={styles.menuItemText}>Thêm</Text>
            </View>
            <Ionicons name={showMoreOptions ? "chevron-up" : "chevron-down"} size={16} color="#666" />
          </TouchableOpacity>

          {/* More Options - Expandable */}
          {showMoreOptions && (
            <View style={styles.moreOptions}>
              <TouchableOpacity style={styles.moreOptionItem}>
                <Text style={styles.moreOptionText}>Thoát thuận sử dụng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreOptionItem}>
                <Text style={styles.moreOptionText}>Chính sách bảo mật</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreOptionItem}>
                <Text style={styles.moreOptionText}>Liên hệ với chúng tôi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreOptionItem}>
                <Text style={styles.moreOptionText}>Về chúng tôi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Phiên bản 1.0.19</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E5E5",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  employersSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EBF4FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  employersInfo: {
    flex: 1,
  },
  employersLabel: {
    fontSize: 14,
    color: "#3B82F6",
    marginBottom: 4,
  },
  employersCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  registrationDate: {
    fontSize: 12,
    color: "#999",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    flex: 0.48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIconContainer: {
    marginBottom: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  menuItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  moreOptions: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 8,
  },
  moreOptionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  moreOptionText: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginBottom: 20,
  },
})

export default MenuScreen
