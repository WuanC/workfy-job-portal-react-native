import React, { useState } from "react";
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

const UpdateCompanyMedia = () => {
  const navigation = useNavigation();

  const [websiteLinks, setWebsiteLinks] = useState([""]);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    youtube: "",
    google: "",
    linkedin: "",
    twitter: "",
  });
  const [companyImage, setCompanyImage] = useState<string | null>(null);

  const handleAddWebsite = () => {
    setWebsiteLinks([...websiteLinks, ""]);
  };

  const handleWebsiteChange = (index: number, text: string) => {
    const updated = [...websiteLinks];
    updated[index] = text;
    setWebsiteLinks(updated);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setCompanyImage(result.assets[0].uri);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleUpdate = () => {
    Alert.alert("✅ Thành công", "Hình ảnh và mạng xã hội công ty đã được cập nhật!");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hình ảnh & mạng xã hội</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Hình ảnh và mạng xã hội công ty</Text>

        {/* Website */}
        <Text style={styles.label}>Trang web</Text>
        {websiteLinks.map((link, index) => (
          <View key={index} style={styles.inputRow}>
            <Ionicons name="globe-outline" size={20} color="#666" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Nhập liên kết"
              value={link}
              onChangeText={(text) => handleWebsiteChange(index, text)}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addLinkBtn} onPress={handleAddWebsite}>
          <Text style={styles.addLinkText}>+ Thêm mới</Text>
        </TouchableOpacity>

        {/* Mạng xã hội */}
        <Text style={[styles.label, { marginTop: 20 }]}>Mạng xã hội</Text>
        {Object.entries(socialLinks).map(([key, value]) => (
          <View key={key} style={styles.inputRow}>
            <FontAwesome
              name={
                key === "facebook"
                  ? "facebook"
                  : key === "youtube"
                  ? "youtube-play"
                  : key === "google"
                  ? "google"
                  : key === "linkedin"
                  ? "linkedin"
                  : "twitter"
              }
              size={20}
              color="#1877F2"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập liên kết"
              value={value}
              onChangeText={(text) =>
                setSocialLinks((prev) => ({ ...prev, [key]: text }))
              }
            />
          </View>
        ))}

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
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

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
