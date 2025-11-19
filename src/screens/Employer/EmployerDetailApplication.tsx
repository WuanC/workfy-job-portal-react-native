import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import CVPreview from "../../components/CVPreview";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import {
  ApplicationStatus,
  getEnumOptions,
} from "../../utilities/constant";
import {
  getApplicationById,
  updateApplicationStatus,
} from "../../services/applicationService";
import { Dropdown } from "react-native-element-dropdown";
import { useI18n } from "../../hooks/useI18n";
import { getConversationByApplicationId } from "../../services/messageService";
import { ConversationResponse } from "../../types/type";

type EmployeeDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmployeeDetailApplication"
>;

const EmployerDetailApplication = ({ route }: any) => {
  const navigation = useNavigation<EmployeeDetailNavigationProp>();
  const { applicationId } = route.params as { applicationId: number };
  const { t } = useI18n();

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);

  useEffect(() => {
    const fetchApplicationById = async () => {
      try {
        const data = await getApplicationById(applicationId);
        setApplication(data);
        setStatus(data.status);
        
        // Tải conversation cho application này
        try {
          const conv = await getConversationByApplicationId(applicationId);
          setConversation(conv);
        } catch (convErr) {
          console.log("No conversation found for this application yet");
        }
      } catch (err: any) {
        const msg = err?.message || "Không thể tải đơn xin việc. Vui lòng thử lại.";
        const { ToastService } = require("../../services/toastService");
        ToastService.error("❌ Lỗi", msg);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationById();
  }, []);

  const handleChangeStatus = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      setUpdating(true);
      await updateApplicationStatus(applicationId, newStatus);
      const { ToastService } = require("../../services/toastService");
      ToastService.success("✅ Thành công", "Cập nhật trạng thái hồ sơ thành công!");
      setApplication((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err: any) {
      const { ToastService } = require("../../services/toastService");
      ToastService.error("❌ Lỗi", err?.message || "Không thể cập nhật trạng thái.");
      setStatus(application?.status);
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenChat = () => {
    if (conversation) {
      // @ts-ignore - Navigate to EmployerChat screen with conversation data
      navigation.navigate("EmployerChat", { conversation });
    } else {
      const { ToastService } = require("../../services/toastService");
      ToastService.error("❌ Lỗi", "Chưa có cuộc trò chuyện với ứng viên này");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary.start} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('application.viewApplication')}</Text>
        {conversation && (
          <TouchableOpacity onPress={handleOpenChat} style={styles.chatBtn}>
            <Ionicons name="chatbubbles" size={22} color={colors.primary.start} />
          </TouchableOpacity>
        )}
        {!conversation && <View />}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md }}
        nestedScrollEnabled={true}
      >
        {/* 🪧 Job Info */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('job.jobTitle')}</Text>
          <Text style={styles.jobTitle}>
            {application?.job?.jobTitle || t('job.jobTitle')}
          </Text>
        </View>

        {/* 🔄 Dropdown đổi trạng thái */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('application.applicationStatus')}</Text>
          <Dropdown
            data={getEnumOptions(ApplicationStatus)}
            labelField="label"
            valueField="value"
            placeholder={t('application.applicationStatus')}
            value={status}
            onChange={(item) => handleChangeStatus(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            disable={updating}
          />
          {updating && (
            <Text style={styles.updatingText}>{t('common.loading')}</Text>
          )}
        </View>

        {/* 📝 Cover Letter */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('profile.cv')}</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder={t('profile.cv')}
            value={application?.coverLetter || ""}
            editable={false} // 👈 nếu bạn muốn chỉ xem chứ không sửa thì để false
            scrollEnabled
            textAlignVertical="top"
          />
        </View>

        {/* 📎 CV đính kèm */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('profile.uploadCV')}</Text>
          <View style={styles.previewContainer}>
            <CVPreview url={application?.cvUrl} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EmployerDetailApplication;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  chatBtn: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.text.primary },

  // --- Sections ---
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary.start,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    backgroundColor: "#ffffffff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  coverBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  coverLetter: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
  },
  previewContainer: {
    height: 480,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  placeholder: { color: "#aaa", fontSize: 14 },
  selectedText: { color: "#333", fontSize: 15 },
  updatingText: { color: "#777", fontSize: 12, marginTop: 4 },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: "#777" },
  textArea: {
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: spacing.md,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    minHeight: 140,
  },

});
