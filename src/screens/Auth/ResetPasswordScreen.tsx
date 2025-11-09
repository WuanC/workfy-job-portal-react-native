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
        if (!code || !newPassword) {
                const { ToastService } = require("../../services/toastService");
                ToastService.error("Lỗi", "Vui lòng nhập đầy đủ thông tin");
                return;
            }

        setLoading(true);
        try {
            if (isEmployee) {
                const res = await resetEmployeePassword(email, code, newPassword);
                navigation.navigate("Login");
            }
            else {
                const res = await resetEmployerPassword(email, code, newPassword);
                navigation.navigate("EmployerLogin");
            }
        } catch (error: any) {
            const { ToastService } = require("../../services/toastService");
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
            <View style={styles.card}>
                <Text style={styles.title}>Đặt lại mật khẩu</Text>


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
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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
        fontSize: 20,
        fontWeight: "600",
        color: "#222",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 15,
        backgroundColor: "#fff",
        fontSize: 15,
        color: "#333",
    },
    button: {
        backgroundColor: "#007AFF",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
