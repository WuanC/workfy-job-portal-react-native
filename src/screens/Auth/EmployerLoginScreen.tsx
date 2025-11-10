import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LOGO_IMG } from "../../utilities/constant";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { loginEmployer } from "../../services/authService";

type MainNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login" |
    "Register" | "MainAppEmployer" | "ConfirmEmail" | "ForgotPassword"
>;

const EmployerLoginScreen = () => {
    const { loginEmployerAuth } = useAuth();
    const [isChecked, setChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<MainNavigationProp>();

    const handleLogin = async () => {
        if (!email || !password) {
            const { ToastService } = require("../../services/toastService");
            ToastService.error('Lỗi', 'Vui lòng nhập email và mật khẩu');
            return;
        }
        try {
            await loginEmployerAuth(email, password);

            navigation.replace("MainAppEmployer");


        }
        catch (error: any) {
            const { ToastService } = require("../../services/toastService");
            ToastService.error('Lỗi', error.message || 'Đăng nhập thất bại');
            console.error(error);
        } finally {
            //setLoading(false);
        }

    };

    return (
        <View style={styles.container}>
            <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Đăng nhập doanh nghiệp</Text>

            {/* Email input */}
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder="Nhập email của bạn"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder="Nhập mật khẩu"
                    secureTextEntry={true}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />
                <MaterialIcons name="visibility" size={22} color="#888" style={styles.iconRight} />
            </View>

            {/* Remember & Forgot */}
            <View style={styles.row}>
                <View style={styles.rememberContainer}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? "#2563EB" : undefined}
                        style={styles.checkbox}
                    />
                    <Text style={styles.remember}>Ghi nhớ đăng nhập</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword", { isEmployee: false })}>
                    <Text style={styles.forgot}>Quên mật khẩu?</Text>
                </TouchableOpacity>
            </View>

            {/* Sign in button */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.or}>hoặc</Text>
                <View style={styles.line} />
            </View>

            {/* Social Login */}
            {/* <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
                <Text style={styles.socialText}>Đăng nhập bằng Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
                <Text style={styles.socialText}>Đăng nhập bằng LinkedIn</Text>
            </TouchableOpacity> */}

            {/* 🆕 Signup and Employer login */}
            <View style={styles.bottomLinks}>
                <TouchableOpacity onPress={() => navigation.navigate("EmployerRegister")}>
                    <Text style={styles.linkText}>
                        Chưa có tài khoản? <Text style={styles.linkHighlight}>Đăng ký ngay</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.linkText}>
                        Bạn là ứng viên? <Text style={styles.linkHighlight}>Đăng nhập tại đây</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1E293B",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 14,
        marginVertical: 8,
        width: "100%",
        backgroundColor: "#fff",
        height: 48,
    },
    icon: {
        marginRight: 8,
        color: "#94A3B8"
    },
    iconRight: {
        marginLeft: "auto",
        color: "#94A3B8"
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        color: "#1E293B",
        fontSize: 15,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 10,
        alignItems: "center",
    },
    rememberContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        marginRight: 6,
    },
    remember: {
        color: "#475569",
        fontSize: 14,
    },
    forgot: {
        color: "#2563EB",
        fontWeight: "600",
        fontSize: 14,
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
        width: "100%",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#CBD5E1",
    },
    or: {
        marginHorizontal: 8,
        fontSize: 14,
        color: "#475569",
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 48,
        backgroundColor: "#F8FAFC",
        borderRadius: 10,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: "#CBD5E1",
    },
    socialText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "500",
        color: "#1E293B",
    },
    bottomLinks: {
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        color: "#475569",
        fontSize: 14,
        marginVertical: 4,
    },
    linkHighlight: {
        color: "#2563EB",
        fontWeight: "600",
    },
});

export default EmployerLoginScreen;
