import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import Checkbox from "expo-checkbox";
import RNPickerSelect from "react-native-picker-select";
import { useEffect, useState } from "react";
import { registerEmployer } from "../../services/authService"; // ✅ đổi import
import apiInstance from "../../api/apiInstance";
import { Ionicons } from "@expo/vector-icons";
import { getAllProvince, Province } from "../../services/provinceService";
import { District, getDistrictsByProvince } from "../../services/districtService";
import { Dropdown } from "react-native-element-dropdown";
import { getEnumOptions, LevelCompanySize } from "../../utilities/constant";


const EmployerRegisterScreen = ({ navigation }: any) => {

    const [listProvinces, setListProvinces] = useState<Province[]>([])
    const [listDistricts, setListDistricts] = useState<District[]>([])

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [phone, setPhone] = useState("");
    const [country] = useState("Việt Nam");
    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [address, setAddress] = useState("");
    const [receiveJobNews, setReceiveJobNews] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false; // flag để tránh setState sau unmount

        const load = async () => {
            try {
                const listProvinces = await getAllProvince(); // gọi service bạn đã viết
                if (cancelled) return;

                setListProvinces(listProvinces)
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





    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !companyName) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin cần thiết.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            setLoading(true);

            await registerEmployer({
                email,
                password,
                companyName,
                companySize: companySize,
                contactPerson,
                phoneNumber: phone,
                provinceId: provinceId ? Number(provinceId) : 0,
                districtId: districtId ? Number(districtId) : 0,
                detailAddress: address || undefined,
            });
            console.log(email);
            Alert.alert("Thành công", "Đăng ký nhà tuyển dụng thành công!");
            navigation.replace("ConfirmEmail", { email: email });
        } catch (err: any) {
            Alert.alert("Đăng ký thất bại", err.message || "Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
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
                            Nhà tuyển dụng đăng ký
                        </Text>
                        <View style={{ width: 38 }} />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Thông tài khoản</Text>
                        {/* Email */}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        {/* Password */}
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        {/* Confirm Password */}
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập lại mật khẩu"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <Text style={styles.sectionTitle}>Thông tin công ty</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Tên công ty"
                            value={companyName}
                            onChangeText={setCompanyName}
                        />

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
                        <TextInput
                            style={[styles.input]}
                            placeholder="Người liên hệ"
                            value={contactPerson}
                            onChangeText={setContactPerson}
                        />
                        <TextInput
                            style={[styles.input]}
                            placeholder="Điện thoại"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                        <Text style={styles.sectionTitle}>Địa chỉ</Text>

                        <TextInput style={styles.input} value={country} editable={false} />

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
                        <Dropdown
                            data={listDistricts}
                            labelField="name"
                            valueField="id"
                            placeholder="Chọn Quận / Huyện"
                            value={districtId}
                            onChange={(item) => {
                                setDistrictId(item.id)
                            }}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                        />


                        <TextInput
                            style={styles.input}
                            placeholder="Số nhà, phường, xã"
                            value={address}
                            onChangeText={setAddress}
                        />

                        {/* <View style={styles.checkboxRow}>
                    <Checkbox
                        value={receiveJobNews}
                        onValueChange={setReceiveJobNews}
                        color={receiveJobNews ? "#1976d2" : undefined}
                        style={styles.checkbox}
                    />
                    <Text style={styles.checkboxText}>Nhận bản tin việc làm</Text>
                </View> */}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.bottomLinks}>
                        <TouchableOpacity onPress={() => navigation.navigate("EmployerLogin")}>
                            <Text style={styles.linkText}>
                                Đã có tài khoản?{" "}
                                <Text style={styles.linkHighlight}>Đăng nhập</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>


                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
        backgroundColor: "#f8fafc",
    },
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
    card: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 20,
        borderRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        alignSelf: "flex-start",
        marginTop: 10,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 50,
        width: "100%",
        marginVertical: 6,
        fontSize: 15,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        height: 50,
        width: "100%",
        justifyContent: "center",
        marginVertical: 6,
        paddingHorizontal: 10,
    },
    row: { flexDirection: "row", width: "100%" },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginVertical: 8,
    },
    checkbox: { marginRight: 8 },
    checkboxText: { color: "#555" },
    button: {
        backgroundColor: "#1976d2",
        paddingVertical: 16,
        marginHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    bottomLinks: { marginTop: 20, alignItems: "center" },
    linkText: { color: "#555", fontSize: 14 },
    linkHighlight: { color: "#1976d2", fontWeight: "bold" },
    placeholder: {
        color: "#999",
        fontSize: 15,
    },
    selectedText: {
        color: "#333",
        fontSize: 15,
        fontWeight: "500",
    },
});


export default EmployerRegisterScreen;
