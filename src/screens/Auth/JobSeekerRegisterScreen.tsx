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
import { useState, useEffect } from "react";
import { registerEmployee } from "../../services/authService";
import { validateField } from "../../utilities/validation";
import { useI18n } from "../../hooks/useI18n";
import { Dropdown } from "react-native-element-dropdown";
import { getAllIndustries, Industry } from "../../services/industryService";

const JobSeekerRegisterScreen = ({ navigation }: any) => {
    const { t } = useI18n();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [industryId, setIndustryId] = useState<number | undefined>(undefined);
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [isChecked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const data = await getAllIndustries();
                setIndustries(data);
            } catch (error) {
                console.error("Error fetching industries:", error);
            }
        };
        fetchIndustries();
    }, []);

    const handleRegister = async () => {
        const { ToastService } = require("../../services/toastService");

        if (!fullName || !email || !password || !confirmPassword) {
            ToastService.error(t('common.error'), t('auth.enterAllFields'));
            return;
        }

        const emailError = validateField(email, "email");
        if (emailError) {
            ToastService.error(t('common.error'), emailError);
            return;
        }

        const passwordError = validateField(password, "password");
        if (passwordError) {
            ToastService.error(t('common.error'), passwordError);
            return;
        }

        if (password !== confirmPassword) {
            ToastService.error(t('common.error'), t('auth.passwordMismatch'));
            return;
        }

        if (!isChecked) {
            const { ToastService } = require("../../services/toastService");
            ToastService.info(t('notification.notifications'), t('auth.agreeTermsRequired'));
            return;
        }

        try {
            setLoading(true);
            const res = await registerEmployee({ fullName, email, password, confirmPassword, industryId });
            const { ToastService } = require("../../services/toastService");
            ToastService.success(t('common.success'), res.message || t('auth.registerSuccess'));
            navigation.replace("ConfirmEmail", { email: email, role: "employee" });
        } catch (err: any) {
            const { ToastService } = require("../../services/toastService");
            ToastService.error(t('auth.registerError'), err.message || t('auth.errorOccurred'));
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
                    <Text style={styles.title}>{t('auth.registerAccount')}</Text>

                    {/* Fullname input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.enterFullName')}
                            value={fullName}
                            onChangeText={setFullName}
                            style={styles.input}
                        />
                    </View>

                    {/* Email input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.enterEmail')}
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
                            placeholder={t('auth.enterPassword')}
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
                            placeholder={t('auth.confirmPassword')}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Industry Dropdown */}
                    <View style={styles.dropdownWrapper}>
                        <Ionicons name="briefcase-outline" size={22} color="#94A3B8" style={styles.dropdownIcon} />
                        <Dropdown
                            data={industries}
                            labelField="name"
                            valueField="id"
                            placeholder={t('auth.selectIndustry') || "Chọn ngành nghề (tùy chọn)"}
                            value={industryId}
                            onChange={(item) => setIndustryId(item.id)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
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
                            {t('auth.agreeTerms')}{" "}
                            <Text style={styles.link}>{t('auth.termsConditions')}</Text>
                        </Text>
                    </View>

                    {/* Sign up button */}
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? t('auth.registering') : t('auth.registerNow')}
                        </Text>
                    </TouchableOpacity>

                    {/* 🆕 Login link */}
                    <View style={styles.bottomLinks}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.linkText}>
                                {t('auth.haveAccount')}{" "}
                                <Text style={styles.linkHighlight}>{t('auth.login')}</Text>
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
    dropdownWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 14,
        marginVertical: 8,
        width: "100%",
        backgroundColor: "#fff",
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    dropdownIcon: {
        marginRight: 8,
    },
    placeholderStyle: {
        color: "#94A3B8",
        fontSize: 15,
    },
    selectedTextStyle: {
        color: "#1E293B",
        fontSize: 15,
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
