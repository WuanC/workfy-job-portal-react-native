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
import { AgeType, EducationLevel, ExperienceLevel, getEnumOptions, JobGender, JobLevel, JobType, LevelCompanySize, SalaryType, SalaryUnit } from "../../utilities/constant";
import { Dropdown } from "react-native-element-dropdown";
import { getAllIndustries, Industry } from "../../services/industryService";
import { getAllProvince, Province } from "../../services/provinceService";
import { District, getDistrictById, getDistrictsByProvince } from "../../services/districtService";
import { createJob, getJobById, JobRequest, updateJob } from "../../services/jobService";
import { JobLocation } from "../../types/type";

const UpdateJobScreen = ({ route }: any) => {

  const { id } = route.params as { id: number };
  const navigation = useNavigation();
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

  const richAboutCompany = useRef<RichEditor>(null);
  const richContact = useRef<RichEditor>(null);
  const richRequirement = useRef<RichEditor>(null);
  const richJobDescription = useRef<RichEditor>(null);
  useEffect(() => {
    if (richAboutCompany.current && aboutCompany) {
      richAboutCompany.current.setContentHTML(aboutCompany);
    }
  }, [aboutCompany]);
  useEffect(() => {
    if (richContact.current && description) {
      richContact.current.setContentHTML(description);
    }
  }, [description]);
  useEffect(() => {
    if (richRequirement.current && requirement) {
      richRequirement.current.setContentHTML(requirement);
    }
  }, [requirement]);
  useEffect(() => {
    if (richJobDescription.current && jobDescription) {
      richJobDescription.current.setContentHTML(jobDescription);
    }
  }, [jobDescription]);

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
      const res = await updateJob(id, jobData);
      if (res.status === 200) {
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
  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000000ff" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Sửa tin tuyển dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- THÔNG TIN CÔNG TY ---------- */}
        <Text style={styles.title}>Thông tin công ty</Text>

        <Text style={styles.label}>
          Tên công ty<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="VD: NPT Software"
          value={companyName}
          onChangeText={setCompanyName}
        />

        <Text style={styles.label}>
          Số nhân viên<Text style={styles.required}>*</Text>
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
          style={styles.input}
          placeholder="VD: https://nptsoftware.vn"
          value={companyWebSite}
          onChangeText={setCompanyWebSite}
        />

        <Text style={styles.label}>
          Sơ lược công ty<Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.richContainer}>
          <RichToolbar
            editor={richAboutCompany}
            actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList]}
            style={styles.toolbar}
          />
          <RichEditor
            ref={richAboutCompany}
            placeholder="Giới thiệu ngắn gọn về công ty..."
            style={styles.richEditor}
            initialHeight={150}
            onChange={setAboutCompany}
            initialContentHTML={aboutCompany}
          />
        </View>

        {/* ---------- THÔNG TIN CÔNG VIỆC ---------- */}
        <Text style={styles.title}>Thông tin công việc</Text>

        <Text style={styles.label}>
          Tên công việc<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
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
              style={[styles.input, { flex: 1 }]}
              placeholder="Min"
              keyboardType="numeric"
              value={minSalary?.toString() ?? ""}   // number -> string
              onChangeText={(text) => {
                setMinSalary(text ? parseFloat(text) : null);
              }}
            />
            <TextInput
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
        <View style={styles.richContainer}>
          <RichToolbar
            editor={richJobDescription}
            actions={[actions.setBold, actions.setItalic, actions.setUnderline]}
            style={styles.toolbar}
          />
          <RichEditor
            ref={richJobDescription}
            placeholder="Thông tin mô tả chi tiết..."
            style={styles.richEditor}
            initialHeight={120}
            onChange={setJobDescription}
            initialContentHTML={jobDescription}
          />
        </View>

        <Text style={styles.label}>Yêu cầu công việc</Text>
        <View style={styles.richContainer}>
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
        </View>

        {/* ---------- CHI TIẾT CÔNG VIỆC ---------- */}
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
              marginHorizontal: 16,
              marginTop: 6,
              gap: 8,
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
                <Ionicons name="trash-outline" size={22} color="red" />
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


        <Text style={styles.label}>Từ khóa</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: React Native, Frontend, Mobile App..."
        />

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
              style={[styles.input, { flex: 1 }]}
              placeholder="Từ tuổi"
              keyboardType="numeric"
              value={minAge?.toString() ?? ""}   // number -> string
              onChangeText={(text) => {
                setMinAge(text ? parseFloat(text) : null);
              }}
            />
            <TextInput
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
        {/* ---------- THÔNG TIN LIÊN HỆ ---------- */}
        <Text style={styles.title}>Thông tin liên hệ</Text>

        <Text style={styles.label}>
          Người liên hệ<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="VD: Lê Hữu Nam"
          value={contactName}
          onChangeText={setContactName}
        />

        <Text style={styles.label}>
          Điện thoại liên lạc<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
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
          style={styles.input}
          placeholder="VD: 123 Nguyễn Trãi, Phường 5"
          value={contactDetailAddress}
          onChangeText={setContactDetailAddress}
        />

        <Text style={styles.label}>Mô tả</Text>
        <View style={styles.richContainer}>
          <RichToolbar
            editor={richContact}
            actions={[actions.setBold, actions.setItalic, actions.setUnderline]}
            style={styles.toolbar}
          />
          <RichEditor
            ref={richContact}
            placeholder="Thông tin mô tả chi tiết..."
            style={styles.richEditor}
            initialHeight={120}
            onChange={setDescription}
            initialContentHTML={description}
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

        {/* ---------- NGÔN NGỮ HỒ SƠ ỨNG VIÊN ---------- */}
        {/* <Text style={styles.title}>Ngôn ngữ nhận hồ sơ ứng viên</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={language} onValueChange={setLanguage}>
            <Picker.Item label="Vui lòng chọn" value="" />
            <Picker.Item label="Tiếng Việt" value="vi" />
            <Picker.Item label="Tiếng Anh" value="en" />
            <Picker.Item label="Song ngữ Việt - Anh" value="both" />
          </Picker>
        </View> */}

        {/* ---------- NÚT SUBMIT ---------- */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Đã lưu nháp!")}>
            <Text style={styles.saveText}>Lưu việc làm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Đăng công việc</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateJobScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#000000ff", fontSize: 18, fontWeight: "bold" },
  title: { fontSize: 20, fontWeight: "700", color: "#1a73e8", marginVertical: 16, paddingHorizontal: 16 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 14, color: "#333", paddingHorizontal: 16 },
  required: { color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 6,
  },
  richContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  toolbar: { borderBottomWidth: 1, borderColor: "#ddd", backgroundColor: "#f5f5f5" },
  richEditor: { padding: 10, minHeight: 150, backgroundColor: "#fff" },
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
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    backgroundColor: "#faf5f5ff",
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
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
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

});
