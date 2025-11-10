import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { forgotPasswordEmployee, forgotPasswordEmployer } from "../../services/authService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

type MainNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ResetPassword"
>;
const ForgotPasswordScreen = ({ route }: any) => {

    const navigation = useNavigation<MainNavigationProp>();
    const { isEmployee } = route.params as { isEmployee: boolean };
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const { ToastService } = require("../../services/toastService");
        
        if (!email.trim()) {
            ToastService.error("Lỗi", "Vui lòng nhập email");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            ToastService.error("Lỗi", "Email không đúng định dạng");
            return;
        }

        setLoading(true);
        try {
            if (isEmployee) {
                const res = await forgotPasswordEmployee(email);

            } else {
                const res = await forgotPasswordEmployer(email);

            }
            navigation.replace("ResetPassword", { email: email, isEmployee: isEmployee });

        } catch (error: any) {
            const status = error?.response?.status;
            const { ToastService } = require("../../services/toastService");
            if (status === 400) ToastService.error("Lỗi", "Email không hợp lệ");
            else if (status === 411) ToastService.error("Tài khoản bị khóa", "Tài khoản này đã bị khóa.");
            else ToastService.error("Lỗi", "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <AntDesign name="arrow-left" size={24} color="#1E293B" />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
                <Text style={styles.title}>Quên mật khẩu</Text>
                <Text style={styles.label}>Nhập email của bạn để đặt lại mật khẩu</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nhập email..."
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Xác nhận</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ForgotPasswordScreen;

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
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
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
