import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";
import { getUserProfile } from "../../services/employeeService";
import { RootStackParamList } from "../../types/navigation";
import { applyWithFileCV, applyWithFileCV1, applyWithLinkCV, uploadFile } from "../../services/applicationService";

type JobSubmitSuccessNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "JobSubmitSuccess"
>;

const JobSubmitScreen = ({ route }: any) => {
  const { jobId, jobName } = route.params as { jobId: number; jobName: string };
  const navigation = useNavigation<JobSubmitSuccessNavigationProp>();

  const [profile, setProfile] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [cvUri, setCvUri] = useState<string>("");
  const [cvFile, setFile] = useState<any>(null)
  const [cvLink, setCvLink] = useState<string>("");
  const [useLink, setUseLink] = useState<boolean>(false);

  const [coverContent, setCoverContent] = useState("");
  const [saveChecked, setSaveChecked] = useState(false);

  // 🔹 Lấy thông tin hồ sơ
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setPhoneNumber(data.phoneNumber || "");
      } catch {
        Alert.alert("Lỗi", "Không thể tải thông tin bản thân.");
      }
    };
    fetchProfile();
  }, []);

  // 🔹 Chọn file từ máy
  const handleUploadCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
        ],
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setCvUri(file.uri);
      setUseLink(false);
      setFile(file)
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải CV lên.");
    }
  };

  // 🔹 Nộp đơn
  const handleSubmit = async () => {
    if (!coverContent.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thư xin việc!");
      return;
    }

    // ✅ Sửa điều kiện kiểm tra - check cả undefined, null và empty string
    if (!useLink && !cvUri) {
      Alert.alert("Thiếu CV", "Vui lòng tải lên CV hoặc nhập link CV!");
      return;
    }

    if (useLink && !cvLink.trim()) {
      Alert.alert("Thiếu link CV", "Vui lòng nhập link CV!");
      return;
    }

    try {
      let res;

      if (useLink) {
        // 🟢 Gọi API nộp bằng link
        res = await applyWithLinkCV({
          fullName: profile.fullName,
          email: profile.email,
          phoneNumber,
          coverLetter: coverContent,
          jobId,
          cvUrl: cvLink,
        });
      } else {
        // 🟢 Gọi API nộp bằng file
        console.log("📄 Đang gửi CV với URI:", cvUri); // Debug log

        res = await applyWithFileCV1(
          {
            fullName: profile.fullName,
            email: profile.email,
            phoneNumber,
            coverLetter: coverContent,
            jobId,
          },
          cvFile // Truyền cvUri vào đây
        );
      }

      console.log("✅ Ứng tuyển thành công:", res);
      navigation.replace("JobSubmitSuccess");
    } catch (error: any) {
      console.error("❌ Lỗi khi ứng tuyển:", error);
      Alert.alert("Lỗi", error.message || "Không thể gửi ứng tuyển, vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { paddingVertical: 20, paddingHorizontal: 5 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Nộp đơn cho</Text>
          <Text style={styles.jobTitle}>{jobName}</Text>
        </View>
          <Button title="Chọn và gửi file" onPress={uploadFile} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {/* Thông tin cá nhân */}
        <View style={styles.infoContainer}>
          <View style={styles.userRow}>
            <Ionicons name="person-circle-outline" size={48} color="#555" />
            <View>
              <Text style={styles.name}>{profile?.fullName}</Text>
              <Text style={styles.email}>{profile?.email}</Text>
            </View>
          </View>

          <Text style={styles.label}>
            Số điện thoại <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput
            placeholder="Nhập số điện thoại của bạn"
            style={styles.input}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Hồ sơ xin việc */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Hồ sơ xin việc</Text>
          <Text style={styles.subLabel}>
            Nhà tuyển dụng yêu cầu hồ sơ:{" "}
            <Text style={styles.highlight}>Tiếng Việt</Text>
          </Text>

          {/* Nhập link */}
          <TouchableOpacity
            style={[styles.option, useLink && styles.cellActive]}
            onPress={() => {
              setUseLink(true);
              setCvUri(""); // Reset cvUri khi chuyển sang link
            }}
          >
            <MaterialIcons name="link" size={24} color="#007bff" />
            <Text style={styles.optionTitle}>Nhập link CV của bạn</Text>
          </TouchableOpacity>

          {useLink && (
            <TextInput
              placeholder="Dán link Google Drive hoặc URL CV..."
              value={cvLink}
              onChangeText={setCvLink}
              style={[styles.input, { marginTop: 8 }]}
            />
          )}

          {/* Tải file */}
          <TouchableOpacity
            style={[styles.option, !useLink && styles.cellActive]}
            onPress={() => {
              setUseLink(false);
              setCvLink(""); // Reset cvLink khi chuyển sang file
            }}
          >
            <MaterialIcons name="upload-file" size={24} color="#007bff" />
            <Text style={styles.optionTitle}>
              Tải lên từ điện thoại của bạn
            </Text>
          </TouchableOpacity>

          {!useLink && (
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity style={styles.selectBtn} onPress={handleUploadCV}>
                <Text style={{ color: "#007bff", fontWeight: "600" }}>
                  Chọn tệp để tải lên
                </Text>
              </TouchableOpacity>
              {cvUri ? (
                <Text style={{ color: "green", marginTop: 6 }}>
                  ✅ Đã chọn: {cvUri.split("/").pop()}
                </Text>
              ) : null}
            </View>
          )}
        </View>

        {/* Thư xin việc - bắt buộc */}
        <View style={styles.infoContainer}>
          <View style={styles.letterTitleRow}>
            <Text style={styles.sectionTitle}>
              Thư xin việc <Text style={{ color: "red" }}>*</Text>
            </Text>
          </View>

          <TextInput
            placeholder="Nội dung thư"
            value={coverContent}
            onChangeText={setCoverContent}
            style={[styles.input, { height: 120, textAlignVertical: "top" }]}
            multiline
          />

          <View style={styles.checkboxRow}>
            <Checkbox
              value={saveChecked}
              onValueChange={setSaveChecked}
              color={saveChecked ? "#007bff" : undefined}
            />
            <Text style={{ marginLeft: 8 }}>Lưu thư xin việc này</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nộp đơn */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Nộp đơn ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobSubmitScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e1eff5ff" },
  backBtn: { marginRight: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 14, fontWeight: "500", color: "#333" },
  jobTitle: { fontSize: 16, fontWeight: "700", marginTop: 4, color: "#000" },
  form: { marginTop: 1 },
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#000" },
  email: { fontSize: 14, color: "#666" },
  label: { fontSize: 14, fontWeight: "500", marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 6 },
  subLabel: { fontSize: 14, marginBottom: 12, color: "#555" },
  highlight: { color: "red", fontWeight: "600" },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  optionTitle: { marginLeft: 8, fontSize: 14, fontWeight: "600", color: "#000" },
  cellActive: {
    backgroundColor: "#eaf2ff",
    borderColor: "#007bff",
  },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#ddd" },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  infoContainer: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 16,
  },
  letterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  selectBtn: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});