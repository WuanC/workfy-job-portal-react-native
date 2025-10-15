import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import Checkbox from "expo-checkbox";
import RNPickerSelect from "react-native-picker-select";
import { useEffect, useState } from "react";
import { registerEmployer } from "../../services/authService"; // ✅ đổi import
import apiInstance from "../../api/apiInstance";

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

const EmployerRegisterScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [employeeCount, setEmployeeCount] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [phone, setPhone] = useState("");
    const [country] = useState("Việt Nam");
    const [province, setProvince] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [address, setAddress] = useState("");
    const [receiveJobNews, setReceiveJobNews] = useState(true);
    const [loading, setLoading] = useState(false);

    const [provinces, setProvinces] = useState<{ label: string; value: string; id: number }[]>([]);
    const [districts, setDistricts] = useState<{ label: string; value: string }[]>([]);
    const [loadingProvince, setLoadingProvince] = useState(true);
    const [loadingDistrict, setLoadingDistrict] = useState(false);

    // 🧭 Lấy danh sách tỉnh thành
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await apiInstance.get("/provinces");
                if (res.data?.data) {
                    const provinceList = res.data.data.map((item: Province) => ({
                        label: item.name,
                        value: item.id.toString(),
                        id: item.id,
                    }));
                    setProvinces(provinceList);
                }
            } catch (err: any) {
                console.error("Lỗi lấy tỉnh thành:", err.message);
                Alert.alert("Lỗi", "Không thể tải danh sách tỉnh thành.");
            } finally {
                setLoadingProvince(false);
            }
        };
        fetchProvinces();
    }, []);

    const handleSelectProvince = async (provinceId: string | null) => {
        setProvince(provinceId);
        setDistrict(null);
        setDistricts([]);

        if (!provinceId) return;

        try {
            setLoadingDistrict(true);
            const res = await apiInstance.get(`/districts/province/${provinceId}`);
            if (res.data?.data) {
                const districtList = res.data.data.map((d: District) => ({
                    label: d.name,
                    value: d.code,
                }));
                setDistricts(districtList);
            }
        } catch (err: any) {
            console.error("Lỗi lấy quận/huyện:", err.message);
            Alert.alert("Lỗi", "Không thể tải danh sách quận/huyện.");
        } finally {
            setLoadingDistrict(false);
        }
    };

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

            // ✅ Gọi API đúng theo backend yêu cầu
            await registerEmployer({
                email,
                password,
                companyName,
                companySize: employeeCount,
                contactPerson,
                phoneNumber: phone,
                provinceId: province ? Number(province) : 0,
                districtId: district ? Number(district) : 0,
                detailAddress: address || undefined,
            });

            Alert.alert("Thành công", "Đăng ký nhà tuyển dụng thành công!");
            navigation.replace("ConfirmEmail");
        } catch (err: any) {
            Alert.alert("Đăng ký thất bại", err.message || "Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Nhà tuyển dụng đăng ký</Text>
            <Text style={styles.subtitle}>
                Tạo tài khoản để tiếp cận kho ứng viên chất lượng và bắt đầu đăng việc ngay
            </Text>

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

            <View style={styles.dropdown}>
                <RNPickerSelect
                    onValueChange={setEmployeeCount}
                    items={[
                        { label: "Dưới 10 nhân viên", value: "LESS_THAN_10" },
                        { label: "10 - 24 nhân viên", value: "FROM_10_TO_24" },
                        { label: "25 - 99 nhân viên", value: "FROM_25_TO_99" },
                        { label: "100 - 499 nhân viên", value: "FROM_100_TO_499" },
                        { label: "500 - 999 nhân viên", value: "FROM_500_TO_999" },
                        { label: "1000 - 4999 nhân viên", value: "FROM_1000_TO_4999" },
                        { label: "5000 - 9999 nhân viên", value: "FROM_5000_TO_9999" },
                        { label: "10000 - 19999 nhân viên", value: "FROM_10000_TO_19999" },
                        { label: "20000 - 49999 nhân viên", value: "FROM_20000_TO_49999" },
                        { label: "Trên 50000 nhân viên", value: "MORE_THAN_50000" },
                    ]}
                    placeholder={{ label: "Chọn quy mô công ty", value: null }}
                    value={employeeCount}
                    style={pickerSelectStyles}
                />
            </View>

            <View style={styles.row}>
                <TextInput
                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                    placeholder="Người liên hệ"
                    value={contactPerson}
                    onChangeText={setContactPerson}
                />
                <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 5 }]}
                    placeholder="Điện thoại"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            <Text style={styles.sectionTitle}>Địa chỉ</Text>

            <TextInput style={styles.input} value={country} editable={false} />

            <View style={styles.dropdown}>
                {loadingProvince ? (
                    <ActivityIndicator size="small" color="#1976d2" />
                ) : (
                    <RNPickerSelect
                        onValueChange={handleSelectProvince}
                        items={provinces}
                        placeholder={{ label: "Chọn tỉnh / thành", value: null }}
                        value={province}
                        style={pickerSelectStyles}
                    />
                )}
            </View>

            <View style={styles.dropdown}>
                {loadingDistrict ? (
                    <ActivityIndicator size="small" color="#1976d2" />
                ) : (
                    <RNPickerSelect
                        onValueChange={setDistrict}
                        items={districts}
                        placeholder={{ label: "Chọn quận / huyện", value: null }}
                        value={district}
                        style={pickerSelectStyles}
                        disabled={!province}
                    />
                )}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Số nhà, phường, xã"
                value={address}
                onChangeText={setAddress}
            />

            <View style={styles.checkboxRow}>
                <Checkbox
                    value={receiveJobNews}
                    onValueChange={setReceiveJobNews}
                    color={receiveJobNews ? "#1976d2" : undefined}
                    style={styles.checkbox}
                />
                <Text style={styles.checkboxText}>Nhận bản tin việc làm</Text>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 5 },
    subtitle: { color: "#555", fontSize: 14, textAlign: "center", marginBottom: 15 },
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
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    bottomLinks: { marginTop: 20, alignItems: "center" },
    linkText: { color: "#555", fontSize: 14 },
    linkHighlight: { color: "#1976d2", fontWeight: "bold" },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 15,
        color: "#333",
    },
    inputAndroid: {
        fontSize: 15,
        color: "#333",
    },
});

export default EmployerRegisterScreen;
