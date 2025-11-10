import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { resetEmployeePassword, resetEmployerPassword } from "../../services/authService";
import { AntDesign } from '@expo/vector-icons';
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
type MainNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login" | "EmployerLogin"
>;
const ResetPasswordScreen = ({ route }: any) => {
    const navigation = useNavigation<MainNavigationProp>();
    const { isEmployee } = route.params as { isEmployee: boolean };
    const { email } = route.params as { email: string };
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const { ToastService } = require("../../services/toastService");

        if (!code || !newPassword) {
            ToastService.error("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }

        // Validate OTP code
        if (code.length !== 8 || !/^\d+$/.test(code)) {
            ToastService.error("Lỗi", "Mã OTP phải gồm 8 chữ số");
            return;
        }

        // Validate password
        if (newPassword.length < 6) {
            ToastService.error("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            ToastService.error("Lỗi", "Mật khẩu phải chứa ít nhất 1 chữ hoa");
            return;
        }

        if (!/[a-z]/.test(newPassword)) {
            ToastService.error("Lỗi", "Mật khẩu phải chứa ít nhất 1 chữ thường");
            return;
        }

        if (!/[0-9]/.test(newPassword)) {
            ToastService.error("Lỗi", "Mật khẩu phải chứa ít nhất 1 số");
            return;
        }

        setLoading(true);
        try {
            if (isEmployee) {
                const res = await resetEmployeePassword(email, code, newPassword);
                ToastService.success("Thành công", "Đổi mật khẩu thành công");
                navigation.navigate("Login");
            }
            else {
                const res = await resetEmployerPassword(email, code, newPassword);
                ToastService.success("Thành công", "Đổi mật khẩu thành công");
                navigation.navigate("EmployerLogin");
            }
        } catch (error: any) {

            ToastService.error("Lỗi", error.message || "Đã xảy ra lỗi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <AntDesign name="arrow-left" size={24} color="#1E293B" />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Đặt lại mật khẩu</Text>
                    <Text style={styles.label}>Nhập mã OTP và mật khẩu mới của bạn</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Mã OTP"
                        placeholderTextColor="#999"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="numeric"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu mới"
                        placeholderTextColor="#999"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Đang xử lý..." : "Xác nhận"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    backButton: {
        position: 'absolute',
        top: 44,
        left: 20,
        zIndex: 1,
        padding: 8,
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#1E293B",
        textAlign: "center",
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        color: "#475569",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
