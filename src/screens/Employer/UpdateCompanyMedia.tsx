import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import apiInstance from "../../api/apiInstance"; // ✅ đảm bảo đúng đường dẫn
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getEmployerProfile, updateEmployerWebsiteUrls } from "../../services/employerService";

const UpdateCompanyMedia = () => {
  const navigation = useNavigation();

  const [websiteLinks, setWebsiteLinks] = useState([""]);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyImage, setCompanyImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** 🧠 Lấy dữ liệu từ API /me */
  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const data = await getEmployerProfile();
        if (data) {
          setWebsiteLinks(data.websiteUrls && data.websiteUrls.length > 0 ? data.websiteUrls : [""]);
          setLinkedinUrl(data.linkedinUrl || "");
          setCompanyImage(data.backgroundUrl || null);
        }
      } catch (error) {
        console.log("❌ Lỗi khi lấy employer:", error);
      }
    };

    fetchEmployerData();
  }, []);

  /** ➕ Thêm website */
  const handleAddWebsite = () => setWebsiteLinks((prev) => [...prev, ""]);

  /** ✏️ Thay đổi website */
  const handleWebsiteChange = (index: number, text: string) => {
    const updated = [...websiteLinks];
    updated[index] = text;
    setWebsiteLinks(updated);
  };

  /** 🗑️ Xóa website */
  const handleRemoveWebsite = (index: number) => {
    setWebsiteLinks((prev) => prev.filter((_, i) => i !== index));
  };

  /** 📷 Chọn ảnh công ty */
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setCompanyImage(result.assets[0].uri);
  };

  /** 🔙 Quay lại */
  const handleCancel = () => navigation.goBack();

  /** 💾 Cập nhật */
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = {
        websiteUrls: websiteLinks.filter((url) => url.trim() !== ""),
        linkedinUrl,
      };

      await updateEmployerWebsiteUrls(payload);
      Alert.alert("✅ Thành công", "Cập nhật liên kết và hình ảnh công ty thành công!");
      navigation.goBack();
    } catch (error) {
      console.log("❌ Lỗi khi cập nhật:", error);
      Alert.alert("❌ Lỗi", "Không thể cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liên kết & hình ảnh</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Website & Liên kết mạng xã hội</Text>

        {/* Website */}
        <Text style={styles.label}>Trang web công ty</Text>
        {websiteLinks.map((link, index) => (
          <View key={index} style={styles.inputRow}>
            <Ionicons name="globe-outline" size={20} color="#666" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="https://example.com"
              value={link}
              onChangeText={(text) => handleWebsiteChange(index, text)}
            />
            {index > 0 && (
              <TouchableOpacity onPress={() => handleRemoveWebsite(index)}>
                <Ionicons name="remove-circle" size={22} color="red" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addLinkBtn} onPress={handleAddWebsite}>
          <Text style={styles.addLinkText}>+ Thêm website</Text>
        </TouchableOpacity>

        {/* LinkedIn */}
        <Text style={[styles.label, { marginTop: 20 }]}>LinkedIn</Text>
        <View style={styles.inputRow}>
          <FontAwesome name="linkedin" size={20} color="#1877F2" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="https://linkedin.com/company/your-company"
            value={linkedinUrl}
            onChangeText={setLinkedinUrl}
          />
        </View>

        {/* Hình ảnh công ty */}
        <Text style={[styles.label, { marginTop: 20 }]}>Hình ảnh công ty</Text>
        <TouchableOpacity style={styles.imageBox} onPress={handlePickImage}>
          {companyImage ? (
            <Image source={{ uri: companyImage }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={40} color="#666" />
              <Text style={{ color: "#666", marginTop: 5 }}>Thêm hình ảnh mới</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Nút */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={loading}>
            <Text style={styles.updateText}>{loading ? "Đang lưu..." : "Cập nhật"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

/** 🎨 Giao diện gốc giữ nguyên */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c2d4e8ff",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  backButton: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#222" },
  label: { fontSize: 14, color: "#333", marginTop: 12, marginBottom: 5 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  addLinkBtn: { marginTop: 4 },
  addLinkText: { color: "#007bff", fontSize: 15 },
  imageBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 10,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 25,
    marginBottom: 100,
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  cancelText: { color: "#333", fontWeight: "500" },
  updateButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#007bff",
  },
  updateText: { color: "#fff", fontWeight: "600" },
});

export default UpdateCompanyMedia;
