import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getEmployerById, getEmployerProfile, updateEmployerProfile } from "../../services/employerService";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { getAllProvince, Province } from "../../services/provinceService";
import { District, getDistrictsByProvince } from "../../services/districtService";
import { Dropdown } from "react-native-element-dropdown";
import { getEnumOptions, LevelCompanySize } from "../../utilities/constant";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import { colors } from "../../theme";
import { validateField } from "../../utilities/validation";

const UpdateCompanyInfo = ({ route }: any) => {
  const { id } = route.params as { id: number };
  const navigation = useNavigation();

  const richAbout = useRef<RichEditor>(null);


  const [isEditorReady, setIsEditorReady] = useState(false);
  const isInitialLoad = useRef(true);
  const [listProvinces, setListProvinces] = useState<Province[]>([])
  const [listDistricts, setListDistricts] = useState<District[]>([])

  const [companyName, setCompanyName] = useState("NPT Software");
  const [companySize, setCompanySize] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");

  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [detailAddress, setDetailAddress] = useState("");


  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");


  useEffect(() => {
    let cancelled = false; // flag để tránh setState sau unmount

    const load = async () => {
      try {
        const info = await getEmployerProfile();
        const listProvinces = await getAllProvince(); // gọi service bạn đã viết
        if (cancelled) return;

        setListProvinces(listProvinces)

        setCompanyName(info.companyName || "");
        setCompanySize(info.companySize || "");
        setAboutCompany(info.aboutCompany || "");

        setProvinceId(info.province?.id || null)
        setDistrictId(info.district?.id || null)
        setDetailAddress(info.detailAddress || "")
        // --- Địa chỉ làm việc ---


        // --- Liên hệ ---
        setContactPerson(info.contactPerson || "");
        setContactPhone(info.phoneNumber || "");
        setEmail(info.email || "");



      } catch (err: any) {
        if (cancelled) return;
        console.error("Lỗi load", err);
      } finally {
        if (!cancelled) { }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (provinceId) {
      (async () => {
        try {
          const data = await getDistrictsByProvince(provinceId);
          setListDistricts(data)
        } catch (error) {
          console.error("Lỗi khi lấy quận/huyện:", error);
          setListDistricts([])
        } finally {

        }
      })();
    } else {
      setListDistricts([])
    }
  }, [provinceId]);

  const handleUpdate = async () => {
    // validate fields using shared validator
    const { ToastService } = require("../../services/toastService");

    if (!companyName || !companyName.trim()) {
      ToastService.warning("Thiếu thông tin", "Vui lòng nhập tên công ty");
      return;
    }

    if (!contactPerson || !contactPerson.trim()) {
      ToastService.warning("Thiếu thông tin", "Vui lòng nhập tên người liên hệ");
      return;
    }

    // validate phone
    const phoneError = validateField(contactPhone || "", "phone");
    if (phoneError) {
      ToastService.warning("Sai định dạng", phoneError);
      return;
    }

    // validate email if provided
    if (email && email.trim()) {
      const emailError = validateField(email, "email");
      if (emailError) {
        ToastService.warning("Sai định dạng", emailError);
        return;
      }
    }

    try {
      const payload = {
        companyName,
        companySize: companySize,
        contactPerson,
        phoneNumber: contactPhone,
        provinceId: provinceId ?? -1,
        districtId: districtId ?? -1,
        detailAddress: detailAddress,
        aboutCompany: aboutCompany || "",
      };

      await updateEmployerProfile(payload);
      ToastService.success("Thành công", "Cập nhật thông tin công ty thành công");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Cập nhật lỗi:", error);
      ToastService.error("Lỗi", "Cập nhật thông tin công ty thất bại.");
    }
  };

  useEffect(() => {
    if (isEditorReady && aboutCompany && isInitialLoad.current) {
      richAbout.current?.setContentHTML(aboutCompany);
      isInitialLoad.current = false;
    }
  }, [isEditorReady, aboutCompany]);


  const handleEditorReady = () => {
    setIsEditorReady(true);
  };
  return (
    <KeyboardAvoidingWrapper>
      <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Cập nhật thông tin công ty
          </Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.title}>Thông tin công ty</Text>

          {/* Tên công ty */}
          <Text style={styles.label}>Tên công ty *</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Nhập tên công ty"
          />

          {/* Số nhân viên */}
          <Text style={styles.label}>
            Số nhân viên<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={getEnumOptions(LevelCompanySize)}
            labelField="label"
            valueField="value"
            placeholder="Chọn số nhân viên"
            value={companySize}
            onChange={(item) => setCompanySize(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />
          {/* <Text style={{ fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 6 }}>
          Sơ lược công ty<Text style={{ color: "red" }}> *</Text>
        </Text> */}
          <Text style={styles.label}>
            Sơ lược công ty<Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.editorWrapper}>
            <RichToolbar
              editor={richAbout}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.alignFull,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.undo,
                actions.redo,
              ]}
              iconTint="#555"
              selectedIconTint="#007AFF"
              selectedButtonStyle={{ backgroundColor: "#EAF2FF", borderRadius: 6 }}
              style={styles.toolbar}
              iconSize={18}
            />

            <RichEditor
              ref={richAbout}
              style={styles.editor}
              placeholder="Nhập yêu cầu công việc..."
              initialHeight={180}
              editorInitializedCallback={() => handleEditorReady()}
              onChange={(html) => setAboutCompany(html)}
            />
          </View>
          {/* Địa chỉ liên hệ */}
          <Text style={styles.label}>
            Địa điểm<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={listProvinces}
            labelField="name"
            valueField="id"
            placeholder="Chọn Tỉnh / Thành phố"
            value={provinceId}
            onChange={(item) => {
              setProvinceId(item.id)
            }}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          {/* --- Quận / Huyện --- */}
          <Dropdown
            data={listDistricts}
            labelField="name"
            valueField="id"
            placeholder="Chọn Quận / Huyện"
            value={districtId}
            onChange={(item) => {
              console.log(item.id)
              setDistrictId(item.id)
            }}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          {/* --- Số nhà / Địa chỉ chi tiết --- */}
          <TextInput
            style={styles.input}
            placeholder="VD: 123 Nguyễn Trãi, Phường 5"
            value={detailAddress}
            onChangeText={setDetailAddress}
          />



          <Text style={styles.label}>Email liên hệ *</Text>
          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Tên người liên hệ *</Text>
          <TextInput style={styles.input} value={contactPerson} onChangeText={setContactPerson} />

          <Text style={styles.label}>Điện thoại liên hệ</Text>
          <TextInput
            style={styles.input}
            value={contactPhone}
            keyboardType="phone-pad"
            onChangeText={setContactPhone}
          />

          {/* Nút */}

        </ScrollView>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  iconButton: { padding: 8, borderRadius: 999, backgroundColor: "#f3f4f6", zIndex: 100 },
  headerTitle: {
    position: "absolute",
    left: 40, // 👈 đẩy sang phải để tránh icon Back
    right: 40,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    paddingLeft: 10, // 👈 thêm khoảng cách nhẹ bên trái // ❌ không dùng trong StyleSheet (đưa vào component)
  },
  container: { flex: 1, backgroundColor: "#ffffff" },
  title: { fontSize: 20, fontWeight: "600", color: "#1f2937", marginVertical: 8, paddingHorizontal: 16 },
  label: { fontSize: 14, fontWeight: "500", marginTop: 16, color: "#374151", paddingHorizontal: 16 },
  required: { color: "#ef4444" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    height: 52,
  },
  dropdown: {
    height: 52,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  cancelText: { color: "#333", fontWeight: "500" },
  updateButton: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: colors.primary.start,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  updateText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  placeholder: { color: "#9ca3af" },
  selectedText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "500",
  },
  textAreaContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 8,
    minHeight: 150,
    marginHorizontal: 5,
    marginTop: 6,
    elevation: 1, // đổ bóng nhẹ cho Android
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  textArea: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 22,
    padding: 8,
  },
  editorWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  toolbar: {
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 48,
  },
  editor: {
    minHeight: 200,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
});




export default UpdateCompanyInfo;