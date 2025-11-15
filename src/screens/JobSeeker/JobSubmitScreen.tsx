import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { ToastService } from "../../services/toastService";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";

import { getUserProfile } from "../../services/employeeService";
import { validateField } from "../../utilities/validation";
import {
  applyWithFileCV,
  applyWithLinkCV,
  getLatestApplicationByJob,
} from "../../services/applicationService";
import { RootStackParamList } from "../../types/navigation";
import { colors, gradients } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { useI18n } from "../../hooks/useI18n";
// Using plain TextInput for cover letter instead of rich text editor

type JobSubmitSuccessNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "JobSubmitSuccess"
>;

const JobSubmitScreen = ({ route }: any) => {
  const { jobId, jobName } = route.params as { jobId: number; jobName: string };
  const navigation = useNavigation<JobSubmitSuccessNavigationProp>();
  const { t } = useI18n();
  // cover letter is a plain textarea (TextInput)
  const [profile, setProfile] = useState<any>(null);
  const [latestJob, setLatestJob] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [cvFileUri, setCvFileUri] = useState("");
  const [cvFile, setFile] = useState<any>(null);

  const [cvLink, setCvLink] = useState("");

  const [useLink, setUseLink] = useState(false);

  const [coverContent, setCoverContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setPhoneNumber(data.phoneNumber || "");
      } catch {
        ToastService.error(t('common.error'), t('application.loadProfileError'));
      }
    };

    const fetchLatestApplication = async () => {
      try {
        const latestApplication = await getLatestApplicationByJob(jobId);
        if (latestApplication?.data === null) {
          setLatestJob(null)
        }

        else if (latestApplication) {
          setLatestJob(latestApplication);
          setPhoneNumber(latestApplication.phoneNumber);
          setCoverContent(latestApplication.coverLetter);
          setCvLink(latestApplication.cvUrl)
          setUseLink(true)
        }
      } catch (err: any) {
        setLatestJob(null)
      }
    };

    fetchProfile();
    fetchLatestApplication();
  }, []);

  const handleUploadCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setCvFileUri(file.uri);
      setUseLink(false);
      setFile(file);
      ToastService.success(t('common.success'), t('application.cvUploaded'));
    } catch (err: any) {
      ToastService.error(t('common.error'), err.message || t('application.cvUploadError'));
    }
  };

  const handleSubmit = async () => {
    if (!coverContent.trim()) {
      ToastService.warning("Thiếu thông tin", "Vui lòng nhập thư xin việc!");
      return;
    }

    if (!useLink && (cvFileUri == "" || cvFile == null)) {
      ToastService.warning("Thiếu CV", "Vui lòng tải lên CV hoặc nhập link!");
      return;
    }

    if (useLink && !cvLink.trim()) {
      ToastService.warning("Thiếu link CV", "Vui lòng nhập link CV!");
      return;
    }

    // validate phone before submitting
    const phoneErr = validateField(phoneNumber || "", "phone");
    if (phoneErr) {
      ToastService.warning("Sai định dạng", phoneErr);
      return;
    }
    // validate profile email if present
    if (profile?.email) {
      const emailErr = validateField(profile.email, "email");
      if (emailErr) {
        ToastService.warning("Sai định dạng", emailErr);
        return;
      }
    }

    setLoading(true);
    try {
      if (useLink) {
        await applyWithLinkCV({
          fullName: profile.fullName,
          email: profile.email,
          phoneNumber,
          coverLetter: coverContent,
          jobId,
          cvUrl: cvLink,
        });
      } else {
        await applyWithFileCV(
          {
            fullName: profile.fullName,
            email: profile.email,
            phoneNumber,
            coverLetter: coverContent,
            jobId,
          },
          cvFile
        );
      }
      ToastService.success(t('common.success'), t('application.submitSuccess'));
      setLoading(false);
      navigation.replace("JobSubmitSuccess");
    } catch (error: any) {
      setCvFileUri("")
      setFile(null)
      console.error("Lỗi ứng tuyển:", error);
      ToastService.error(t('common.error'), t('application.submitError'));
    } finally {
      setLoading(false);
    }
  };
  // no rich editor initialization required for plain TextInput
  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.jobTitle}>{jobName}</Text>
        </View>
      </View>

      {/* 📋 Nội dung */}
      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}
      >
        {/* 👤 Thông tin cá nhân */}
        <View style={styles.card}>
          {latestJob && (
            <Text style={styles.notice}>
              Bạn còn {3 - latestJob.applyCount} lượt nộp cho công việc này
            </Text>
          )}

          <View style={styles.userRow}>
            <Ionicons name="person-circle-outline" size={50} color="#555" />
            <View>
              <Text style={styles.name}>{profile?.fullName}</Text>
              <Text style={styles.email}>{profile?.email}</Text>
            </View>
          </View>

          <Text style={styles.label}>
            Số điện thoại <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Nhập số điện thoại"
            style={styles.input}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* 📄 Hồ sơ xin việc */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hồ sơ xin việc</Text>

          {latestJob?.cvUrl && (
            <View>
              <TouchableOpacity
                style={[styles.option, useLink && styles.optionActive]}
                onPress={() => {
                  setUseLink(true);
                }}
              >
                <MaterialIcons name="link" size={22} color={colors.primary.start} />
                <Text style={styles.optionText}>Link CV của bạn</Text>
              </TouchableOpacity>
              {useLink == true && (
                <TouchableOpacity
                  style={styles.cvContainer}
                  onPress={() => Linking.openURL(latestJob.cvUrl)}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={colors.primary.start}
                  />
                  <Text style={styles.cvName}>
                    {latestJob.cvUrl.split("/").pop()}
                  </Text>
                </TouchableOpacity>
              )}

            </View>
          )}

          {/* 🔗 Chọn cách nộp CV */}



          <TouchableOpacity
            style={[styles.option, !useLink && styles.optionActive]}
            onPress={() => {
              setUseLink(false);
            }}
          >
            <MaterialIcons
              name="upload-file"
              size={22}
              color={colors.primary.start}
            />
            <Text style={styles.optionText}>Tải lên từ thiết bị</Text>
          </TouchableOpacity>

          {!useLink && (
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={handleUploadCV}
            >
              <Text style={styles.uploadText}>Chọn tệp để tải lên</Text>
            </TouchableOpacity>
          )}

          {(cvFileUri != "" && useLink == false) ? (
            <TouchableOpacity
              style={styles.cvContainer}
              onPress={() => Linking.openURL(latestJob.cvUrl)}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.primary.start}
              />
              <Text style={styles.cvName}>
                {cvFileUri.split("/").pop()}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* 💌 Thư xin việc */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Thư xin việc <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.editorWrapper}>
            <TextInput
              style={[styles.editor, { textAlignVertical: 'top' }]}
              placeholder="Nhập thư xin việc..."
              multiline
              value={coverContent}
              onChangeText={setCoverContent}
              numberOfLines={10}
            />
          </View>
        </View>

      </ScrollView>

      {/* 🟩 Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
          <LinearGradient
            colors={gradients.purpleDream as any}
            style={styles.submitButton}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {loading && (
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
              )}
              <Text style={styles.submitText}>{loading ? t('application.submitting') : t('application.submitNow')}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobSubmitScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 14, color: "#555" },
  jobTitle: { fontSize: 16, fontWeight: "700", color: "#000" },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  label: { fontSize: 14, fontWeight: "600", marginTop: 8 },
  required: { color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  email: { fontSize: 14, color: "#666" },
  notice: { color: colors.primary.start, fontWeight: "600", marginBottom: 8 },

  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 6 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: "#f0f6ff",
    borderColor: colors.primary.start,
  },
  optionText: { marginLeft: 8, fontSize: 14, fontWeight: "600", color: "#000" },

  uploadBtn: {
    borderWidth: 1,
    borderColor: colors.primary.start,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  uploadText: { color: colors.primary.start, fontWeight: "600" },
  selectedFile: { color: "green", marginTop: 6 },

  cvContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  cvName: {
    flex: 1,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },

  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  editorWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginVertical: 6,
  },
  toolbar: {
    backgroundColor: "#F7F9FC",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EB",
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 44,
  },
  editor: {
    minHeight: 180,
    padding: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#FFFFFF",
  },
});
