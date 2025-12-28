// ChangeEmailScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useI18n } from "../../../hooks/useI18n";

const ChangeEmailScreen = () => {
    const navigation = useNavigation();
    const { t } = useI18n();

    const [password, setPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.side}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={22} color="#111" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{t('menu.changeEmail')}</Text>

                <View style={styles.side} />
            </View>

            <View style={styles.content}>
                {/* Mật khẩu */}
                <Text style={styles.label}>{t('menu.password')}</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        placeholder={t('menu.enterPassword')}
                        placeholderTextColor="#6B7280"
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeBtn}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                {/* Email mới */}
                <Text style={styles.label}>{t('menu.newEmail')}</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={newEmail}
                        onChangeText={setNewEmail}
                        placeholder={t('menu.enterNewEmail')}
                        placeholderTextColor="#6B7280"
                        keyboardType="email-address"
                    />
                </View>

                {/* Nhập lại email */}
                <Text style={styles.label}>{t('menu.reenterEmail')}</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={confirmEmail}
                        onChangeText={setConfirmEmail}
                        placeholder={t('menu.reenterNewEmail')}
                        placeholderTextColor="#6B7280"
                        keyboardType="email-address"
                    />
                </View>

                {/* Nút đổi email */}
                <TouchableOpacity style={styles.submitBtn}>
                    <Text style={styles.submitText}>{t('menu.changeEmail')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChangeEmailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    side: {
        width: 48,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#111",
        marginTop: 10,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 6,
        color: "#111",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: 44,
        fontSize: 15,
    },
    eyeBtn: {
        padding: 4,
    },
    submitBtn: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
