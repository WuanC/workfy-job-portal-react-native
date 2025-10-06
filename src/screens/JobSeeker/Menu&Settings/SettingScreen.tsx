// SettingScreen.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type MenuNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePassword",
  "ChangeEmail"
>;
const SettingScreen = () => {
  const navigation = useNavigation<MenuNavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerContainer}>
        {/* left placeholder / back */}
        <TouchableOpacity
          style={styles.side}
          onPress={() => {
            // fallback: nếu không muốn goBack() (không có màn trước),
            // có thể navigation.navigate("MainApp") hoặc làm gì khác
            // tuỳ app của bạn.
            // @ts-ignore
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>

        {/* title */}
        <Text style={styles.headerTitle}>Cài đặt</Text>

        {/* right placeholder (giữ chỗ để title luôn center) */}
        <View style={styles.side} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Nhóm: Tài khoản */}
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("ChangePassword")}>
            <Ionicons name="key-outline" size={20} color="#333" style={styles.icon} />
            <Text style={styles.itemText}>Đổi mật khẩu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("ChangeEmail")}>
            <Ionicons name="mail-outline" size={20} color="#333" style={styles.icon} />
            <Text style={styles.itemText}>Đổi email đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, styles.itemLast]}>
            <Ionicons name="remove-circle-outline" size={20} color="#333" style={styles.icon} />
            <Text style={styles.itemText}>Xoá tài khoản</Text>
          </TouchableOpacity>
        </View>

        {/* Nhóm: Thông báo */}
        <Text style={styles.sectionTitle}>Thông báo</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.item, styles.itemLast]}>
            <Ionicons name="mail-outline" size={20} color="#333" style={styles.icon} />
            <Text style={styles.itemText}>Cài đặt thông báo email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7FA",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    // padding top/bottom để header có khoảng cách giống ảnh
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  side: {
    width: 48, // giữ chỗ trái/phải bằng nhau => title luôn center
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

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemText: {
    fontSize: 15,
    color: "#333",
  },
  icon: {
    marginRight: 12,
  },
});
