import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useI18n } from "../../../hooks/useI18n";
import { getUserProfile, updateUserProfile, UpdateUserProfileRequest } from "../../../services/employeeService";
import { getAllIndustries, Industry } from "../../../services/industryService";
import { getAllProvince, Province } from "../../../services/provinceService";
import { getDistrictsByProvince, District } from "../../../services/districtService";
import { validateField } from "../../../utilities/validation";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";
import { useAuth } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateProfileScreen = () => {
    const navigation = useNavigation();
    const { t } = useI18n();
    const { user, setUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form data
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [gender, setGender] = useState("");
    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [industryId, setIndustryId] = useState<number | null>(null);
    const [detailAddress, setDetailAddress] = useState("");

    // Dropdown data
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);

    // Date picker
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const genderOptions = [
        { label: t("profile.male") || "Nam", value: "MALE" },
        { label: t("profile.female") || "Nữ", value: "FEMALE" },
        { label: t("profile.other") || "Khác", value: "OTHER" },
    ];

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (provinceId) {
            loadDistricts(provinceId);
        } else {
            setDistricts([]);
            setDistrictId(null);
        }
    }, [provinceId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [profile, industriesData, provincesData] = await Promise.all([
                getUserProfile(),
                getAllIndustries(),
                getAllProvince(),
            ]);

            // Set form data from profile
            setFullName(profile.fullName || "");
            setPhoneNumber(profile.phoneNumber || "");
            setGender(profile.gender || "");
            setDetailAddress(profile.detailAddress || "");
            setIndustryId(profile.industry?.id || null);
            setProvinceId(profile.province?.id || null);
            setDistrictId(profile.district?.id || null);

            if (profile.birthDate) {
                setBirthDate(new Date(profile.birthDate));
            }

            setIndustries(industriesData);
            setProvinces(provincesData);

            // Load districts if province exists
            if (profile.province?.id) {
                const districtsData = await getDistrictsByProvince(profile.province.id);
                setDistricts(districtsData);
            }
        } catch (error: any) {
            const { ToastService } = require("../../../services/toastService");
            ToastService.error(t("common.error"), error.message || t("messages.loadError"));
        } finally {
            setLoading(false);
        }
    };

    const loadDistricts = async (pId: number) => {
        try {
            const data = await getDistrictsByProvince(pId);
            setDistricts(data);
        } catch (error) {
            console.error("Lỗi khi lấy quận/huyện:", error);
            setDistricts([]);
        }
    };

    const handleSubmit = async () => {
        const { ToastService } = require("../../../services/toastService");

        // Validate
        if (!fullName.trim()) {
            ToastService.warning(t("common.error"), t("validation.required", { field: t("profile.fullName") }));
            return;
        }

        if (phoneNumber) {
            const phoneErr = validateField(phoneNumber, "phone");
            if (phoneErr) {
                ToastService.warning(t("common.error"), phoneErr);
                return;
            }
        }

        try {
            setSubmitting(true);

            const payload: UpdateUserProfileRequest = {
                fullName,
                phoneNumber: phoneNumber || undefined,
                birthDate: birthDate ? formatDateToAPI(birthDate) : undefined,
                gender: gender || undefined,
                provinceId: provinceId || undefined,
                districtId: districtId || undefined,
                industryId: industryId || undefined,
                detailAddress: detailAddress || undefined,
            };
            await updateUserProfile(payload);
            
            // Update industryId in AuthContext if changed
            if (industryId && user && user.industryId !== industryId) {
                const updatedUser = { ...user, industryId };
                setUser(updatedUser);
                await AsyncStorage.setItem("industryId", industryId.toString());
            }
            
            ToastService.success(t("common.success"), t("messages.updateSuccess"));
            setTimeout(() => navigation.goBack(), 800);
        } catch (error: any) {
            ToastService.error(t("common.error"), error.message || t("messages.updateError"));
        } finally {
            setSubmitting(false);
        }
    };

    const formatDateToAPI = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatDateDisplay = (date: Date | null) => {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingWrapper>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />

                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.side} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={22} color="#111" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t("profile.updateProfile")}</Text>
                    <View style={styles.side} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Full Name */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>
                            {t("profile.fullName")} <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t("profile.fullName")}
                            placeholderTextColor="#6B7280"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{t("profile.phone")}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t("profile.phone")}
                            placeholderTextColor="#6B7280"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>

                    {/* Birth Date */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{t("profile.birthDate")}</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisible(true)}>
                            <Text style={birthDate ? styles.inputText : styles.placeholderText}>
                                {birthDate ? formatDateDisplay(birthDate) : t("profile.selectBirthDate")}
                            </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(date) => {
                                setBirthDate(date);
                                setDatePickerVisible(false);
                            }}
                            onCancel={() => setDatePickerVisible(false)}
                            maximumDate={new Date()}
                        />
                    </View>

                    {/* Gender */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{t("profile.gender")}</Text>
                        <Dropdown
                            data={genderOptions}
                            labelField="label"
                            valueField="value"
                            placeholder={t("profile.selectGender")}
                            value={gender}
                            onChange={(item) => setGender(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            autoScroll={false}
                        />
                    </View>

                    {/* Industry */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{t("profile.industry")}</Text>
                        <Dropdown
                            data={industries}
                            labelField="name"
                            valueField="id"
                            placeholder={t("profile.selectIndustry")}
                            value={industryId}
                            onChange={(item) => setIndustryId(item.id)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            search
                            searchPlaceholder={t("common.search")}
                            autoScroll={false}
                        />
                    </View>

                    {/* Province */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{t("profile.province")}</Text>
                        <Dropdown
                            data={provinces}
                            labelField="name"
                            valueField="id"
                            placeholder={t("profile.selectProvince")}
                            value={provinceId}
                            onChange={(item) => {
                                setProvinceId(item.id);
                                setDistrictId(null);
                            }}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            search
                            searchPlaceholder={t("common.search")}
                            autoScroll={false}
                        />
                    </View>

                    {/* District */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{t("profile.district")}</Text>
                        <Dropdown
                            data={districts}
                            labelField="name"
                            valueField="id"
                            placeholder={t("profile.selectDistrict")}
                            value={districtId}
                            onChange={(item) => setDistrictId(item.id)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            search
                            searchPlaceholder={t("common.search")}
                            disable={!provinceId}
                            autoScroll={false}
                        />
                    </View>

                    {/* Detail Address */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{t("profile.detailAddress")}</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder={t("profile.detailAddress")}
                            placeholderTextColor="#6B7280"
                            value={detailAddress}
                            onChangeText={setDetailAddress}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>{t("common.save")}</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingWrapper>
    );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F7FA",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F7FA",
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
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 8,
    },
    required: {
        color: "#ef4444",
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#1E293B",
        justifyContent: "center",
    },
    inputText: {
        color: "#1E293B",
        fontSize: 15,
    },
    placeholderText: {
        color: "#94A3B8",
        fontSize: 15,
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
        paddingTop: 12,
    },
    dropdown: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        height: 48,
    },
    placeholderStyle: {
        color: "#94A3B8",
        fontSize: 15,
    },
    selectedTextStyle: {
        color: "#1E293B",
        fontSize: 15,
    },
    submitButton: {
        backgroundColor: "#2563EB",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 16,
    },
    submitButtonDisabled: {
        backgroundColor: "#94A3B8",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
