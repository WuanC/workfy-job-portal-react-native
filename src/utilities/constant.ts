export const LOGO_IMG = require('../../assets/App/logo.png');
export const LevelCompanySize = {
  LESS_THAN_10: "Dưới 10 nhân sự",
  FROM_10_TO_24: "10–24 nhân sự",
  FROM_25_TO_99: "25–99 nhân sự",
  FROM_100_TO_499: "100–499 nhân sự",
  FROM_500_TO_999: "500–999 nhân sự",
  FROM_1000_TO_4999: "1.000–4.999 nhân sự",
  FROM_5000_TO_9999: "5.000–9.999 nhân sự",
  FROM_10000_TO_19999: "10.000–19.999 nhân sự",
  FROM_20000_TO_49999: "20.000–49.999 nhân sự",
  MORE_THAN_50000: "Trên 50.000 nhân sự",
};

export const SalaryType = {
  RANGE: "Khoảng lương",
  GREATER_THAN: "Trên mức",
  NEGOTIABLE: "Thỏa thuận",
  COMPETITIVE: "Cạnh tranh",
};

export const SalaryUnit = {
  VND: "Việt Nam Đồng",
  USD: "Đô la Mỹ",
};

export const EducationLevel = {
  HIGH_SCHOOL: "THPT",
  COLLEGE: "Cao đẳng",
  UNIVERSITY: "Đại học",
  POSTGRADUATE: "Sau đại học",
  MASTER: "Thạc sĩ",
  DOCTORATE: "Tiến sĩ",
  OTHER: "Khác",
};

export const ExperienceLevel = {
  LESS_THAN_ONE_YEAR: "Dưới 1 năm",
  ONE_TO_TWO_YEARS: "1–2 năm",
  TWO_TO_FIVE_YEARS: "2–5 năm",
  FIVE_TO_TEN_YEARS: "5–10 năm",
  MORE_THAN_TEN_YEARS: "Trên 10 năm",
};

export const JobLevel = {
  INTERN: "Thực tập",
  ENTRY_LEVEL: "Mới ra trường / Junior",
  STAFF: "Nhân viên",
  ENGINEER: "Kỹ sư",
  SUPERVISOR: "Giám sát",
  MANAGER: "Quản lý",
  DIRECTOR: "Giám đốc",
  SENIOR_MANAGER: "Quản lý cấp cao",
  EXECUTIVE: "Lãnh đạo cấp cao",
};

export const JobType = {
  FULL_TIME: "Toàn thời gian",
  TEMPORARY_FULL_TIME: "Toàn thời gian thời vụ",
  PART_TIME: "Bán thời gian",
  TEMPORARY_PART_TIME: "Bán thời gian thời vụ",
  CONTRACT: "Hợp đồng",
  OTHER: "Khác",
};

export const JobGender = {
  MALE: "Nam",
  FEMALE: "Nữ",
  ANY: "Bất kỳ",
};

export const AgeType = {
  NONE: "Không yêu cầu độ tuổi",
  ABOVE: "Trên một độ tuổi",
  BELOW: "Dưới một độ tuổi",
  INPUT: "Trong khoảng",
};

export const JobStatus = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt (công khai)",
  REJECTED: "Bị từ chối",
  CLOSED: "Đã đóng",
  EXPIRED: "Hết hạn",
};

// ===== UTILS =====

/**
 * Trả về danh sách [{label, value}] để map cho Picker hoặc Dropdown.
 * @param enumObj enum object (ví dụ EducationLevel)
 */
export const getEnumOptions = (enumObj: Record<string, string>) => {
  return Object.entries(enumObj).map(([value, label]) => ({
    label,
    value,
  }));
};
export const getCompanySizeLabel = (size?: string) => LevelCompanySize[size as keyof typeof LevelCompanySize] || "Chưa cập nhật";
export const getSalaryTypeLabel = (type?: string) => SalaryType[type as keyof typeof SalaryType] || "Chưa cập nhật";
export const getSalaryUnitLabel = (unit?: string) => SalaryUnit[unit as keyof typeof SalaryUnit] || "Chưa cập nhật";
export const getEducationLevelLabel = (level?: string) => EducationLevel[level as keyof typeof EducationLevel] || "Chưa cập nhật";
export const getExperienceLevelLabel = (exp?: string) => ExperienceLevel[exp as keyof typeof ExperienceLevel] || "Chưa cập nhật";
export const getJobLevelLabel = (level?: string) => JobLevel[level as keyof typeof JobLevel] || "Chưa cập nhật";
export const getJobTypeLabel = (type?: string) => JobType[type as keyof typeof JobType] || "Chưa cập nhật";
export const getJobGenderLabel = (gender?: string) => JobGender[gender as keyof typeof JobGender] || "Chưa cập nhật";
export const getAgeTypeLabel = (ageType?: string) => AgeType[ageType as keyof typeof AgeType] || "Chưa cập nhật";
export const getJobStatusLabel = (status?: string) => JobStatus[status as keyof typeof JobStatus] || "Chưa cập nhật";
