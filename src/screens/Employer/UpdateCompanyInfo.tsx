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
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getEmployerById, getEmployerProfile, updateEmployerProfile } from "../../services/employerService";
import apiInstance from "../../api/apiInstance";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const UpdateCompanyInfo = ({ route }: any) => {
  const { id } = route.params as { id: number };
  const navigation = useNavigation();

  const [companyName, setCompanyName] = useState("NPT Software");
  const [employeeCount, setEmployeeCount] = useState("");
  const [province, setProvince] = useState<Number>();
  const [district, setDistrict] = useState<Number>();
  const [address, setAddress] = useState("34 Trần Hưng Đạo");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("a@gmail.com");
  const [contactPerson, setContactPerson] = useState("Lê Hữu Nam");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");

  const [provinces, setProvinces] = useState<{ label: string; value: string; id: number }[]>([]);
  const [districts, setDistricts] = useState<{ label: string; value: string }[]>([]);
  interface Province {
    id: number;
    code: string;
    name: string;
    engName: string;
  }

  interface District {
    id: number;
    code: string;
    name: string;
  }
  interface ProvincePicker {

  }
  const richDesc = useRef<RichEditor>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provinceRes, employerData] = await Promise.all([
          apiInstance.get("/provinces"),
          getEmployerProfile(),
        ]);

        // --- provinces ---
        if (provinceRes.data?.data) {
          const provinceList = provinceRes.data.data.map((item: Province) => ({
            label: item.name,
            value: item.id,
            id: item.id,
          }));
          setProvinces(provinceList);
        }

        // --- company info ---
        setCompanyName(employerData.companyName || "");
        setEmployeeCount(employerData.companySize || "");
        setProvince(employerData.province?.id || "");
        setAddress(employerData.detailAddress || "");
        setContactPhone(employerData.phoneNumber || "");
        setEmail(employerData.email || "");
        setContactPerson(employerData.contactPerson || "");
        setDescription(employerData.aboutCompany || "");

        // --- districts ---
        if (employerData.province?.id) {
          const res = await apiInstance.get(`/districts/province/${employerData.province.id}`);
          if (res.data?.data) {
            const districtList = res.data.data.map((d: District) => ({
              label: d.name,
              value: d.id,
              id: d.id,
            }));
            setDistricts(districtList);
            setDistrict(employerData.district?.id || "");
          }
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải thông tin công ty");
      }
    };

    fetchData();
  }, [id]);

  const handleSelectProvince = async (provinceId: Number) => {
    setProvince(provinceId);
    setDistrict(-1);
    setDistricts([]);

    if (!provinceId) return;

    try {
      //setLoadingDistrict(true);
      const res = await apiInstance.get(`/districts/province/${provinceId}`);
      if (res.data?.data) {
        const districtList = res.data.data.map((d: District) => ({
          label: d.name,
          value: d.id,
          id: d.id,
        }));
        setDistricts(districtList);
      }
    } catch (err: any) {
      console.error("Lỗi lấy quận/huyện:", err.message);
      Alert.alert("Lỗi", "Không thể tải danh sách quận/huyện.");
    } finally {
      //setLoadingDistrict(false);
    }
  };
  const handleUpdate = async () => {
    try {
      const payload = {
        companyName,
        companySize: employeeCount, // giá trị enum như "FROM_100_TO_499"
        contactPerson,
        phoneNumber: contactPhone,
        provinceId: province ? Number(province) : 0,
        districtId: district ? Number(district) : 0,
        detailAddress: address,
        aboutCompany: description || "",

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
          <Ionicons name="arrow-back" size={24} color="#fff" />
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
        <Text style={styles.label}>Số lượng nhân viên *</Text>
        <View style={styles.dropdown}>
          <RNPickerSelect
            onValueChange={setEmployeeCount}
            items={[
              { label: "Dưới 10", value: "LESS_THAN_10" },
              { label: "10 - 24", value: "FROM_10_TO_24" },
              { label: "25 - 99", value: "FROM_25_TO_99" },
              { label: "100 - 499", value: "FROM_100_TO_499" },
              { label: "500 - 999", value: "FROM_500_TO_999" },
              { label: "1.000 - 1.999", value: "FROM_1000_TO_1999" },
              { label: "2.000 - 4.999", value: "FROM_2000_TO_4999" },
              { label: "5.000 - 9.999", value: "FROM_5000_TO_9999" },
              { label: "10.000 - 19.999", value: "FROM_10000_TO_19999" },
              { label: "20.000 - 49.999", value: "FROM_20000_TO_49999" },
              { label: "Trên 50.000", value: "MORE_THAN_50000" },
            ]}
            value={employeeCount}
            placeholder={{ label: "Chọn số lượng nhân viên", value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />
        </View>
        <Text style={styles.label}>
          Sơ lược công ty<Text style={styles.label}>*</Text>
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
            initialContentHTML={description}
            initialHeight={150}
            onChange={setDescription}
          />
        </View>
        {/* Địa chỉ liên hệ */}
        <Text style={styles.label}>Địa chỉ liên hệ *</Text>
        <View style={styles.row}>
          <View style={[styles.dropdown, { flex: 1, marginRight: 5 }]}>
            <RNPickerSelect
              onValueChange={handleSelectProvince}
              items={provinces}
              value={province}
              placeholder={{ label: "Chọn tỉnh/thành", value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <View style={[styles.dropdown, { flex: 1, marginLeft: 5 }]}>
            <RNPickerSelect
              onValueChange={(value, index) => {
                setDistrict(value)

              }}
              items={districts}
              value={district}
              placeholder={{ label: "Chọn quận/huyện", value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>

        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Nhập địa chỉ liên hệ"
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
    backgroundColor: "#9fbbdaff",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  backButton: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    color: "#333",
    paddingVertical: 12,
  },
  inputAndroid: {
    fontSize: 15,
    color: "#333",
    paddingVertical: 10,
  },

});

export default UpdateCompanyInfo;
