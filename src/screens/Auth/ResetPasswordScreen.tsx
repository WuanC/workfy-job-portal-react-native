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
import { useI18n } from "../../hooks/useI18n";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
type MainNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login" | "EmployerLogin"
>;
const ResetPasswordScreen = ({ route }: any) => {
    const { t } = useI18n();
    const navigation = useNavigation<MainNavigationProp>();
    const { isEmployee } = route.params as { isEmployee: boolean };
    const { email } = route.params as { email: string };
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const { ToastService } = require("../../services/toastService");

        if (!code || !newPassword) {
            ToastService.error(t('common.error'), t('auth.enterAllInfo'));
            return;
        }

        // Validate OTP code
        if (code.length !== 8 || !/^\d+$/.test(code)) {
            ToastService.error(t('common.error'), t('auth.otpMust8Digits'));
            return;
        }

        // Validate password
        if (newPassword.length < 6) {
            ToastService.error(t('common.error'), t('auth.passwordMin6'));
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            ToastService.error(t('common.error'), t('auth.passwordNeedUppercase'));
            return;
        }

        if (!/[a-z]/.test(newPassword)) {
            ToastService.error(t('common.error'), t('auth.passwordNeedLowercase'));
            return;
        }

        if (!/[0-9]/.test(newPassword)) {
            ToastService.error(t('common.error'), t('auth.passwordNeedNumber'));
            return;
        }

        setLoading(true);
        try {
            if (isEmployee) {
                const res = await resetEmployeePassword(email, code, newPassword);
                ToastService.success(t('common.success'), t('auth.passwordChangeSuccess'));
                navigation.navigate("Login");
            }
            else {
                const res = await resetEmployerPassword(email, code, newPassword);
                ToastService.success(t('common.success'), t('auth.passwordChangeSuccess'));
                navigation.navigate("EmployerLogin");
            }
        } catch (error: any) {

            ToastService.error(t('common.error'), error.message || t('auth.errorOccurred'));
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
                    <Text style={styles.title}>{t('auth.resetPasswordTitle')}</Text>
                    <Text style={styles.label}>{t('auth.resetPasswordDesc')}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder={t('auth.otpCode')}
                        placeholderTextColor="#6B7280"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="numeric"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder={t('auth.newPassword')}
                        placeholderTextColor="#6B7280"
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
                            {loading ? t('auth.processing') : t('auth.confirm')}
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
