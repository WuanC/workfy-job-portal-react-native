import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { useNavigation } from "@react-navigation/native";
import { AgeType, BenefitType, EducationLevel, ExperienceLevel, getEnumOptions, JobGender, JobLevel, JobType, LevelCompanySize, SalaryType, SalaryUnit } from "../../utilities/constant";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { getAllIndustries, Industry } from "../../services/industryService";
import { getAllProvince, Province } from "../../services/provinceService";
import { District, getDistrictById, getDistrictsByProvince } from "../../services/districtService";
import { Benefit, createJob, JobRequest } from "../../services/jobService";
import { JobLocation } from "../../types/type";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getEmployerProfile } from "../../services/employerService";

const PostJobScreen = () => {
  const navigation = useNavigation();
  //--RichEditor
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


  // --- Editor ---




  // --- Hàm submit ---
  const handleSubmit = async () => {
    try {
      // ======== 1️⃣ VALIDATE CÁC TRƯỜNG BẮT BUỘC ========
      if (!companyName.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập tên công ty");
        return;
      }
      if (!companySize) {
        Alert.alert("Thiếu thông tin", "Vui lòng chọn quy mô công ty");
        return;
      }
      if (!aboutCompany.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập mô tả công ty");
        return;
      }
      if (!jobDistrictdId) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập tên district");
        return;
      }
      if (!jobTitle.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập tên công việc");
        return;
      }
      if (!salaryType) {
        Alert.alert("Thiếu thông tin", "Vui lòng chọn loại lương");
        return;
      }
      if (benefits.length <= 0) {
        Alert.alert("Sai định dạng", "Phúc lợi không được để trống");
        return;
      }
      if (salaryType === "RANGE" && (!minSalary || !maxSalary || minSalary >= maxSalary)) {
        Alert.alert("Sai định dạng", "Vui lòng nhập mức lương hợp lệ (Min < Max)");
        return;
      }
      if (salaryType === "GREATER_THAN" && !minSalary) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập mức lương tối thiểu");
        return;
      }
      if (!jobDescription.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập mô tả công việc");
        return;
      }
      if (!requirement.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập yêu cầu công việc");
        return;
      }
      if (!contactName.trim() || !contactPhone.trim()) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập người liên hệ và số điện thoại");
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
      console.log("📦 jobData gửi lên:", JSON.stringify(jobData, null, 2));
      const res = await createJob(jobData);
      if (res.status === 201) {
        Alert.alert("🎉 Thành công", "Công việc đã được đăng!");
        navigation.goBack()
      } else {
        Alert.alert("Lỗi", res.message || "Không thể đăng công việc.");
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

  // --- Xử lý chọn ngày hết hạn ---
  const handleConfirm = (date: Date) => {
    setExpiryDate(date);
    setDatePickerVisibility(false);
  };

  // --- Hàm ẩn DatePicker ---
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
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
        const info = await getEmployerProfile(); // gọi service bạn đã viết
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
          Đăng tin tuyển dụng
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- THÔNG TIN CÔNG TY ---------- */}
        <View style={styles.card}>
          <Text style={styles.title}>Thông tin công ty</Text>

          <Text style={styles.label}>
            Tên công ty<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor={"#999"}
            style={styles.input}
            placeholder="VD: NPT Software"
            value={companyName}
            onChangeText={setCompanyName}
          />

          <Text style={styles.label}>
            Số nhân viên<Text style={styles.required}> *</Text>
          </Text>
          <Dropdown
            data={getEnumOptions(LevelCompanySize)}
            labelField="label"
            valueField="value"
            placeholder="Chọn số nhân viên"
            value={companySize}
            onChange={(item) => setCompanySize(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          <Text style={styles.label}>Website công ty</Text>
          <TextInput
            placeholderTextColor={"#999"}
            style={styles.input}
            placeholder="VD: https://nptsoftware.vn"
            value={companyWebSite}
            onChangeText={setCompanyWebSite}
          />

          <Text style={styles.label}>
            Sơ lược công ty<Text style={styles.required}> *</Text>
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
              placeholder="Nhập yêu cầu công việc..."
              initialHeight={180}
              editorInitializedCallback={() => handleEditorReady("aboutCompany")}
              onChange={(html) => setAboutCompany(html)}
            />
          </View>
        </View>


        {/* ---------- THÔNG TIN CÔNG VIỆC ---------- */}
        <View style={styles.card}>
          <Text style={styles.title}>Thông tin công việc</Text>

          <Text style={styles.label}>
            Tên công việc<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor={"#999"}
            style={styles.input}
            placeholder="VD: Lập trình viên React Native"
            value={jobTitle}
            onChangeText={setJobTitle}
          />

          <Text style={styles.label}>
            Địa điểm<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={listProvinces}
            labelField="name"
            valueField="id"
            placeholder="Chọn Tỉnh / Thành phố"
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
            placeholder="Chọn Quận / Huyện"
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
            placeholderTextColor={"#999"}
            style={styles.input}
            placeholder="VD: 123 Nguyễn Trãi, Phường 5"
            value={jobDetailAddress}
            onChangeText={setJobDetailAddress}
          />

          <Text style={styles.label}>
            Lương<Text style={styles.required}>*</Text>
          </Text>

          {/* --- Dropdown chọn loại lương --- */}
          <Dropdown
            data={getEnumOptions(SalaryType)}
            labelField="label"
            valueField="value"
            placeholder="Chọn mức lương"
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

          <Text style={styles.label}>Mô tả công việc</Text>
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
              placeholder="Nhập yêu cầu công việc..."
              initialHeight={180}
              editorInitializedCallback={() => handleEditorReady("jobDescription")}
              onChange={(html) => setJobDescription(html)}
            />
          </View>


          <Text style={styles.label}>Yêu cầu công việc</Text>

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
              placeholder="Nhập yêu cầu công việc..."
              initialHeight={180}
              editorInitializedCallback={() => handleEditorReady("requirement")}
              onChange={(html) => setRequirement(html)}
            />
          </View>
          <Text style={styles.label}>
            Phúc lợi<Text style={styles.required}>*</Text>
          </Text>

          <MultiSelect
            data={getEnumOptions(BenefitType)}
            labelField="label"
            valueField="value"
            placeholder="Chọn phúc lợi"
            value={benefits.map((b) => b.type)} // mảng các value đã chọn
            onChange={(selectedValues) => {
              const selectedBenefits = selectedValues.map((val) => ({
                type: val,
                description: BenefitType[val as keyof typeof BenefitType],
              }));
              setBenefits(selectedBenefits);
            }}
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            activeColor="#f0f0f0"
            search
            searchPlaceholder="Tìm phúc lợi..."
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
        </View>
        {/* ---------- CHI TIẾT CÔNG VIỆC ---------- */}
        <View style={styles.card}>
          <Text style={styles.title}>Chi tiết công việc</Text>

          <Text style={styles.label}>
            Trình độ học vấn<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={getEnumOptions(EducationLevel)}
            labelField="label"
            valueField="value"
            placeholder="Chọn trình độ học vấn"
            value={education}
            onChange={(item) => setEducation(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          <Text style={styles.label}>
            Mức kinh nghiệm<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={getEnumOptions(ExperienceLevel)}
            labelField="label"
            valueField="value"
            placeholder="Chọn kinh nghiệm làm việc"
            value={experience}
            onChange={(item) => setExperience(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          <Text style={styles.label}>
            Cấp bậc<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={getEnumOptions(JobLevel)}
            labelField="label"
            valueField="value"
            placeholder="Chọn cấp bậc"
            value={jobLevel}
            onChange={(item) => setJobLevel(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          <Text style={styles.label}>
            Loại công việc<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={getEnumOptions(JobType)}
            labelField="label"
            valueField="value"
            placeholder="Chọn loại công việc"
            value={jobType}
            onChange={(item) => setJobType(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          <Text style={styles.label}>
            Giới tính<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={getEnumOptions(JobGender)}
            labelField="label"
            valueField="value"
            placeholder="Chọn giới tính"
            value={jobGender}
            onChange={(item) => setJobGender(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />


          <Text style={styles.label}>Mã việc làm</Text>
          <TextInput
            placeholderTextColor={"#999"}
            style={styles.input}
            placeholder="VD: RN-2025-01"
            value={jobCode}
            onChangeText={(text) => setJobCode(text)}
          />

          <Text style={styles.label}>
            Ngành nghề<Text style={styles.required}>*</Text>
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
                  data={industries}
                  labelField="name"
                  valueField="id"
                  placeholder="Vui lòng chọn"
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
            <Text style={{ color: "#1a73e8", fontWeight: "500" }}>+ Thêm danh mục</Text>
          </TouchableOpacity>



          <Text style={styles.label}>
            Tuổi<Text style={styles.required}>*</Text>
          </Text>
          {/* --- Dropdown chọn loại tuổi --- */}
          <Dropdown
            data={getEnumOptions(AgeType)}
            labelField="label"
            valueField="value"
            placeholder="Chọn điều kiện độ tuổi"
            value={ageType}
            onChange={(item) => setAgeType(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          {/* --- Nếu chọn “Trên” thì hiện 1 ô nhập --- */}
          {ageType === "ABOVE" && (
            <TextInput
              placeholderTextColor={"#999"}
              style={styles.input}

              placeholder="Nhập độ tuổi tối thiểu"
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
              placeholderTextColor={"#999"}
              style={styles.input}
              placeholder="Nhập độ tuổi tối đa"
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
                placeholderTextColor={"#999"}
                style={[styles.input, { flex: 1 }]}
                placeholder="Từ tuổi"
                keyboardType="numeric"
                value={minAge?.toString() ?? ""}   // number -> string
                onChangeText={(text) => {
                  setMinAge(text ? parseFloat(text) : null);
                }}
              />
              <TextInput
                placeholderTextColor={"#999"}
                style={[styles.input, { flex: 1 }]}
                placeholder="Đến tuổi"
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
          <Text style={styles.title}>Thông tin liên hệ</Text>

          <Text style={styles.label}>
            Người liên hệ<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor={"#999"}
            style={styles.input}
            placeholder="VD: Lê Hữu Nam"
            value={contactName}
            onChangeText={setContactName}
          />

          <Text style={styles.label}>
            Điện thoại liên lạc<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor={"#999"}
            style={styles.input}
            placeholder="VD: 0905 123 456"
            keyboardType="phone-pad"
            value={contactPhone}
            onChangeText={setContactPhone}
          />

          <Text style={styles.label}>
            Địa điểm<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            data={listProvinces}
            labelField="name"
            valueField="id"
            placeholder="Chọn Tỉnh / Thành phố"
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
            placeholder="Chọn Quận / Huyện"
            value={contactDistrictdId}
            onChange={(item) => setContactDistrictId(item.id)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          {/* --- Số nhà / Địa chỉ chi tiết --- */}
          <TextInput
            placeholderTextColor={"#999"}
            style={styles.input}
            placeholder="VD: 123 Nguyễn Trãi, Phường 5"
            value={contactDetailAddress}
            onChangeText={setContactDetailAddress}
          />

          <Text style={styles.label}>Mô tả</Text>
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
              placeholder="Nhập yêu cầu công việc..."
              initialHeight={180}
              editorInitializedCallback={() => handleEditorReady("description")}
              onChange={(html) => setDescription(html)}
            />
          </View>


          {/* ---------- PHÂN CÔNG THÀNH VIÊN ----------
        <Text style={styles.title}>Phân công thành viên</Text>

        <Text style={styles.label}>Thành viên được phân công</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={assignedMember} onValueChange={setAssignedMember}>
            <Picker.Item label="Chọn thành viên" value="" />
            <Picker.Item label="Nguyễn Văn A" value="a" />
            <Picker.Item label="Trần Thị B" value="b" />
            <Picker.Item label="Lê Văn C" value="c" />
          </Picker>
        </View>

        <Text style={styles.label}>Thêm email nhận thông báo</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: notify@nptsoftware.vn"
          value={notifyEmail}
          onChangeText={setNotifyEmail}
        />

        {/* ---------- NGÀY ĐĂNG ---------- */}
          {/* <Text style={styles.title}>Ngày đăng</Text>
        <Text style={styles.label}>
          Ngày đăng<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={postDate.toLocaleDateString("vi-VN")}
          editable={false}
        /> */}

          <Text style={styles.label}>
            Ngày hết hạn<Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.input}>
            <Text>{formatDate(expiryDate)}</Text>
          </TouchableOpacity>

          {/* --- Modal chọn ngày --- */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={expiryDate}
          />
        </View>
        {/* ---------- NGÔN NGỮ HỒ SƠ ỨNG VIÊN ---------- */}

      </ScrollView>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Đã lưu nháp!")}>
          <Text style={styles.saveText}>Lưu việc làm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Đăng công việc</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostJobScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  iconButton: { padding: 8, borderRadius: 8, zIndex: 100 },
  headerTitle: {
    position: "absolute",
    left: 40, // 👈 đẩy sang phải để tránh icon Back
    right: 40,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#075985",
    paddingLeft: 10, // 👈 thêm khoảng cách nhẹ bên trái // ❌ không dùng trong StyleSheet (đưa vào component)
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#075985", marginVertical: 5, paddingHorizontal: 10 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 14, color: "#000000ff", paddingHorizontal: 10 },
  required: { color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 10,
    marginVertical: 6,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#333",
    elevation: 1,
    height: 50,
  },
  submitBtn: {
    backgroundColor: "#1a73e8",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
    marginHorizontal: 1,
    flex: 1.5,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 10,
    position: "relative",
  },
  saveBtn: {
    borderWidth: 1.5,
    borderColor: "#1a73e8",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    flex: 1,
  },
  saveText: {
    color: "#1a73e8",
    fontWeight: "600",
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 6,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    elevation: 1,
  },
  placeholder: {
    color: "#999",
    fontSize: 15,
  },
  selectedText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
  },


  // selectedText: {
  //   color: "#333",
  // },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#dcdde1",
    marginRight: 8,
    marginTop: 8,
    marginLeft: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    elevation: 1,
  },
  selectedItemText: {
    color: "#2f3640",
    fontSize: 14,
    fontWeight: "500",
  },
  removeIcon: {
    marginLeft: 6,
  },
  //rich editor
  editorWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 10,
    marginVertical: 6,
  },
  toolbar: {
    backgroundColor: "#F7F9FC",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EB",
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 44,
  },
  editor: {
    minHeight: 180,
    padding: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#FFFFFF",
  },

});
