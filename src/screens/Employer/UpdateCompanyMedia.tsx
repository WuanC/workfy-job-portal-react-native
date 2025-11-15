import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  getEmployerProfile,
  updateEmployerWebsiteUrls,
} from "../../services/employerService";
import { colors, gradients } from "../../theme/colors";
import { spacing, borderRadius, shadows } from "../../theme/spacing";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import { useI18n } from "../../hooks/useI18n";

const UpdateCompanyMedia = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const [websiteLinks, setWebsiteLinks] = useState<string[]>([""]);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  /** 🧠 Lấy dữ liệu ban đầu */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployerProfile();
        if (data) {
          setWebsiteLinks(data.websiteUrls?.length ? data.websiteUrls : [""]);
          setFacebookUrl(data.facebookUrl || "");
          setTwitterUrl(data.twitterUrl || "");
          setLinkedinUrl(data.linkedinUrl || "");
          setGoogleUrl(data.googleUrl || "");
          setYoutubeUrl(data.youtubeUrl || "");
        }
      } catch (error) {
        console.log("❌ Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  /** 🧩 Xử lý thay đổi */
  const handleAddWebsite = () => setWebsiteLinks((prev) => [...prev, ""]);
  const handleWebsiteChange = (index: number, text: string) => {
    const updated = [...websiteLinks];
    updated[index] = text;
    setWebsiteLinks(updated);
  };
  const handleRemoveWebsite = (index: number) =>
    setWebsiteLinks((prev) => prev.filter((_, i) => i !== index));

  /** 💾 Gửi cập nhật */
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = {
        websiteUrls: websiteLinks.filter((url) => url.trim() !== ""),
        facebookUrl,
        twitterUrl,
        linkedinUrl,
        googleUrl,
        youtubeUrl,
      };
      await updateEmployerWebsiteUrls(payload);
      const { ToastService } = require("../../services/toastService");
      ToastService.success("Thành công", "Cập nhật thông tin công ty!");
      navigation.goBack();
    } catch (error) {
      console.log("❌ Cập nhật lỗi:", error);
      const { ToastService } = require("../../services/toastService");
      ToastService.error("Lỗi", "Không thể cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingWrapper>


      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('job.contactInfo')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Website */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('company.companyWebsite')}</Text>
            {websiteLinks.map((link, index) => (
              <View key={index} style={styles.inputRow}>
                <Ionicons name="globe-outline" size={18} color="#555" />
                <TextInput
                  placeholder={t('company.companyWebsite')}
                  style={styles.input}
                  value={link}
                  autoCapitalize="none"
                  onChangeText={(t) => handleWebsiteChange(index, t)}
                />
                {index > 0 && (
                  <TouchableOpacity onPress={() => handleRemoveWebsite(index)}>
                    <Ionicons name="close-circle" size={22} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={handleAddWebsite} style={styles.addBtn}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary.start} />
              <Text style={styles.addText}>{t('company.companyWebsite')}</Text>
            </TouchableOpacity>
          </View>

          {/* Mạng xã hội */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('job.contactInfo')}</Text>
            {[
              { label: "Facebook", icon: "logo-facebook", color: "#1877F2", value: facebookUrl, set: setFacebookUrl },
              { label: "Twitter", icon: "logo-twitter", color: "#1DA1F2", value: twitterUrl, set: setTwitterUrl },
              { label: "LinkedIn", icon: "logo-linkedin", color: "#0077b5", value: linkedinUrl, set: setLinkedinUrl },
              { label: "Google", icon: "logo-google", color: "#DB4437", value: googleUrl, set: setGoogleUrl },
              { label: "YouTube", icon: "logo-youtube", color: "#FF0000", value: youtubeUrl, set: setYoutubeUrl },
            ].map((item, i) => (
              <View key={i} style={styles.inputRow}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
                <TextInput
                  placeholder={`https://${item.label.toLowerCase()}.com/...`}
                  style={styles.input}
                  value={item.value}
                  autoCapitalize="none"
                  onChangeText={item.set}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Nút lưu cố định dưới cùng */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdate}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary.start, colors.primary.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>{t('common.save')}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

/** 🎨 Styles */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: {
    padding: spacing.md,
    paddingBottom: 120, // chừa chỗ cho nút
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    height: 50,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: colors.text.primary,
    fontSize: 15,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  addText: {
    color: colors.primary.start,
    fontWeight: "600",
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  saveButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default UpdateCompanyMedia;
