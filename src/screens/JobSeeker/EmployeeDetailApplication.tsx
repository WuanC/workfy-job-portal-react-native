import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import CVPreview from "../../components/CVPreview";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { getApplicationStatusLabel } from "../../utilities/constant";

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
        <Text style={styles.headerTitle}>Đơn ứng tuyển của tôi</Text>
        <Ionicons name="chatbox-outline" size={20} color="#000" />
      </View>

      {/* 🔹 Nội dung */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md }}
      >
        {/* 🧾 Job Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            Công việc:{" "}
            <Text style={styles.jobTitle}>{jobTitle || "Không rõ"}</Text>
          </Text>

          <View style={styles.statusRow}>
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
                {getApplicationStatusLabel(status) || "Trạng thái không xác định"}
              </Text>
            </View>
          </View>
        </View>

        {/* 📝 Cover Letter */}
        <Text style={styles.sectionTitle}>Thư xin việc</Text>
        <Text style={styles.coverLetter}>
          {coverLetter || "Ứng viên không gửi thư xin việc."}
        </Text>

        {/* 📎 Attachment */}
        <Text style={styles.sectionTitle}>Tệp đính kèm (CV)</Text>
        <View style={styles.attachmentContainer}>
          <CVPreview url={cvUrl} />
        </View>
      </ScrollView>
    </View>
  );
};

export default EmployeeDetailApplication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  infoContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  jobTitle: {
    fontWeight: "600",
    color: colors.text.primary,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: spacing.xs,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#F57C00",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  coverLetter: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: "#eee",
  },
  attachmentContainer: {
    height: 500,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
});
