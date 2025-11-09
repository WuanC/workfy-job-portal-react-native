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




  // const richAboutCompany = useRef<RichEditor>(null);
  // useEffect(() => {
  //   if (richAboutCompany.current && aboutCompany) {
  //     richAboutCompany.current.setContentHTML(aboutCompany);
  //   }
  // }, [aboutCompany]);
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
    try {
      const payload = {
        companyName,
        companySize: companySize, // giá trị enum như "FROM_100_TO_499"
        contactPerson,
        phoneNumber: contactPhone,
        provinceId: provinceId ?? -1,
        districtId: districtId ?? -1,
        detailAddress: detailAddress,
        aboutCompany: aboutCompany || "",

      };
      await updateEmployerProfile(payload);
      navigation.goBack();
    } catch (error) {
      const { ToastService } = require("../../services/toastService");
      ToastService.error("Lỗi", "Cập nhật thông tin công ty thất bại.");
    }
    finally {

    }
  };

  const handleCancel = () => {
    navigation.goBack();
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
    <View style={{ flex: 1, backgroundColor: "#f8fafcs" }}>
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
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  iconButton: { padding: 8, borderRadius: 8, zIndex: 100 },
  headerTitle: {
    position: "absolute",
    left: 40, // 👈 đẩy sang phải để tránh icon Back
    right: 40,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#075985",
    paddingLeft: 10, // 👈 thêm khoảng cách nhẹ bên trái // ❌ không dùng trong StyleSheet (đưa vào component)
  },
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", color: "#075985", marginVertical: 5, paddingHorizontal: 10 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 14, color: "#000000ff", paddingHorizontal: 10 },
  required: { color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 10,
    marginVertical: 6,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#333",
    elevation: 1,
    height: 50,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 6,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
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
    backgroundColor: "#0284c7",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  updateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  placeholder: { color: "#999" },
  selectedText: {
    color: "#333",
    fontSize: 15,
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
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 10,
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




export default UpdateCompanyInfo;
