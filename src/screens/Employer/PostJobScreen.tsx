import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { useNavigation } from "@react-navigation/native";

const CompanyInfoScreen = () => {
  const navigation = useNavigation();
  // --- Thông tin công ty ---
  const [companyName, setCompanyName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [website, setWebsite] = useState("");
  const [overview, setOverview] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  // --- Thông tin công việc ---
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  // --- Chi tiết công việc ---
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [position, setPosition] = useState("");
  const [jobType, setJobType] = useState("");
  const [gender, setGender] = useState("");
  const [industry, setIndustry] = useState("");
  const [age, setAge] = useState("");

  // --- Phân công thành viên ---
  const [assignedMember, setAssignedMember] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");

  // --- Ngày đăng ---
  const [postDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // --- Ngôn ngữ ứng viên ---
  const [language, setLanguage] = useState("");

  // --- Editor ---
  const [jobDesc, setJobDesc] = useState("");
  const [jobReq, setJobReq] = useState("");
  const richDesc = useRef<RichEditor>(null);
  const richReq = useRef<RichEditor>(null);

  // --- Hàm chọn logo ---
  const pickLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Vui lòng cho phép truy cập thư viện ảnh.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setLogo(result.assets[0].uri);
    }
  };

  // --- Hàm submit ---
  const handleSubmit = () => {
    if (!companyName || !employeeCount || !jobTitle || !location) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường bắt buộc (*)");
      return;
    }
    Alert.alert("🎉 Thành công", "Công việc đã được đăng!");
  };

  // --- Xử lý chọn ngày hết hạn ---
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    setExpiryDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000000ff"  onPress={() =>  navigation.goBack()}/>
        <Text style={styles.headerTitle}>Đăng tin tuyển dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- THÔNG TIN CÔNG TY ---------- */}
        <Text style={styles.title}>Thông tin công ty</Text>

        <Text style={styles.label}>
          Tên công ty<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="VD: NPT Software"
          value={companyName}
          onChangeText={setCompanyName}
        />

        <Text style={styles.label}>
          Số nhân viên<Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={employeeCount} onValueChange={setEmployeeCount}>
            <Picker.Item label="Chọn số nhân viên" value="" />
            <Picker.Item label="1 - 49" value="1-49" />
            <Picker.Item label="100 - 499" value="100-499" />
            <Picker.Item label="500 - 999" value="500-999" />
            <Picker.Item label="Trên 1000" value="1000+" />
          </Picker>
        </View>

        <Text style={styles.label}>Website công ty</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: https://nptsoftware.vn"
          value={website}
          onChangeText={setWebsite}
        />

        <Text style={styles.label}>
          Sơ lược công ty<Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.richContainer}>
          <RichToolbar
            editor={richDesc}
            actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList]}
            style={styles.toolbar}
          />
          <RichEditor
            ref={richDesc}
            placeholder="Giới thiệu ngắn gọn về công ty..."
            style={styles.richEditor}
            initialHeight={150}
            onChange={setOverview}
          />
        </View>

        {/* ---------- THÔNG TIN CÔNG VIỆC ---------- */}
        <Text style={styles.title}>Thông tin công việc</Text>

        <Text style={styles.label}>
          Tên công việc<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="VD: Lập trình viên React Native"
          value={jobTitle}
          onChangeText={setJobTitle}
        />

        <Text style={styles.label}>
          Địa điểm<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="VD: Hà Nội, TP.HCM..."
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>
          Lương<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="VD: 20 - 30 triệu"
          value={salary}
          onChangeText={setSalary}
        />

        {/* ---------- PHÂN CÔNG THÀNH VIÊN ---------- */}
        <Text style={styles.title}>Phân công thành viên</Text>

        <Text style={styles.label}>Thành viên được phân công</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={assignedMember} onValueChange={setAssignedMember}>
            <Picker.Item label="Chọn thành viên" value="" />
            <Picker.Item label="Nguyễn Văn A" value="a" />
            <Picker.Item label="Trần Thị B" value="b" />
            <Picker.Item label="Lê Văn C" value="c" />
          </Picker>
        </View>

        <Text style={styles.label}>Thêm email nhận thông báo</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: notify@nptsoftware.vn"
          value={notifyEmail}
          onChangeText={setNotifyEmail}
        />

        {/* ---------- NGÀY ĐĂNG ---------- */}
        <Text style={styles.title}>Ngày đăng</Text>
        <Text style={styles.label}>
          Ngày đăng<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={postDate.toLocaleDateString("vi-VN")}
          editable={false}
        />

        <Text style={styles.label}>
          Ngày hết hạn<Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text>{expiryDate.toLocaleDateString("vi-VN")}</Text>
        </TouchableOpacity>

        {/* --- Modal chọn ngày --- */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={expiryDate}
        />

        {/* ---------- NGÔN NGỮ HỒ SƠ ỨNG VIÊN ---------- */}
        <Text style={styles.title}>Ngôn ngữ nhận hồ sơ ứng viên</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={language} onValueChange={setLanguage}>
            <Picker.Item label="Vui lòng chọn" value="" />
            <Picker.Item label="Tiếng Việt" value="vi" />
            <Picker.Item label="Tiếng Anh" value="en" />
            <Picker.Item label="Song ngữ Việt - Anh" value="both" />
          </Picker>
        </View>

        {/* ---------- NÚT SUBMIT ---------- */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Đã lưu nháp!")}>
            <Text style={styles.saveText}>Lưu việc làm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Đăng công việc</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CompanyInfoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#000000ff", fontSize: 18, fontWeight: "bold" },
  title: { fontSize: 20, fontWeight: "700", color: "#1a73e8", marginVertical: 16, paddingHorizontal: 16 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 14, color: "#333", paddingHorizontal: 16 },
  required: { color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 6,
    overflow: "hidden",
  },
  richContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  toolbar: { borderBottomWidth: 1, borderColor: "#ddd", backgroundColor: "#f5f5f5" },
  richEditor: { padding: 10, minHeight: 150, backgroundColor: "#fff" },
  submitBtn: {
    backgroundColor: "#1a73e8",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
    marginHorizontal: 1,
    flex: 1.5,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    backgroundColor: "#faf5f5ff",
  },
  saveBtn: {
    borderWidth: 1.5,
    borderColor: "#1a73e8",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    flex: 1,
  },
  saveText: {
    color: "#1a73e8",
    fontWeight: "600",
    fontSize: 16,
  },

});
