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




  const richAboutCompany = useRef<RichEditor>(null);
  useEffect(() => {
    if (richAboutCompany.current && aboutCompany) {
      richAboutCompany.current.setContentHTML(aboutCompany);
    }
  }, [aboutCompany]);
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
      Alert.alert("Lỗi", "Cập nhật thông tin công ty thất bại.");
    }
    finally {

    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật thông tin công ty</Text>
        <View style={{ width: 40 }} />
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
        <Text style={{ fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 6 }}>
          Sơ lược công ty<Text style={{ color: "red" }}> *</Text>
        </Text>

        {/* Thanh công cụ giả (Bold, Italic, Bullet) */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#eef3ff",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#c6d4f0",
            borderBottomWidth: 0,
          }}
        >
          <TouchableOpacity style={{ marginRight: 14 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#084C9E" }}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: 14 }}>
            <Text style={{ fontStyle: "italic", fontSize: 16, color: "#084C9E" }}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ fontSize: 16, color: "#084C9E" }}>•</Text>
          </TouchableOpacity>
        </View>

        {/* Ô nhập nội dung */}
        <View
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#c6d4f0",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 8,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
          }}
        >
          <TextInput
            placeholder="Giới thiệu ngắn gọn về công ty..."
            value={aboutCompany}
            onChangeText={setAboutCompany}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={{
              fontSize: 15,
              color: "#333",
              minHeight: 120,
              lineHeight: 22,
            }}
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
        <Text style={styles.note}>
          *Thông tin bạn điền vào bên dưới sẽ được sử dụng làm liên hệ mặc định cho mỗi mục công việc.
        </Text>



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
    backgroundColor: "#ffffffff",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    borderWidth: 0.5,

  },
  backButton: { padding: 8 },
  headerTitle: { color: "#000000ff", fontSize: 18, fontWeight: "600" },
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#222" },
  label: { fontSize: 14, color: "#333", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginTop: 5,
    fontSize: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginTop: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  note: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
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
  placeholder: { color: "#999" },
  richContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 1,
  },
  toolbar: { borderBottomWidth: 1, borderColor: "#ddd", backgroundColor: "#f5f5f5" },
  richEditor: { padding: 10, minHeight: 150, backgroundColor: "#fff" },
  required: { color: "red" },
  selectedText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
  },
});




export default UpdateCompanyInfo;
