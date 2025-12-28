import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import CVPreview from "../../components/CVPreview";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { getApplicationStatusLabel } from "../../utilities/constant";
import { useI18n } from "../../hooks/useI18n";

type EmployeeDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmployeeDetailApplication"
>;

export const ApplicationStatus = {
  UNREAD: "Hồ sơ mới gửi, chưa được nhà tuyển dụng đọc.",
  VIEWED: "Nhà tuyển dụng đã mở và xem hồ sơ.",
  EMAILED: "Đã liên hệ ứng viên qua email.",
  SCREENING: "Đang sàng lọc hồ sơ.",
  SCREENING_PENDING: "Đã sàng lọc, đang chờ quyết định tiếp theo.",
  INTERVIEW_SCHEDULING: "Đang lên lịch phỏng vấn.",
  INTERVIEWED_PENDING: "Đã phỏng vấn, chờ quyết định.",
  OFFERED: "Đã gửi offer cho ứng viên.",
  REJECTED: "Từ chối hồ sơ.",
};

const statusStyles: any = {
  UNREAD: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FFB74D",
    text: { color: "#E65100" },
  },
  VIEWED: {
    backgroundColor: "#E0F7FA",
    borderColor: "#4DD0E1",
    text: { color: "#006064" },
  },
  EMAILED: {
    backgroundColor: "#E3F2FD",
    borderColor: "#64B5F6",
    text: { color: "#0D47A1" },
  },
  SCREENING: {
    backgroundColor: "#F3E5F5",
    borderColor: "#BA68C8",
    text: { color: "#6A1B9A" },
  },
  SCREENING_PENDING: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FFD54F",
    text: { color: "#F57F17" },
  },
  INTERVIEW_SCHEDULING: {
    backgroundColor: "#E8F5E9",
    borderColor: "#81C784",
    text: { color: "#1B5E20" },
  },
  INTERVIEWED_PENDING: {
    backgroundColor: "#E1F5FE",
    borderColor: "#4FC3F7",
    text: { color: "#0277BD" },
  },
  OFFERED: {
    backgroundColor: "#E8F5E9",
    borderColor: "#81C784",
    text: { color: "#2E7D32" },
  },
  REJECTED: {
    backgroundColor: "#FFEBEE",
    borderColor: "#EF9A9A",
    text: { color: "#C62828" },
  },
  DEFAULT: {
    backgroundColor: "#ECEFF1",
    borderColor: "#CFD8DC",
    text: { color: "#455A64" },
  },
};

const EmployeeDetailApplication = ({ route }: any) => {
  const navigation = useNavigation<EmployeeDetailNavigationProp>();
  const { t } = useI18n();

  const { id, status, cvUrl, jobTitle, coverLetter } = route.params as {
    id: number;
    status: string;
    cvUrl: string;
    jobTitle: string;
    coverLetter: string;
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('application.myApplication')}</Text>
        {/* <Ionicons name="chatbox-outline" size={20} color="#000" /> */}
        <View></View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md }}
        nestedScrollEnabled={true}
      >
        {/* 🧾 Job Info */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('job.jobTitle')}</Text>
          <Text style={styles.jobTitle}>{jobTitle || t('common.unknown')}</Text>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('application.profileStatus')}</Text>
          <View
            style={[
              styles.statusBadge,
              statusStyles[status] || statusStyles.DEFAULT,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                (statusStyles[status] || statusStyles.DEFAULT).text,
              ]}
            >
              {getApplicationStatusLabel(status) || t('application.unknownStatus')}
            </Text>
          </View>
        </View>

        {/* 📝 Cover Letter */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('application.coverLetter')}</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder={t('application.noCoverLetter')}
            placeholderTextColor="#6B7280"
            value={coverLetter || ""}
            editable={false}
            scrollEnabled
            textAlignVertical="top"
          />
        </View>

        {/* 📎 CV đính kèm */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('application.attachedCV')}</Text>
          <View style={styles.previewContainer}>
            <CVPreview url={cvUrl} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EmployeeDetailApplication;

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
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  previewContainer: {
    height: 480,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
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
  }
});
