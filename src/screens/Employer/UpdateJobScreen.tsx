import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AgeType, BenefitType, EducationLevel, ExperienceLevel, getEnumOptions, JobGender, JobLevel, JobType, LevelCompanySize, SalaryType, SalaryUnit } from "../../utilities/constant";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { getAllIndustries, Industry } from "../../services/industryService";
import { getAllProvince, Province } from "../../services/provinceService";
import { District, getDistrictById, getDistrictsByProvince } from "../../services/districtService";
import { Benefit, createJob, getJobById, JobRequest, updateJob } from "../../services/jobService";
import { validateField } from "../../utilities/validation";
import { JobLocation } from "../../types/type";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";
import { colors } from "../../theme";
import { useI18n } from "../../hooks/useI18n";

const UpdateJobScreen = ({ route }: any) => {

  const { id } = route.params as { id: number };

  const navigation = useNavigation();
  const { t, isEnglish } = useI18n();
  const richRefs = {
    aboutCompany: useRef<RichEditor>(null),
    description: useRef<RichEditor>(null),
    requirement: useRef<RichEditor>(null),
    jobDescription: useRef<RichEditor>(null),
  };

  const [editorsReady, setEditorsReady] = useState({
    aboutCompany: false,
    description: false,
    requirement: false,
    jobDescription: false,
  });

  const initialLoads = {
    aboutCompany: useRef(true),
    description: useRef(true),
    requirement: useRef(true),
    jobDescription: useRef(true),
  };
  //-- Province
  const [listProvinces, setListProvinces] = useState<Province[]>([])

  // --- Thông tin công ty ---
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyWebSite, setCompanyWebSite] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");

  // --- Thông tin công việc ---
  const [jobTitle, setJobTitle] = useState("");
  const [jobProvincedId, setJobProvinceId] = useState<number | null>(null);
  const [jobDistrictdId, setJobDistrictId] = useState<number | null>(null);

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
  const [contactDistrictdId, setContactDistrictId] = useState<number | null>(null);
  const [contactDetailAddress, setContactDetailAddress] = useState("");
  const [description, setDescription] = useState("");

  const [listContactDistricts, setListContactDistrict] = useState<District[]>([])



  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);



  // --- Hàm submit ---
  const handleSubmit = async () => {
    try {
      // ======== 1️⃣ VALIDATE CÁC TRƯỜNG BẮT BUỘC ========
      if (!companyName.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.companyNameRequired'));
        return;
      }
      if (!companySize) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.companySizeRequired'));
        return;
      }
      if (!aboutCompany.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.aboutCompanyRequired'));
        return;
      }
      if (!jobDistrictdId) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.districtRequired'));
        return;
      }
      if (!jobTitle.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.jobTitleRequired'));
        return;
      }
      if (!salaryType) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.salaryTypeRequired'));
        return;
      }
      if (salaryType === "RANGE" && (!minSalary || !maxSalary || minSalary >= maxSalary)) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.salaryRangeInvalid'));
        return;
      }
      if (benefits.length <= 0) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.benefitsRequired'));
        return;
      }
      if (salaryType === "GREATER_THAN" && !minSalary) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.minSalaryRequired'));
        return;
      }
      if (!jobDescription.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.jobDescriptionRequired'));
        return;
      }
      if (!requirement.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.requirementRequired'));
        return;
      }
      if (!contactName.trim() || !contactPhone.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), t('validation.contactRequired'));
        return;
      }

      // validate phone
      const phoneErr = validateField(contactPhone || "", "phone");
      if (phoneErr) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('common.error'), phoneErr);
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
            provinceId: jobProvincedId ?? -1,
            districtId: jobDistrictdId ?? -1,
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
          districtId: contactDistrictdId!,
          detailAddress: contactDetailAddress || "",
        },
        description: description || undefined,
        expirationDate: formatDate(expiryDate)
      };
      // ======== 3️⃣ GỌI API ========
      //console.log("📦 jobData gửi lên:", JSON.stringify(jobData, null, 2));
      const res = await updateJob(id, jobData);
      if (res.status === 200) {
        const { ToastService } = require("../../services/toastService");
        ToastService.success(t('common.success'), t('messages.updateSuccess'));
        setTimeout(() => navigation.goBack(), 900);
      } else {
        const { ToastService } = require("../../services/toastService");
        ToastService.error("Lỗi", res.message || "Không thể đăng công việc.");
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
        const job = await getJobById(id);
        const data = await getAllIndustries();
        const listProvinces = await getAllProvince(); // gọi service bạn đã viết
        if (cancelled) return;

        setIndustries(data);
        setListProvinces(listProvinces)

        setCompanyName(job.companyName || "");
        setCompanySize(job.companySize || "");
        setCompanyWebSite(job.companyWebsite || "");
        setAboutCompany(job.aboutCompany || "");

        setJobTitle(job.jobTitle || "");
        setSalaryType(job.salaryType || "");
        setMinSalary(job.minSalary || null);
        setMaxSalary(job.maxSalary || null);
        setSalaryUnit(job.salaryUnit || "");

        setJobDescription(job.jobDescription || "");
        setRequirement(job.requirement || "");
        setBenefits(job.jobBenefits || [])

        setEducation(job.educationLevel || "");
        setExperience(job.experienceLevel || "");
        setJobLevel(job.jobLevel || "");
        setJobType(job.jobType || "");
        setJobGender(job.gender || "");
        setJobCode(job.jobCode || "");
        setAgeType(job.ageType || "");
        setMinAge(job.minAge || null);
        setMaxAge(job.maxAge || null);
        setDescription(job.description || "");

        // --- Ngành nghề ---
        if (job.industries && job.industries.length > 0) {
          setSelectIndustryList(job.industries.map((i: any) => i.id));
        }


        // --- Địa chỉ làm việc ---
        if (job.jobLocations && job.jobLocations.length > 0) {
          const loc = job.jobLocations[0];
          setJobProvinceId(loc.province?.id || null);
          setJobDistrictId(loc.district?.id || null);
          setJobDetailAddress(loc.detailAddress || "");
        }

        // --- Liên hệ ---
        setContactName(job.contactPerson || "");
        setContactPhone(job.phoneNumber || "");
        if (job.contactLocation) {
          setContactProvinceId(job.contactLocation.province?.id || null);
          setContactDistrictId(job.contactLocation.district?.id || null);
          setContactDetailAddress(job.contactLocation.detailAddress || "");
        }

        // --- Ngày hết hạn ---
        if (job.expirationDate) {
          // Backend trả ISO date → chuyển sang Date object
          setExpiryDate(new Date(job.expirationDate));
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error("Lỗi load", err);
      } finally {
        if (!cancelled) { }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (jobProvincedId) {
      (async () => {
        try {
          const data = await getDistrictsByProvince(jobProvincedId);
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
  }, [jobProvincedId]);

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

  const handleEditorReady = (key: keyof typeof editorsReady) => {
    setEditorsReady((prev) => ({ ...prev, [key]: true }));
  };
  const data = {
    aboutCompany,
    description,
    requirement,
    jobDescription,
  };
  // ⚙️ Dùng chung 1 useEffect duy nhất để cập nhật tất cả editor
  useEffect(() => {
    Object.keys(richRefs).forEach((key) => {
      const k = key as keyof typeof editorsReady;
      const editorReady = editorsReady[k];
      const htmlValue = data[k];
      const ref = richRefs[k];
      const isFirst = initialLoads[k];

      if (editorReady && htmlValue && isFirst.current) {
        ref.current?.setContentHTML(htmlValue);
        isFirst.current = false;
      }
    });
  }, [editorsReady, data]);
  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#000000ff" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>{t('job.postJob')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ---------- THÔNG TIN CÔNG TY ---------- */}
          <View style={styles.card}>
            <Text style={styles.title}>{t('postJob.companyInfo')}</Text>

            <Text style={styles.label}>
              {t('postJob.companyName')}<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('postJob.companyName')}
              value={companyName}
              onChangeText={setCompanyName}
            />

            <Text style={styles.label}>
              {t('postJob.companySize')}<Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              data={getEnumOptions(LevelCompanySize)}
              labelField="label"
              valueField="value"
              placeholder={t('postJob.companySize')}
              value={companySize}
              onChange={(item) => setCompanySize(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            <Text style={styles.label}>{t('postJob.companyWebsite')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('postJob.companyWebsite')}
              value={companyWebSite}
              onChangeText={setCompanyWebSite}
            />

            <Text style={styles.label}>
              {t('postJob.aboutCompany')}<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.editorWrapper}>
              <RichToolbar
                editor={richRefs.aboutCompany}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.alignLeft,
                  actions.alignCenter,
                  actions.alignRight,
                  actions.alignFull,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.undo,
                  actions.redo,
                ]}
                iconTint="#555"
                selectedIconTint="#007AFF"
                selectedButtonStyle={{ backgroundColor: "#EAF2FF", borderRadius: 6 }}
                style={styles.toolbar}
                iconSize={18}
              />

              <RichEditor
                ref={richRefs.aboutCompany}
                style={styles.editor}
                placeholder={t('postJob.aboutCompany')}
                initialHeight={180}
                editorInitializedCallback={() => handleEditorReady("aboutCompany")}
                onChange={(html) => setAboutCompany(html)}
              />
            </View>
          </View>
          {/* ---------- THÔNG TIN CÔNG VIỆC ---------- */}
          <View style={styles.card}>
            <Text style={styles.title}>{t('postJob.jobInfo')}</Text>

            <Text style={styles.label}>
              {t('postJob.jobTitle')}<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('postJob.jobTitle')}
              value={jobTitle}
              onChangeText={setJobTitle}
            />

            <Text style={styles.label}>
              {t('postJob.location')}<Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              data={listProvinces}
              labelField="name"
              valueField="id"
              placeholder={t('postJob.selectProvince')}
              value={jobProvincedId}
              onChange={(item) => {
                setJobProvinceId(item.id)
              }}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            {/* --- Quận / Huyện --- */}
            <Dropdown
              data={listJobDistricts}
              labelField="name"
              valueField="id"
              placeholder={t('postJob.selectDistrict')}
              value={jobDistrictdId}
              onChange={(item) => {
                console.log(item.id)
                setJobDistrictId(item.id)
              }}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            {/* --- Số nhà / Địa chỉ chi tiết --- */}
            <TextInput
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
            />

            {/* --- Nếu chọn “Trên” --- */}
            {salaryType === "GREATER_THAN" && (
              <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 16, gap: 8 }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder={t('postJob.minSalary')}
                  keyboardType="numeric"
                  value={minSalary?.toString() ?? ""}   // number -> string
                  onChangeText={(text) => {
                    setMinSalary(text ? parseFloat(text) : null);
                  }}
                />
                <Dropdown
                  data={getEnumOptions(SalaryUnit)}
                  labelField="label"
                  valueField="value"
                  placeholder="Đơn vị"
                  value={salaryUnit}
                  onChange={(item) => setSalaryUnit(item.value)}
                  style={[styles.dropdown, { flex: 1 }]}
                  placeholderStyle={styles.placeholder}
                  selectedTextStyle={styles.selectedText}
                />
              </View>
            )}

            {/* --- Nếu chọn “Trong khoảng” --- */}
            {salaryType === "RANGE" && (
              <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 16, gap: 8 }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder={t('postJob.minSalary')}
                  keyboardType="numeric"
                  value={minSalary?.toString() ?? ""}   // number -> string
                  onChangeText={(text) => {
                    setMinSalary(text ? parseFloat(text) : null);
                  }}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder={t('postJob.maxSalary')}
                  keyboardType="numeric"
                  value={maxSalary?.toString() ?? ""}   // number -> string
                  onChangeText={(text) => {
                    setMaxSalary(text ? parseFloat(text) : null);
                  }}
                />
                <Dropdown
                  data={getEnumOptions(SalaryUnit)}
                  labelField="label"
                  valueField="value"
                  placeholder="Đơn vị"
                  value={salaryUnit}
                  onChange={(item) => setSalaryUnit(item.value)}
                  style={[styles.dropdown, { flex: 1 }]}
                  placeholderStyle={styles.placeholder}
                  selectedTextStyle={styles.selectedText}
                />
              </View>
            )}

            <Text style={styles.label}>{t('postJob.jobDescription')}</Text>
            <View style={styles.editorWrapper}>
              <RichToolbar
                editor={richRefs.jobDescription}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.alignLeft,
                  actions.alignCenter,
                  actions.alignRight,
                  actions.alignFull,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.undo,
                  actions.redo,
                ]}
                iconTint="#555"
                selectedIconTint="#007AFF"
                selectedButtonStyle={{ backgroundColor: "#EAF2FF", borderRadius: 6 }}
                style={styles.toolbar}
                iconSize={18}
              />

              <RichEditor
                ref={richRefs.jobDescription}
                style={styles.editor}
                placeholder={t('postJob.jobDescription')}
                initialHeight={180}
                editorInitializedCallback={() => handleEditorReady("jobDescription")}
                onChange={(html) => setJobDescription(html)}
              />
            </View>

            <Text style={styles.label}>{t('postJob.requirement')}</Text>

            <View style={styles.editorWrapper}>
              <RichToolbar
                editor={richRefs.requirement}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.alignLeft,
                  actions.alignCenter,
                  actions.alignRight,
                  actions.alignFull,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.undo,
                  actions.redo,
                ]}
                iconTint="#555"
                selectedIconTint="#007AFF"
                selectedButtonStyle={{ backgroundColor: "#EAF2FF", borderRadius: 6 }}
                style={styles.toolbar}
                iconSize={18}
              />

              <RichEditor
                ref={richRefs.requirement}
                style={styles.editor}
                placeholder={t('postJob.requirement')}
                initialHeight={180}
                editorInitializedCallback={() => handleEditorReady("requirement")}
                onChange={(html) => setRequirement(html)}
              />
            </View>
            {/* <View style={styles.richContainer}>
          <RichToolbar
            editor={richRequirement}
            actions={[actions.setBold, actions.setItalic, actions.setUnderline]}
            style={styles.toolbar}
          />
          <RichEditor
            ref={richRequirement}
            placeholder="Thông tin mô tả chi tiết..."
            style={styles.richEditor}
            initialHeight={120}
            onChange={setRequirement}
            initialContentHTML={requirement}
          />
        </View> */}
            {/* <View style={styles.textAreaContainer}>
          <TextInput
            value={requirement}
            onChangeText={setRequirement}
            placeholder="Thông tin mô tả chi tiết..."
            multiline
            textAlignVertical="top"
            style={styles.textArea}
          />
        </View> */}
            <Text style={styles.label}>
              {t('postJob.benefits')}<Text style={styles.required}>*</Text>
            </Text>

            <MultiSelect
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
              renderSelectedItem={(item, unSelect) => (
                <View style={styles.selectedItem}>
                  <Text style={styles.selectedItemText}>{item.label}</Text>
                  <Ionicons
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
              data={getEnumOptions(EducationLevel)}
              labelField="label"
              valueField="value"
              placeholder={t('postJob.education')}
              value={education}
              onChange={(item) => setEducation(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            <Text style={styles.label}>
              {t('postJob.experience')}<Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              data={getEnumOptions(ExperienceLevel)}
              labelField="label"
              valueField="value"
              placeholder={t('postJob.experience')}
              value={experience}
              onChange={(item) => setExperience(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            <Text style={styles.label}>
              {t('postJob.jobLevel')}<Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              data={getEnumOptions(JobLevel)}
              labelField="label"
              valueField="value"
              placeholder={t('postJob.jobLevel')}
              value={jobLevel}
              onChange={(item) => setJobLevel(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            <Text style={styles.label}>
              {t('postJob.jobType')}<Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              data={getEnumOptions(JobType)}
              labelField="label"
              valueField="value"
              placeholder={t('postJob.jobType')}
              value={jobType}
              onChange={(item) => setJobType(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            <Text style={styles.label}>
              {t('postJob.gender')}<Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              data={getEnumOptions(JobGender)}
              labelField="label"
              valueField="value"
              placeholder={t('postJob.gender')}
              value={jobGender}
              onChange={(item) => setJobGender(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />


            <Text style={styles.label}>{t('postJob.jobCode')}</Text>
            <TextInput
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
                  marginHorizontal: 16,
                  marginTop: 6,
                  gap: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Dropdown
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
                  />
                </View>

                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      const updated = selectIndustryList.filter((_, i) => i !== index);
                      setSelectIndustryList(updated);
                    }}
                  >
                    <Ionicons name="trash-outline" size={22} color="red" />
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


            <Text style={styles.label}>{t('postJob.keywords')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('postJob.keywords')}
            />

            <Text style={styles.label}>
              {t('postJob.age')}<Text style={styles.required}>*</Text>
            </Text>
            {/* --- Dropdown chọn loại tuổi --- */}
            <Dropdown
              data={getEnumOptions(AgeType)}
              labelField="label"
              valueField="value"
              placeholder={t('postJob.age')}
              value={ageType}
              onChange={(item) => setAgeType(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            {/* --- Nếu chọn “Trên” thì hiện 1 ô nhập --- */}
            {ageType === "ABOVE" && (
              <TextInput
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
                  style={[styles.input, { flex: 1 }]}
                  placeholder={t('postJob.minAge')}
                  keyboardType="numeric"
                  value={minAge?.toString() ?? ""}   // number -> string
                  onChangeText={(text) => {
                    setMinAge(text ? parseFloat(text) : null);
                  }}
                />
                <TextInput
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
              style={styles.input}
              placeholder={t('postJob.contactPerson')}
              value={contactName}
              onChangeText={setContactName}
            />

            <Text style={styles.label}>
              {t('postJob.contactPhone')}<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
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
            />

            {/* --- Quận / Huyện --- */}
            <Dropdown
              data={listContactDistricts
              }
              labelField="name"
              valueField="id"
              placeholder={t('postJob.selectDistrict')}
              value={contactDistrictdId}
              onChange={(item) => setContactDistrictId(item.id)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            {/* --- Số nhà / Địa chỉ chi tiết --- */}
            <TextInput
              style={styles.input}
              placeholder={t('postJob.detailAddress')}
              value={contactDetailAddress}
              onChangeText={setContactDetailAddress}
            />

            <Text style={styles.label}>{t('postJob.description')}</Text>
            <View style={styles.editorWrapper}>
              <RichToolbar
                editor={richRefs.description}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.alignLeft,
                  actions.alignCenter,
                  actions.alignRight,
                  actions.alignFull,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.undo,
                  actions.redo,
                ]}
                iconTint="#555"
                selectedIconTint="#007AFF"
                selectedButtonStyle={{ backgroundColor: "#EAF2FF", borderRadius: 6 }}
                style={styles.toolbar}
                iconSize={18}
              />

              <RichEditor
                ref={richRefs.description}
                style={styles.editor}
                placeholder={t('postJob.description')}
                initialHeight={180}
                editorInitializedCallback={() => handleEditorReady("description")}
                onChange={(html) => {
                  setDescription(html)
                }
                }
              />
            </View>

            <Text style={styles.label}>
              {t('postJob.expiryDate')}<Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.input, { justifyContent: "center" }]}>
              <Text>{formatDate(expiryDate)}</Text>
            </View>

          </View>


        </ScrollView>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>{t('postJob.updateJob')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default UpdateJobScreen;

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
  //rich editor
  editorWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  toolbar: {
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 48,
  },
  editor: {
    minHeight: 200,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
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

});

