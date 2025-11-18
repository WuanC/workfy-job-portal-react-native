import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AgeType, BenefitType, EducationLevel, ExperienceLevel, getEnumOptions, JobGender, JobLevel, JobType, LevelCompanySize, SalaryType, SalaryUnit } from "../../utilities/constant";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { getAllIndustries, Industry } from "../../services/industryService";
import { getAllProvince, Province } from "../../services/provinceService";
import { District, getDistrictsByProvince } from "../../services/districtService";
import { Benefit, createJob, JobRequest } from "../../services/jobService";
import { JobLocation } from "../../types/type";
import { getEmployerProfile } from "../../services/employerService";
import { validateField } from "../../utilities/validation";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import { colors } from "../../theme";
import { useI18n } from "../../hooks/useI18n";

const PostJobScreen2 = () => {
    const navigation = useNavigation();
    const { t, isEnglish } = useI18n();

    const [loading, setLoading] = useState(true);

    //-- Province
    const [listProvinces, setListProvinces] = useState<Province[]>([])

    // --- Thông tin công ty ---
    const [companyName, setCompanyName] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyWebSite, setCompanyWebSite] = useState("");
    const [aboutCompany, setAboutCompany] = useState("");

    // --- Thông tin công việc ---
    const [jobTitle, setJobTitle] = useState("");
    const [jobProvinceId, setJobProvinceId] = useState<number | null>(null);
    const [jobDistrictId, setJobDistrictId] = useState<number | null>(null);

    const [jobLocations, setJobLocations] = useState<JobLocation[]>([]);

    const [jobDetailAddress, setJobDetailAddress] = useState("");
    const [salaryType, setSalaryType] = useState<string>("");
    const [minSalary, setMinSalary] = useState<number | null>(null);
    const [maxSalary, setMaxSalary] = useState<number | null>(null);
    const [salaryUnit, setSalaryUnit] = useState("");
    const [jobDescription, setJobDescription] = useState("")
    const [requirement, setRequirement] = useState("")
    const [benefits, setBenefits] = useState<Benefit[]>([])
    const [listJobDistricts, setListJobDistricts] = useState<District[]>([])

    // --- Chi tiết công việc ---
    const [jobLevel, setJobLevel] = useState("");
    const [jobType, setJobType] = useState("");
    const [jobGender, setJobGender] = useState("");
    const [jobCode, setJobCode] = useState("");

    const [education, setEducation] = useState("");
    const [experience, setExperience] = useState("");
    const [selectIndustryList, setSelectIndustryList] = useState<(number | null)[]>([null]);
    const [ageType, setAgeType] = useState("");
    const [minAge, setMinAge] = useState<number | null>(null);
    const [maxAge, setMaxAge] = useState<number | null>(null);


    const [industries, setIndustries] = useState<Industry[]>([]);




    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactProvinceId, setContactProvinceId] = useState<number | null>(null);
    const [contactDistrictId, setContactDistrictId] = useState<number | null>(null);
    const [contactDetailAddress, setContactDetailAddress] = useState("");
    const [description, setDescription] = useState("");

    const [listContactDistricts, setListContactDistrict] = useState<District[]>([])



    const [expiryDate, setExpiryDate] = useState(new Date());


    // --- Editor ---




    // --- Hàm submit ---
    const handleSubmit = async () => {
        try {
            const { ToastService } = require("../../services/toastService");
            // ======== 1️⃣ VALIDATE CÁC TRƯỜNG BẮT BUỘC THEO THỨ TỰ TEST =========
            if (!companyName.trim()) {
                ToastService.warning(t('validation.required', { field: t('postJob.companyName') }), t('validation.required', { field: t('postJob.companyName') }));
                return;
            }

            if (!aboutCompany.trim()) {
                ToastService.warning(t('validation.required', { field: t('postJob.aboutCompany') }), t('validation.required', { field: t('postJob.aboutCompany') }));
                return;
            }

            if (!jobTitle.trim()) {
                ToastService.warning(t('validation.required', { field: t('postJob.jobTitle') }), t('validation.required', { field: t('postJob.jobTitle') }));
                return;
            }

            if (!jobProvinceId) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn tỉnh/thành phố");
                return;
            }

            if (!jobDistrictId) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn quận/huyện");
                return;
            }

            if (!jobDetailAddress.trim()) {
                ToastService.warning("Thiếu thông tin", "Vui lòng nhập địa chỉ chi tiết");
                return;
            }

            if (!salaryType) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn loại lương");
                return;
            }

            if (salaryType === "RANGE") {
                if (!minSalary || !maxSalary) {
                    ToastService.warning("Thiếu thông tin", "Vui lòng nhập mức lương min và max");
                    return;
                }
                if (minSalary >= maxSalary) {
                    ToastService.warning("Sai định dạng", "Mức lương min phải nhỏ hơn max");
                    return;
                }
                if (minSalary < 0 || maxSalary < 0) {
                    ToastService.warning("Sai định dạng", "Mức lương không được âm");
                    return;
                }
            } else if (salaryType === "GREATER_THAN") {
                if (!minSalary) {
                    ToastService.warning("Thiếu thông tin", "Vui lòng nhập mức lương tối thiểu");
                    return;
                }
                if (minSalary < 0) {
                    ToastService.warning("Sai định dạng", "Mức lương không được âm");
                    return;
                }
            }

            if (!jobDescription.trim()) {
                ToastService.warning("Thiếu thông tin", "Vui lòng nhập mô tả công việc");
                return;
            }

            if (!requirement.trim()) {
                ToastService.warning("Thiếu thông tin", "Vui lòng nhập yêu cầu công việc");
                return;
            }

            if (benefits.length <= 0) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn phúc lợi");
                return;
            }

            for (const benefit of benefits) {
                if (!benefit.description.trim()) {
                    ToastService.warning("Thiếu thông tin", "Vui lòng nhập mô tả cho phúc lợi");
                    return;
                }
            }

            if (!education) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn trình độ học vấn");
                return;
            }

            if (!experience) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn kinh nghiệm");
                return;
            }

            if (!jobLevel) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn cấp bậc");
                return;
            }

            if (!jobType) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn loại hình công việc");
                return;
            }

            if (!jobGender) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn giới tính");
                return;
            }

            const validIndustries = selectIndustryList.filter((id): id is number => id !== null);
            if (validIndustries.length === 0) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn ngành nghề");
                return;
            }

            if (!ageType) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn loại độ tuổi");
                return;
            }

            if (ageType === "INPUT") {
                if (!minAge || !maxAge) {
                    ToastService.warning("Thiếu thông tin", "Vui lòng nhập độ tuổi min và max");
                    return;
                }
                if (minAge >= maxAge) {
                    ToastService.warning("Sai định dạng", "Độ tuổi min phải nhỏ hơn max");
                    return;
                }
                if (minAge < 0 || maxAge < 0) {
                    ToastService.warning("Sai định dạng", "Độ tuổi không được âm");
                    return;
                }
            } else if (ageType === "ABOVE") {
                if (!minAge) {
                    ToastService.warning("Thiếu thông tin", "Vui lòng nhập độ tuổi tối thiểu");
                    return;
                }
                if (minAge < 0) {
                    ToastService.warning("Sai định dạng", "Độ tuổi không được âm");
                    return;
                }
            } else if (ageType === "BELOW") {
                if (!maxAge) {
                    ToastService.warning("Thiếu thông tin", "Vui lòng nhập độ tuổi tối đa");
                    return;
                }
                if (maxAge < 0) {
                    ToastService.warning("Sai định dạng", "Độ tuổi không được âm");
                    return;
                }
            }

            if (!contactName.trim()) {
                ToastService.warning("Thiếu thông tin", "Vui lòng nhập tên người liên hệ");
                return;
            }

            if (!contactPhone.trim()) {
                ToastService.warning("Thiếu thông tin", "Vui lòng nhập số điện thoại liên hệ");
                return;
            }

            const phoneErr = validateField(contactPhone || "", "phone");
            if (phoneErr) {
                ToastService.warning("Sai định dạng", phoneErr);
                return;
            }

            if (!contactProvinceId) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn tỉnh/thành phố liên hệ");
                return;
            }

            if (!contactDistrictId) {
                ToastService.warning("Thiếu thông tin", "Vui lòng chọn quận/huyện liên hệ");
                return;
            }

            if (!contactDetailAddress.trim()) {
                ToastService.warning("Thiếu thông tin", "Vui lòng nhập địa chỉ chi tiết liên hệ");
                return;
            }

            if (!description.trim()) {
                ToastService.warning("Thiếu thông tin", "Vui lòng nhập mô tả liên hệ");
                return;
            }

            // Thêm validation cho companySize nếu cần (không có trong test, nhưng giữ lại ở cuối)
            if (!companySize) {
                ToastService.warning(t('validation.required', { field: t('postJob.companySize') }), t('validation.required', { field: t('postJob.companySize') }));
                return;
            }

            // ======== 2️⃣ TẠO DỮ LIỆU JOBREQUEST ========
            const jobData: JobRequest = {
                companyName,
                companySize,
                companyWebsite: companyWebSite || undefined,
                aboutCompany,
                jobTitle,
                jobBenefits: benefits,
                jobLocations: [
                    {
                        provinceId: jobProvinceId ?? -1,
                        districtId: jobDistrictId ?? -1,
                        detailAddress: jobDetailAddress,
                    },
                ],
                salaryType,
                minSalary: minSalary || undefined,
                maxSalary: maxSalary || undefined,
                salaryUnit: salaryUnit || undefined,
                jobDescription,
                requirement,
                educationLevel: education,
                experienceLevel: experience,
                jobLevel,
                jobType,
                gender: jobGender,
                jobCode,
                industryIds: selectIndustryList.filter((id): id is number => id !== null),
                ageType,
                minAge: minAge || undefined,
                maxAge: maxAge || undefined,
                contactPerson: contactName,
                phoneNumber: contactPhone,
                contactLocation: {
                    provinceId: contactProvinceId!,
                    districtId: contactDistrictId!,
                    detailAddress: contactDetailAddress || "",
                },
                description: description || undefined,
                expirationDate: formatDate(expiryDate)
            };
            // ======== 3️⃣ GỌI API ========
            console.log("📦 jobData gửi lên:", JSON.stringify(jobData, null, 2));
            const res = await createJob(jobData);
            if (res.status === 201) {
                ToastService.success(t('common.success'), t('messages.saveSuccess'));
                setTimeout(() => navigation.goBack(), 900);
            } else {
                ToastService.error(t('common.error'), res.message || t('messages.saveError'));
            }
        } catch (error: any) {
            if (error.response) {
                console.error("❌ Lỗi khi tạo job:", JSON.stringify(error.response.data, null, 2));
                if (error.response.data.errors) {
                    console.table(error.response.data.errors);
                }
            } else {
                console.error("❌ Lỗi khi tạo job:", error.message);
            }
        }
    };


    // --- Hàm format theo dd/MM/yyyy ---
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        let cancelled = false; // flag để tránh setState sau unmount

        const load = async () => {
            try {
                const data = await getAllIndustries();
                const listProvinces = await getAllProvince();
                const info = await getEmployerProfile();
                const createdDate = new Date(); // ngày tạo hiện tại
                const expiry = new Date(createdDate);
                expiry.setMonth(expiry.getMonth() + 2); // +2 tháng
                setExpiryDate(expiry); // gọi service bạn đã viết
                if (cancelled) return;
                setCompanyName(info.companyName || "");
                setCompanySize(info.companySize || "");
                setAboutCompany(info.aboutCompany || "");
                setIndustries(data);
                setListProvinces(listProvinces)
            } catch (err: any) {
                if (cancelled) return;
                console.error("Lỗi load", err);
            } finally {
                setLoading(false);
                if (!cancelled) { }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);
    useEffect(() => {
        if (jobProvinceId) {
            (async () => {
                try {
                    const data = await getDistrictsByProvince(jobProvinceId);
                    setListJobDistricts(data)
                } catch (error) {
                    console.error("Lỗi khi lấy quận/huyện:", error);
                    setListJobDistricts([])
                } finally {

                }
            })();
        } else {
            setListJobDistricts([])
            //setJobDistrictId(null);
        }
    }, [jobProvinceId]);

    useEffect(() => {
        if (contactProvinceId) {
            (async () => {
                try {
                    const data = await getDistrictsByProvince(contactProvinceId);
                    setListContactDistrict(data)
                } catch (error) {
                    console.error("Lỗi khi lấy quận/huyện:", error);
                    setListJobDistricts([])
                } finally {

                }
            })();
        } else {
            setListContactDistrict([])
            //setContactDistrictId(null);
        }
    }, [contactProvinceId]);



    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
        );
    }
    return (
        <KeyboardAvoidingWrapper>
            <View style={styles.container}>
                {/* ---------- HEADER ---------- */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#333" />
                    </TouchableOpacity>

                    <Text
                        style={styles.headerTitle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {t('postJob.title')}
                    </Text>
                    <View style={{ width: 38 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* ---------- THÔNG TIN CÔNG TY ---------- */}
                    <View style={styles.card}>
                        <Text style={styles.title}>{t('postJob.companyInfo')}</Text>

                        <Text style={styles.label}>
                            {t('postJob.companyName')}<Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            testID="companyNameInput"
                            accessibilityLabel="companyNameInput"
                            placeholderTextColor={"#999"}
                            style={styles.input}
                            placeholder="VD: NPT Software"
                            value={companyName}
                            onChangeText={setCompanyName}
                        />

                        <Text style={styles.label}>
                            {t('postJob.companySize')}<Text style={styles.required}> *</Text>
                        </Text>
                        <Dropdown
                            testID="companySizeDropdown"
                            accessibilityLabel="companySizeDropdown"
                            data={getEnumOptions(LevelCompanySize)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.companySize')}
                            value={companySize}
                            onChange={(item) => setCompanySize(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`companySize_${item.value}`}
                                    accessibilityLabel={`companySize_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                        />

                        <Text style={styles.label}>{t('postJob.companyWebsite')}</Text>
                        <TextInput
                            testID="companyWebsiteInput"
                            accessibilityLabel="companyWebsiteInput"
                            placeholderTextColor={"#999"}
                            style={styles.input}
                            placeholder={t('postJob.companyWebsite')}
                            value={companyWebSite}
                            onChangeText={setCompanyWebSite}
                        />

                        <Text style={styles.label}>
                            {t('postJob.aboutCompany')}<Text style={styles.required}> *</Text>
                        </Text>
                        <TextInput
                            testID="aboutCompanyEditor"
                            accessibilityLabel="aboutCompanyEditor"
                            placeholderTextColor={"#999"}
                            style={[styles.textArea]}
                            placeholder="Nhập về công ty..."
                            multiline={true}
                            textAlignVertical="top"
                            value={aboutCompany}
                            onChangeText={setAboutCompany}
                        />
                    </View>


                    {/* ---------- THÔNG TIN CÔNG VIỆC ---------- */}
                    <View style={styles.card}>
                        <Text style={styles.title}>{t('postJob.jobInfo')}</Text>

                        <Text style={styles.label}>
                            {t('postJob.jobTitle')}<Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            testID="jobTitleInput"
                            accessibilityLabel="jobTitleInput"
                            placeholderTextColor={"#999"}
                            style={styles.input}
                            placeholder={t('postJob.jobTitle')}
                            value={jobTitle}
                            onChangeText={setJobTitle}
                        />

                        <Text style={styles.label}>
                            {t('postJob.location')}<Text style={styles.required}>*</Text>
                        </Text>
                        <Dropdown
                            testID="provinceDropdown"
                            accessibilityLabel="provinceDropdown"
                            data={listProvinces}
                            labelField="name"
                            valueField="id"
                            placeholder={t('postJob.selectProvince')}
                            value={jobProvinceId}
                            onChange={(item) => {
                                setJobProvinceId(item.id)
                            }}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`province_${item.id}`}
                                    accessibilityLabel={`province_${item.id}`}>
                                    <Text>{item.name}</Text>
                                </View>
                            )}
                        />

                        {/* --- Quận / Huyện --- */}
                        <Dropdown
                            testID="districtDropdown"
                            accessibilityLabel="districtDropdown"
                            data={listJobDistricts}
                            labelField="name"
                            valueField="id"
                            placeholder={t('postJob.selectDistrict')}
                            value={jobDistrictId}
                            onChange={(item) => {
                                console.log(item.id)
                                setJobDistrictId(item.id)
                            }}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`district_${item.id}`}
                                    accessibilityLabel={`district_${item.id}`}>
                                    <Text>{item.name}</Text>
                                </View>
                            )}
                        />

                        {/* --- Số nhà / Địa chỉ chi tiết --- */}
                        <TextInput
                            testID="jobDetailAddressInput"
                            accessibilityLabel="jobDetailAddressInput"
                            placeholderTextColor={"#999"}
                            style={styles.input}
                            placeholder={t('postJob.detailAddress')}
                            value={jobDetailAddress}
                            onChangeText={setJobDetailAddress}
                        />

                        <Text style={styles.label}>
                            {t('postJob.salary')}<Text style={styles.required}>*</Text>
                        </Text>

                        {/* --- Dropdown chọn loại lương --- */}
                        <Dropdown
                            testID="salaryTypeDropdown"
                            accessibilityLabel="salaryTypeDropdown"
                            data={getEnumOptions(SalaryType)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.selectSalary')}
                            value={salaryType}
                            onChange={(item) => {
                                console.log(typeof salaryType, salaryType);
                                console.log(typeof SalaryType.GREATER_THAN, SalaryType.GREATER_THAN);
                                setSalaryType(item.value)
                            }
                            }
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`salaryType_${item.value}`}
                                        accessibilityLabel={`salaryType_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                        />

                        {/* --- Nếu chọn “Trên” --- */}
                        {salaryType === "GREATER_THAN" && (
                            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 16, gap: 8 }}>
                                <TextInput
                                    testID="minSalaryInput"
                                    accessibilityLabel="minSalaryInput"
                                    placeholderTextColor={"#999"}
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Nhập mức lương tối thiểu"
                                    keyboardType="numeric"
                                    value={minSalary?.toString() ?? ""}   // number -> string
                                    onChangeText={(text) => {
                                        setMinSalary(text ? parseFloat(text) : null);
                                    }}
                                />
                                <Dropdown
                                    testID="salaryUnitDropdown"
                                    accessibilityLabel="salaryUnitDropdown"
                                    data={getEnumOptions(SalaryUnit)}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Đơn vị"
                                    value={salaryUnit}
                                    onChange={(item) => setSalaryUnit(item.value)}
                                    style={[styles.dropdown, { flex: 1 }]}
                                    placeholderStyle={styles.placeholder}
                                    selectedTextStyle={styles.selectedText}
                                    renderItem={(item) => (
                                        <View testID={`salaryUnit_${item.value}`}>
                                            <Text>{item.label}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        )}

                        {/* --- Nếu chọn “Trong khoảng” --- */}
                        {salaryType === "RANGE" && (
                            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 16, gap: 8 }}>
                                <TextInput
                                    testID="minSalaryInput"
                                    accessibilityLabel="minSalaryInput"
                                    placeholderTextColor={"#999"}
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Min"
                                    keyboardType="numeric"
                                    value={minSalary?.toString() ?? ""}   // number -> string
                                    onChangeText={(text) => {
                                        setMinSalary(text ? parseFloat(text) : null);
                                    }}
                                />
                                <TextInput
                                    testID="maxSalaryInput"
                                    accessibilityLabel="maxSalaryInput"
                                    placeholderTextColor={"#999"}
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Max"
                                    keyboardType="numeric"
                                    value={maxSalary?.toString() ?? ""}   // number -> string
                                    onChangeText={(text) => {
                                        setMaxSalary(text ? parseFloat(text) : null);
                                    }}
                                />
                                <Dropdown
                                    testID="salaryUnitDropdown"
                                    accessibilityLabel="salaryUnitDropdown"
                                    data={getEnumOptions(SalaryUnit)}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Đơn vị"
                                    value={salaryUnit}
                                    onChange={(item) => setSalaryUnit(item.value)}
                                    style={[styles.dropdown, { flex: 1 }]}
                                    placeholderStyle={styles.placeholder}
                                    selectedTextStyle={styles.selectedText}
                                    renderItem={(item) => (
                                        <View testID={`salaryUnit_${item.value}`}
                                        accessibilityLabel={`salaryUnit_${item.value}`}>
                                            <Text>{item.label}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        )}

                        <Text style={styles.label}>{t('postJob.jobDescription')}</Text>
                        <TextInput
                            testID="jobDescriptionEditor"
                            accessibilityLabel="jobDescriptionEditor"
                            placeholderTextColor={"#999"}
                            style={[styles.textArea]}
                            placeholder={t('postJob.jobDescription')}
                            multiline={true}
                            textAlignVertical="top"
                            value={jobDescription}
                            onChangeText={setJobDescription}
                        />

                        <Text style={styles.label}>{t('postJob.requirement')}</Text>
                        <TextInput
                            testID="requirementEditor"
                            accessibilityLabel="requirementEditor"
                            placeholderTextColor={"#999"}
                            style={[styles.textArea]}
                            placeholder={t('postJob.requirement')}
                            multiline={true}
                            textAlignVertical="top"
                            value={requirement}
                            onChangeText={setRequirement}
                        />
                        <Text style={styles.label}>
                            {t('postJob.benefits')}<Text style={styles.required}>*</Text>
                        </Text>

                        <MultiSelect
                            testID="benefitsMultiSelect"
                            accessibilityLabel="benefitsMultiSelect"
                            data={getEnumOptions(BenefitType)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.benefits')}
                            value={benefits.map((b) => b.type)}
                            onChange={(selectedValues) => {
                                const selectedBenefits = selectedValues.map((val) => {
                                    const existing = benefits.find((b) => b.type === val);
                                    return existing || { type: val, description: "" };
                                });
                                setBenefits(selectedBenefits);
                            }}
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            activeColor="#f0f0f0"
                            search
                            searchPlaceholder={t('postJob.searchBenefits')}
                            renderItem={(item) => (
                                <View testID={`benefit_${item.value}`}
                                accessibilityLabel={`benefit_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                            renderSelectedItem={(item, unSelect) => (
                                <View style={styles.selectedItem}>
                                    <Text style={styles.selectedItemText}>{item.label}</Text>
                                    <Ionicons
                                        testID="benefitRemoveIcon"
                                        name="close-circle"
                                        size={16}
                                        color="#747474ff"
                                        style={styles.removeIcon}
                                        onPress={() => unSelect?.(item)}
                                    />
                                </View>
                            )}
                        />

                        {benefits.map((benefit, index) => {
                            const labelFn = BenefitType[benefit.type as keyof typeof BenefitType];
                            return (
                                <View key={benefit.type} style={styles.benefitItem}>
                                    <Text style={styles.benefitLabel}>
                                        {labelFn ? labelFn() : benefit.type}
                                    </Text>
                                    <TextInput
                                        testID={`benefitDescription_${benefit.type}`}
                                        accessibilityLabel={`benefitDescription_${benefit.type}`}
                                        style={styles.input}
                                        placeholder={t('postJob.benefitDescription')}
                                        value={benefit.description}
                                        onChangeText={(text) => {
                                            const updated = [...benefits];
                                            updated[index].description = text;
                                            setBenefits(updated);
                                        }}
                                    />
                                </View>
                            );
                        })}
                    </View>
                    {/* ---------- CHI TIẾT CÔNG VIỆC ---------- */}
                    <View style={styles.card}>
                        <Text style={styles.title}>{t('postJob.jobDetails')}</Text>

                        <Text style={styles.label}>
                            {t('postJob.education')}<Text style={styles.required}>*</Text>
                        </Text>
                        <Dropdown
                            testID="educationDropdown"
                            accessibilityLabel="educationDropdown"
                            data={getEnumOptions(EducationLevel)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.education')}
                            value={education}
                            onChange={(item) => setEducation(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`education_${item.value}`}
                                accessibilityLabel={`education_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                        />

                        <Text style={styles.label}>
                            {t('postJob.experience')}<Text style={styles.required}>*</Text>
                        </Text>
                        <Dropdown
                            testID="experienceDropdown"
                            accessibilityLabel="experienceDropdown"
                            data={getEnumOptions(ExperienceLevel)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.experience')}
                            value={experience}
                            onChange={(item) => setExperience(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`experience_${item.value}`} accessibilityLabel={`experience_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                        />

                        <Text style={styles.label}>
                            {t('postJob.jobLevel')}<Text style={styles.required}>*</Text>
                        </Text>
                        <Dropdown
                            testID="jobLevelDropdown"
                            accessibilityLabel="jobLevelDropdown"
                            data={getEnumOptions(JobLevel)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.jobLevel')}
                            value={jobLevel}
                            onChange={(item) => setJobLevel(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`jobLevel_${item.value}`} accessibilityLabel={`jobLevel_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                        />

                        <Text style={styles.label}>
                            {t('postJob.jobType')}<Text style={styles.required}>*</Text>
                        </Text>
                        <Dropdown
                            testID="jobTypeDropdown"
                            accessibilityLabel="jobTypeDropdown"
                            data={getEnumOptions(JobType)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.jobType')}
                            value={jobType}
                            onChange={(item) => setJobType(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`jobType_${item.value}`} accessibilityLabel={`jobType_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                        />

                        <Text style={styles.label}>
                            {t('postJob.gender')}<Text style={styles.required}>*</Text>
                        </Text>
                        <Dropdown
                            testID="genderDropdown"
                            accessibilityLabel="genderDropdown"
                            data={getEnumOptions(JobGender)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.gender')}
                            value={jobGender}
                            onChange={(item) => setJobGender(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`gender_${item.value}`} accessibilityLabel={`gender_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                        />


                        <Text style={styles.label}>{t('postJob.jobCode')}</Text>
                        <TextInput
                            testID="jobCodeInput"
                            accessibilityLabel="jobCodeInput"
                            placeholderTextColor={"#999"}
                            style={styles.input}
                            placeholder={t('postJob.jobCode')}
                            value={jobCode}
                            onChangeText={(text) => setJobCode(text)}
                        />

                        <Text style={styles.label}>
                            {t('postJob.industry')}<Text style={styles.required}>*</Text>
                        </Text>

                        {/** Duyệt qua danh sách ngành nghề đã chọn **/}
                        {selectIndustryList.map((selected, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 6,
                                    gap: 5,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Dropdown
                                        testID="industryDropdown"
                                        accessibilityLabel="industryDropdown"
                                        data={industries}
                                        labelField={isEnglish ? "engName" : "name"}
                                        valueField="id"
                                        placeholder={t('common.select')}
                                        value={selected}
                                        onChange={(item) => {
                                            const updated = [...selectIndustryList];
                                            updated[index] = item.id;
                                            setSelectIndustryList(updated);
                                        }}
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholder}
                                        selectedTextStyle={styles.selectedText}
                                        renderItem={(item) => (
                                            <View testID={`industry_${item.id}`}
                                            accessibilityLabel={`industry_${item.id}`}>
                                                <Text>{isEnglish ? item.engName : item.name}</Text>
                                            </View>
                                        )}
                                    />
                                </View>

                                {index > 0 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const updated = selectIndustryList.filter((_, i) => i !== index);
                                            setSelectIndustryList(updated);
                                        }}
                                    >
                                        <Ionicons name="trash-outline" size={22} color="red" style={{
                                            marginRight: 15,
                                        }} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        <TouchableOpacity
                            onPress={() => setSelectIndustryList([...selectIndustryList, null])}
                            style={{ marginHorizontal: 16, marginTop: 8 }}
                        >
                            <Text style={{ color: "#1a73e8", fontWeight: "500" }}>+ {t('postJob.addCategory')}</Text>
                        </TouchableOpacity>



                        <Text style={styles.label}>
                            {t('postJob.age')}<Text style={styles.required}>*</Text>
                        </Text>
                        {/* --- Dropdown chọn loại tuổi --- */}
                        <Dropdown
                            testID="ageTypeDropdown"
                            accessibilityLabel="ageTypeDropdown"
                            data={getEnumOptions(AgeType)}
                            labelField="label"
                            valueField="value"
                            placeholder={t('postJob.age')}
                            value={ageType}
                            onChange={(item) => setAgeType(item.value)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`ageType_${item.value}`} accessibilityLabel={`ageType_${item.value}`}>
                                    <Text>{item.label}</Text>
                                </View>
                            )}
                        />

                        {/* --- Nếu chọn “Trên” thì hiện 1 ô nhập --- */}
                        {ageType === "ABOVE" && (
                            <TextInput
                                testID="minAgeInput"
                                accessibilityLabel="minAgeInput"
                                placeholderTextColor={"#999"}
                                style={styles.input}

                                placeholder={t('postJob.minAge')}
                                keyboardType="numeric"
                                value={minAge?.toString() ?? ""}   // number -> string
                                onChangeText={(text) => {
                                    setMinAge(text ? parseFloat(text) : null);
                                }}
                            />
                        )}

                        {/* --- Nếu chọn “Dưới” thì hiện 1 ô nhập --- */}
                        {ageType === "BELOW" && (
                            <TextInput
                                testID="maxAgeInput"
                                accessibilityLabel="maxAgeInput"
                                placeholderTextColor={"#999"}
                                style={styles.input}
                                placeholder={t('postJob.maxAge')}
                                keyboardType="numeric"
                                value={maxAge?.toString() ?? ""}   // number -> string
                                onChangeText={(text) => {
                                    setMaxAge(text ? parseFloat(text) : null);
                                }}
                            />
                        )}

                        {/* --- Nếu chọn “Trong khoảng” thì hiện 2 ô nhập --- */}
                        {ageType === "INPUT" && (
                            <View style={{ flexDirection: "row", gap: 8, marginHorizontal: 16 }}>
                                <TextInput
                                    testID="minAgeInput"
                                    accessibilityLabel="minAgeInput"
                                    placeholderTextColor={"#999"}
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder={t('postJob.minAge')}
                                    keyboardType="numeric"
                                    value={minAge?.toString() ?? ""}   // number -> string
                                    onChangeText={(text) => {
                                        setMinAge(text ? parseFloat(text) : null);
                                    }}
                                />
                                <TextInput
                                    testID="maxAgeInput"
                                    accessibilityLabel="maxAgeInput"
                                    placeholderTextColor={"#999"}
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder={t('postJob.maxAge')}
                                    keyboardType="numeric"
                                    value={maxAge?.toString() ?? ""}   // number -> string
                                    onChangeText={(text) => {
                                        setMaxAge(text ? parseFloat(text) : null);
                                    }}
                                />
                            </View>
                        )}
                    </View>
                    {/* ---------- THÔNG TIN LIÊN HỆ ---------- */}
                    <View style={styles.card}>
                        <Text style={styles.title}>{t('postJob.contactInfo')}</Text>

                        <Text style={styles.label}>
                            {t('postJob.contactPerson')}<Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            testID="contactNameInput"
                            accessibilityLabel="contactNameInput"
                            placeholderTextColor={"#999"}
                            style={styles.input}
                            placeholder={t('postJob.contactPerson')}
                            value={contactName}
                            onChangeText={setContactName}
                        />

                        <Text style={styles.label}>
                            {t('postJob.contactPhone')}<Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            testID="contactPhoneInput"
                            accessibilityLabel="contactPhoneInput"
                            placeholderTextColor={"#999"}
                            style={styles.input}
                            placeholder={t('postJob.contactPhone')}
                            keyboardType="phone-pad"
                            value={contactPhone}
                            onChangeText={setContactPhone}
                        />

                        <Text style={styles.label}>
                            {t('postJob.location')}<Text style={styles.required}>*</Text>
                        </Text>
                        <Dropdown
                            testID="contactProvinceDropdown"
                            accessibilityLabel="contactProvinceDropdown"
                            data={listProvinces}
                            labelField="name"
                            valueField="id"
                            placeholder={t('postJob.selectProvince')}
                            value={contactProvinceId}
                            onChange={(item) => {
                                setContactProvinceId(item.id)
                            }}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`contactProvince_${item.id}`}
                                accessibilityLabel={`contactProvince_${item.id}`}>
                                    <Text>{item.name}</Text>
                                </View>
                            )}
                        />

                        {/* --- Quận / Huyện --- */}
                        <Dropdown
                            testID="contactDistrictDropdown"
                            accessibilityLabel="contactDistrictDropdown"
                            data={listContactDistricts
                            }
                            labelField="name"
                            valueField="id"
                            placeholder={t('postJob.selectDistrict')}
                            value={contactDistrictId}
                            onChange={(item) => setContactDistrictId(item.id)}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            renderItem={(item) => (
                                <View testID={`contactDistrict_${item.id}`}
                                    accessibilityLabel={`contactDistrict_${item.id}`}>
                                    <Text>{item.name}</Text>
                                </View>
                            )}
                        />

                        {/* --- Số nhà / Địa chỉ chi tiết --- */}
                        <TextInput
                            testID="contactDetailAddressInput"
                            accessibilityLabel="contactDetailAddressInput"
                            placeholderTextColor={"#999"}
                            style={styles.input}
                            placeholder={t('postJob.detailAddress')}
                            value={contactDetailAddress}
                            onChangeText={setContactDetailAddress}
                        />

                        <Text style={styles.label}>{t('postJob.description')}</Text>
                        <TextInput
                            testID="descriptionEditor"
                            accessibilityLabel="descriptionEditor"
                            placeholderTextColor={"#999"}
                            style={[styles.textArea]}
                            placeholder="Nhập mô tả..."
                            multiline={true}
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <Text style={styles.label}>
                            {t('postJob.expiryDate')}<Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.input, { justifyContent: "center" }]}>
                            <Text>{formatDate(expiryDate)}</Text>
                        </View>
                    </View>
                    {/* ---------- NGÔN NGỮ HỒ SƠ ỨNG VIÊN ---------- */}

                </ScrollView>
                <View style={styles.buttonRow}>

                    <TouchableOpacity testID="submitJobButton" accessibilityLabel="submitJobButton" style={styles.submitBtn} onPress={handleSubmit}>
                        <Text style={styles.submitText}>{t('postJob.submitJob')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingWrapper>
    );
};

export default PostJobScreen2;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        position: "relative",
    },
    iconButton: { padding: 8, borderRadius: 999, backgroundColor: "#f3f4f6", zIndex: 100 },
    headerTitle: {
        position: "absolute",
        left: 40, // 👈 đẩy sang phải để tránh icon Back
        right: 40,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2937",
        paddingLeft: 10, // 👈 thêm khoảng cách nhẹ bên trái // ❌ không dùng trong StyleSheet (đưa vào component)
    },
    card: {
        backgroundColor: "#ffffff",
        paddingVertical: 24,
        marginVertical: 12,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    title: { fontSize: 20, fontWeight: "600", color: "#1f2937", marginVertical: 8, paddingHorizontal: 16 },
    label: { fontSize: 14, fontWeight: "500", marginTop: 16, color: "#374151", paddingHorizontal: 16 },
    required: { color: "#ef4444" },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: "#ffffff",
        fontSize: 16,
        color: "#111827",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        height: 52,
    },
    textArea: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: "#ffffff",
        fontSize: 16,
        color: "#111827",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        height: 180,
    },
    submitBtn: {
        backgroundColor: colors.primary.start,
        borderRadius: 12,
        alignItems: "center",
        paddingVertical: 16,
        marginHorizontal: 1,
        flex: 1.5,
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    submitText: { color: "#ffffff", fontWeight: "600", fontSize: 16 },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        position: "relative",
    },
    saveBtn: {
        borderWidth: 1.5,
        borderColor: "#3b82f6",
        borderRadius: 12,
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12,
        flex: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    saveText: {
        color: "#3b82f6",
        fontWeight: "600",
        fontSize: 16,
    },
    dropdown: {
        height: 52,
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 8,
        paddingHorizontal: 16,
        marginVertical: 8,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    placeholder: {
        color: "#9ca3af",
        fontSize: 16,
    },
    selectedText: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "500",
    },


    // selectedText: {
    //   color: "#333",
    // },
    selectedItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginRight: 8,
        marginTop: 8,
        marginLeft: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedItemText: {
        color: "#1f2937",
        fontSize: 14,
        fontWeight: "500",
    },
    removeIcon: {
        marginLeft: 8,
    },
    benefitItem: {
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    benefitLabel: {
        fontWeight: "500",
        marginBottom: 6,
        color: "#374151",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
});