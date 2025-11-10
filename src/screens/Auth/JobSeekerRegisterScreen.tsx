import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LOGO_IMG } from "../../utilities/constant";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { registerEmployee } from "../../services/authService";
import { validateField } from "../../utilities/validation";

const JobSeekerRegisterScreen = ({ navigation }: any) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChecked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        const { ToastService } = require("../../services/toastService");

        if (!fullName || !email || !password || !confirmPassword) {
            ToastService.error("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const emailError = validateField(email, "email");
        if (emailError) {
            ToastService.error("Lỗi", emailError);
            return;
        }

        const passwordError = validateField(password, "password");
        if (passwordError) {
            ToastService.error("Lỗi", passwordError);
            return;
        }

        if (password !== confirmPassword) {
            ToastService.error("Lỗi", "Mật khẩu xác nhận không khớp.");
            return;
        }

        if (!isChecked) {
            const { ToastService } = require("../../services/toastService");
            ToastService.info("Thông báo", "Bạn cần đồng ý với điều khoản trước khi đăng ký.");
            return;
        }

        try {
            setLoading(true);
            const res = await registerEmployee({ fullName, email, password, confirmPassword });
            const { ToastService } = require("../../services/toastService");
            ToastService.success("Thành công", res.message || "Đăng ký thành công!");
            navigation.replace("ConfirmEmail", { email: email, role: "employee" });
        } catch (err: any) {
            const { ToastService } = require("../../services/toastService");
            ToastService.error("Đăng ký thất bại", err.message || "Đã xảy ra lỗi");
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
                    <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.title}>Đăng ký tài khoản</Text>

                    {/* Fullname input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder="Nhập họ và tên"
                            value={fullName}
                            onChangeText={setFullName}
                            style={styles.input}
                        />
                    </View>

                    {/* Email input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder="Nhập email của bạn"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder="Nhập mật khẩu"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Confirm Password input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder="Xác nhận mật khẩu"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Checkbox - Agree terms */}
                    <View style={styles.agreeContainer}>
                        <Checkbox
                            value={isChecked}
                            onValueChange={setChecked}
                            color={isChecked ? "#2563EB" : undefined}
                            style={styles.checkbox}
                        />
                        <Text style={styles.agreeText}>
                            Tôi đồng ý với{" "}
                            <Text style={styles.link}>Điều khoản & Điều kiện</Text>
                        </Text>
                    </View>

                    {/* Sign up button */}
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
                        </Text>
                    </TouchableOpacity>

                    {/* 🆕 Login link */}
                    <View style={styles.bottomLinks}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
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
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
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
        marginBottom: 24,
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
        height: 48,
    },
    icon: { marginRight: 8 },
    input: { 
        flex: 1, 
        paddingVertical: 10,
        color: "#1E293B",
        fontSize: 15
    },
    agreeContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 12,
        width: "100%",
    },
    checkbox: { marginRight: 8, marginTop: 3 },
    agreeText: { 
        flex: 1, 
        color: "#475569", 
        fontSize: 14, 
        lineHeight: 20 
    },
    link: { 
        color: "#2563EB", 
        fontWeight: "600" 
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
        fontWeight: "600" 
    },
    bottomLinks: {
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        color: "#475569",
        fontSize: 14,
    },
    linkHighlight: {
        color: "#2563EB",
        fontWeight: "600",
    },
});

export default JobSeekerRegisterScreen;
