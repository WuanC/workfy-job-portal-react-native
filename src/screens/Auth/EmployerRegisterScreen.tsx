import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { registerEmployer } from "../../services/authService";
import { getAllProvince, Province } from "../../services/provinceService";
import { District, getDistrictsByProvince } from "../../services/districtService";
import { Dropdown } from "react-native-element-dropdown";
import { getEnumOptions, LevelCompanySize, LOGO_IMG } from "../../utilities/constant";
import { validateField } from "../../utilities/validation";
import { useI18n } from "../../hooks/useI18n";

const EmployerRegisterScreen = ({ navigation }: any) => {
    const { t } = useI18n();
    const [listProvinces, setListProvinces] = useState<Province[]>([]);
    const [listDistricts, setListDistricts] = useState<District[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [phone, setPhone] = useState("");
    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const list = await getAllProvince();
                if (!cancelled) setListProvinces(list);
            } catch (err) {
                console.error("Error loading provinces:", err);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (provinceId) {
            (async () => {
                try {
                    const data = await getDistrictsByProvince(provinceId);
                    setListDistricts(data);
                } catch (error) {
                    console.error("Error loading districts:", error);
                    setListDistricts([]);
                }
            })();
        } else {
            setListDistricts([]);
        }
    }, [provinceId]);

    const handleRegister = async () => {
        const { ToastService } = require("../../services/toastService");

        if (!email || !password || !confirmPassword || !companyName) {
            ToastService.error(t('auth.missingInfo'), t('auth.fillRequiredFields'));
            return;
        }

        const emailError = validateField(email, "email");
        if (emailError) return ToastService.error(t('auth.missingInfo'), emailError);

        const passwordError = validateField(password, "password");
        if (passwordError) return ToastService.error(t('auth.missingInfo'), passwordError);

        if (password !== confirmPassword) {
            ToastService.error(t('auth.missingInfo'), t('auth.passwordMismatch'));
            return;
        }

        if (phone) {
            const phoneError = validateField(phone, "phone");
            if (phoneError) return ToastService.error(t('auth.missingInfo'), phoneError);
        }

        try {
            setLoading(true);
            await registerEmployer({
                email,
                password,
                companyName,
                companySize,
                contactPerson,
                phoneNumber: phone,
                provinceId: provinceId ?? 0,
                districtId: districtId ?? 0,
                detailAddress: address || undefined,
            });
            ToastService.success(t('auth.registerSuccess'), t('auth.employerRegisterSuccess'));
            navigation.replace("ConfirmEmail", { email, role: "employer" });
        } catch (err: any) {
            ToastService.error(t('auth.registerFailed'), err.message || t('auth.tryAgain'));
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
                    <Text style={styles.title}>{t('auth.employerRegister')}</Text>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.companyEmail')}
                            placeholderTextColor="#6B7280"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.enterPassword')}
                            placeholderTextColor="#6B7280"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.confirmPassword')}
                            placeholderTextColor="#6B7280"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Company Name */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="business-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.companyName')}
                            placeholderTextColor="#6B7280"
                            value={companyName}
                            onChangeText={setCompanyName}
                            style={styles.input}
                        />
                    </View>

                    {/* Company Size */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="people-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <Dropdown
                            data={getEnumOptions(LevelCompanySize)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('auth.companySize')}
                            value={companySize}
                            onChange={(item) => setCompanySize(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                        />
                    </View>

                    {/* Contact Person */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.contactPerson')}
                            placeholderTextColor="#6B7280"
                            value={contactPerson}
                            onChangeText={setContactPerson}
                            style={styles.input}
                        />
                    </View>

                    {/* Phone */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.phoneNumber')}
                            placeholderTextColor="#6B7280"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                            style={styles.input}
                        />
                    </View>

                    {/* Province */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="location-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <Dropdown
                            data={listProvinces}
                            labelField="name"
                            valueField="id"
                            placeholder={t('auth.selectProvince')}
                            value={provinceId}
                            onChange={(item) => setProvinceId(item.id)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                        />
                    </View>

                    {/* District */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="map-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <Dropdown
                            data={listDistricts}
                            labelField="name"
                            valueField="id"
                            placeholder={t('auth.selectDistrict')}
                            value={districtId}
                            onChange={(item) => setDistrictId(item.id)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                        />
                    </View>

                    {/* Address */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="home-outline" size={22} color="#94A3B8" style={styles.icon} />
                        <TextInput
                            placeholder={t('auth.detailAddress')}
                            placeholderTextColor="#6B7280"
                            value={address}
                            onChangeText={setAddress}
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? t('auth.registering') : t('auth.registerNow')}
                        </Text>
                    </TouchableOpacity>

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
        marginBottom: 20 
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
        fontSize: 15,
        color: "#1E293B"
    },
    dropdown: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
    },
    placeholder: { 
        color: "#94A3B8", 
        fontSize: 15 
    },
    selectedText: { 
        color: "#1E293B", 
        fontSize: 15,
        fontWeight: "500"
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginTop: 16,
    },
    buttonText: { 
        color: "#fff", 
        fontSize: 16, 
        fontWeight: "600" 
    },
    bottomLinks: { 
        marginTop: 20, 
        alignItems: "center",
        marginBottom: 24,
    },
    linkText: { 
        color: "#475569", 
        fontSize: 14 
    },
    linkHighlight: { 
        color: "#2563EB", 
        fontWeight: "600" 
    },
});

export default EmployerRegisterScreen;
