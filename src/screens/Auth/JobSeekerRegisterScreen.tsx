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

const JobSeekerRegisterScreen = ({ navigation }: any) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChecked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            const { ToastService } = require("../../services/toastService");
            ToastService.error("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (password !== confirmPassword) {
            const { ToastService } = require("../../services/toastService");
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
                    <Text style={styles.title}>Job Seeker Registration</Text>

                    {/* Fullname input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={22} color="#888" style={styles.icon} />
                        <TextInput
                            placeholder="Enter your full name"
                            value={fullName}
                            onChangeText={setFullName}
                            style={styles.input}
                        />
                    </View>

                    {/* Email input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={22} color="#888" style={styles.icon} />
                        <TextInput
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                    </View>

                    {/* Password input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />
                    </View>

                    {/* Confirm Password input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
                        <TextInput
                            placeholder="Confirm password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                        />
                    </View>

                    {/* Checkbox - Agree terms */}
                    <View style={styles.agreeContainer}>
                        <Checkbox
                            value={isChecked}
                            onValueChange={setChecked}
                            color={isChecked ? "#1976d2" : undefined}
                            style={styles.checkbox}
                        />
                        <Text style={styles.agreeText}>
                            I agree to the{" "}
                            <Text style={styles.link}>Terms & Conditions</Text>
                        </Text>
                    </View>

                    {/* Sign up button */}
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? "Registering..." : "Sign Up"}
                        </Text>
                    </TouchableOpacity>

                    {/* 🆕 Login link */}
                    <View style={styles.bottomLinks}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.linkText}>
                                Already have an account?{" "}
                                <Text style={styles.linkHighlight}>Log In</Text>
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
        padding: 20,
        backgroundColor: "#fff",
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 8,
        width: "100%",
        height: 50,
    },
    icon: { marginRight: 8 },
    input: { flex: 1, paddingVertical: 10 },
    agreeContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 12,
        width: "100%",
    },
    checkbox: { marginRight: 8, marginTop: 3 },
    agreeText: { flex: 1, color: "#555", fontSize: 14, lineHeight: 20 },
    link: { color: "#1976d2", fontWeight: "600" },
    button: {
        backgroundColor: "#1976d2",
        paddingVertical: 16,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    bottomLinks: {
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        color: "#555",
        fontSize: 14,
    },
    linkHighlight: {
        color: "#1976d2",
        fontWeight: "bold",
    },
});

export default JobSeekerRegisterScreen;
