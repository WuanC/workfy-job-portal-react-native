import React, { useState } from "react";
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

const UpdateCompanyInfo = () => {
  const navigation = useNavigation();

  const [companyName, setCompanyName] = useState("NPT Software");
  const [employeeCount, setEmployeeCount] = useState("10 - 24");
  const [province, setProvince] = useState("Bình Thuận");
  const [city, setCity] = useState("Thành phố Phan Thiết");
  const [address, setAddress] = useState("34 Trần Hưng Đạo");
  const [contactName, setContactName] = useState("AB");
  const [phone, setPhone] = useState("0827555534");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("a@gmail.com");
  const [representative, setRepresentative] = useState("Lê Hữu Nam");
  const [contactPhone, setContactPhone] = useState("");

  const handleUpdate = () => {
    Alert.alert("✅ Thành công", "Thông tin công ty đã được cập nhật!");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffffff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhậ thông tin công ty</Text>
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
              { label: "1 - 9", value: "1 - 9" },
              { label: "10 - 24", value: "10 - 24" },
              { label: "25 - 50", value: "25 - 50" },
              { label: "51 - 150", value: "51 - 150" },
              { label: "150+", value: "150+" },
            ]}
            value={employeeCount}
            placeholder={{ label: "Chọn số lượng nhân viên", value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />
        </View>

        {/* Địa chỉ liên hệ */}
        <Text style={styles.label}>Địa chỉ liên hệ *</Text>
        <View style={styles.row}>
          <View style={[styles.dropdown, { flex: 1, marginRight: 5 }]}>
            <RNPickerSelect
              onValueChange={setProvince}
              items={[
                { label: "Bình Thuận", value: "Bình Thuận" },
                { label: "Hà Nội", value: "Hà Nội" },
                { label: "TP. Hồ Chí Minh", value: "TP. Hồ Chí Minh" },
              ]}
              value={province}
              placeholder={{ label: "Chọn tỉnh/thành", value: null }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </View>
          <View style={[styles.dropdown, { flex: 1, marginLeft: 5 }]}>
            <RNPickerSelect
              onValueChange={setCity}
              items={[
                { label: "Thành phố Phan Thiết", value: "Thành phố Phan Thiết" },
                { label: "Quận 1", value: "Quận 1" },
                { label: "Quận 3", value: "Quận 3" },
              ]}
              value={city}
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

        {/* Thông tin liên hệ */}
        <Text style={styles.label}>Tên liên hệ</Text>
        <TextInput style={styles.input} value={contactName} onChangeText={setContactName} />

        <Text style={styles.label}>Điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Fax</Text>
        <TextInput style={styles.input} value={fax} onChangeText={setFax} />

        <Text style={styles.label}>Email liên hệ *</Text>
        <TextInput
          style={styles.input}
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Tên người liên hệ *</Text>
        <TextInput style={styles.input} value={representative} onChangeText={setRepresentative} />

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
    backgroundColor: "#000000ff",
    paddingTop: 50,
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
  placeholder: { color: "#999" },
});

export default UpdateCompanyInfo;
