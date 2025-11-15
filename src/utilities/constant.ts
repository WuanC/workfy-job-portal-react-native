import i18next from '../i18n';

export const LOGO_IMG = require('../../assets/App/logo.png');

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


export const LevelCompanySize = {
  LESS_THAN_10: () => i18next.t('constants.companySize.LESS_THAN_10'),
  FROM_10_TO_24: () => i18next.t('constants.companySize.FROM_10_TO_24'),
  FROM_25_TO_99: () => i18next.t('constants.companySize.FROM_25_TO_99'),
  FROM_100_TO_499: () => i18next.t('constants.companySize.FROM_100_TO_499'),
  FROM_500_TO_999: () => i18next.t('constants.companySize.FROM_500_TO_999'),
  FROM_1000_TO_4999: () => i18next.t('constants.companySize.FROM_1000_TO_4999'),
  FROM_5000_TO_9999: () => i18next.t('constants.companySize.FROM_5000_TO_9999'),
  FROM_10000_TO_19999: () => i18next.t('constants.companySize.FROM_10000_TO_19999'),
  FROM_20000_TO_49999: () => i18next.t('constants.companySize.FROM_20000_TO_49999'),
  MORE_THAN_50000: () => i18next.t('constants.companySize.MORE_THAN_50000'),
};

export const SalaryType = {
  RANGE: () => i18next.t('constants.salaryType.RANGE'),
  GREATER_THAN: () => i18next.t('constants.salaryType.GREATER_THAN'),
  NEGOTIABLE: () => i18next.t('constants.salaryType.NEGOTIABLE'),
  COMPETITIVE: () => i18next.t('constants.salaryType.COMPETITIVE'),
};

export const SalaryUnit = {
  VND: () => i18next.t('constants.salaryUnit.VND'),
  USD: () => i18next.t('constants.salaryUnit.USD'),
};

export const EducationLevel = {
  HIGH_SCHOOL: () => i18next.t('constants.educationLevel.HIGH_SCHOOL'),
  COLLEGE: () => i18next.t('constants.educationLevel.COLLEGE'),
  UNIVERSITY: () => i18next.t('constants.educationLevel.UNIVERSITY'),
  POSTGRADUATE: () => i18next.t('constants.educationLevel.POSTGRADUATE'),
  MASTER: () => i18next.t('constants.educationLevel.MASTER'),
  DOCTORATE: () => i18next.t('constants.educationLevel.DOCTORATE'),
  OTHER: () => i18next.t('constants.educationLevel.OTHER'),
};

export const ExperienceLevel = {
  LESS_THAN_ONE_YEAR: () => i18next.t('constants.experienceLevel.LESS_THAN_ONE_YEAR'),
  ONE_TO_TWO_YEARS: () => i18next.t('constants.experienceLevel.ONE_TO_TWO_YEARS'),
  TWO_TO_FIVE_YEARS: () => i18next.t('constants.experienceLevel.TWO_TO_FIVE_YEARS'),
  FIVE_TO_TEN_YEARS: () => i18next.t('constants.experienceLevel.FIVE_TO_TEN_YEARS'),
  MORE_THAN_TEN_YEARS: () => i18next.t('constants.experienceLevel.MORE_THAN_TEN_YEARS'),
};

export const JobLevel = {
  INTERN: () => i18next.t('constants.jobLevel.INTERN'),
  ENTRY_LEVEL: () => i18next.t('constants.jobLevel.ENTRY_LEVEL'),
  STAFF: () => i18next.t('constants.jobLevel.STAFF'),
  ENGINEER: () => i18next.t('constants.jobLevel.ENGINEER'),
  SUPERVISOR: () => i18next.t('constants.jobLevel.SUPERVISOR'),
  MANAGER: () => i18next.t('constants.jobLevel.MANAGER'),
  DIRECTOR: () => i18next.t('constants.jobLevel.DIRECTOR'),
  SENIOR_MANAGER: () => i18next.t('constants.jobLevel.SENIOR_MANAGER'),
  EXECUTIVE: () => i18next.t('constants.jobLevel.EXECUTIVE'),
};

export const JobType = {
  FULL_TIME: () => i18next.t('constants.jobType.FULL_TIME'),
  TEMPORARY_FULL_TIME: () => i18next.t('constants.jobType.TEMPORARY_FULL_TIME'),
  PART_TIME: () => i18next.t('constants.jobType.PART_TIME'),
  TEMPORARY_PART_TIME: () => i18next.t('constants.jobType.TEMPORARY_PART_TIME'),
  CONTRACT: () => i18next.t('constants.jobType.CONTRACT'),
  OTHER: () => i18next.t('constants.jobType.OTHER'),
};

export const JobGender = {
  MALE: () => i18next.t('constants.jobGender.MALE'),
  FEMALE: () => i18next.t('constants.jobGender.FEMALE'),
  ANY: () => i18next.t('constants.jobGender.ANY'),
};

export const AgeType = {
  NONE: () => i18next.t('constants.ageType.NONE'),
  ABOVE: () => i18next.t('constants.ageType.ABOVE'),
  BELOW: () => i18next.t('constants.ageType.BELOW'),
  INPUT: () => i18next.t('constants.ageType.INPUT'),
};

export const JobStatus = {
  DRAFT: () => i18next.t('constants.jobStatus.DRAFT'),
  PENDING: () => i18next.t('constants.jobStatus.PENDING'),
  APPROVED: () => i18next.t('constants.jobStatus.APPROVED'),
  REJECTED: () => i18next.t('constants.jobStatus.REJECTED'),
  CLOSED: () => i18next.t('constants.jobStatus.CLOSED'),
  EXPIRED: () => i18next.t('constants.jobStatus.EXPIRED'),
};
export const Sort = {
  createdAt: () => i18next.t('constants.sort.createdAt'),
  updateAt: () => i18next.t('constants.sort.updateAt'),
  expirationDate: () => i18next.t('constants.sort.expirationDate'),
};
export const BenefitType = {
  TRAVEL_OPPORTUNITY: () => i18next.t('constants.benefitType.TRAVEL_OPPORTUNITY'),
  BONUS_GIFT: () => i18next.t('constants.benefitType.BONUS_GIFT'),
  SHUTTLE_BUS: () => i18next.t('constants.benefitType.SHUTTLE_BUS'),
  INSURANCE: () => i18next.t('constants.benefitType.INSURANCE'),
  LAPTOP_MONITOR: () => i18next.t('constants.benefitType.LAPTOP_MONITOR'),
  HEALTH_CARE: () => i18next.t('constants.benefitType.HEALTH_CARE'),
  PAID_LEAVE: () => i18next.t('constants.benefitType.PAID_LEAVE'),
  FLEXIBLE_REMOTE_WORK: () => i18next.t('constants.benefitType.FLEXIBLE_REMOTE_WORK'),
  SALARY_REVIEW: () => i18next.t('constants.benefitType.SALARY_REVIEW'),
  TEAM_BUILDING: () => i18next.t('constants.benefitType.TEAM_BUILDING'),
  TRAINING: () => i18next.t('constants.benefitType.TRAINING'),
  SNACKS_PANTRY: () => i18next.t('constants.benefitType.SNACKS_PANTRY'),
  WORK_ENVIRONMENT: () => i18next.t('constants.benefitType.WORK_ENVIRONMENT'),
  CHILD_CARE: () => i18next.t('constants.benefitType.CHILD_CARE'),
  OTHER: () => i18next.t('constants.benefitType.OTHER'),
};
export const ApplicationStatus = {
  ALL: () => i18next.t('constants.applicationStatus.ALL'),
  UNREAD: () => i18next.t('constants.applicationStatus.UNREAD'),
  VIEWED: () => i18next.t('constants.applicationStatus.VIEWED'),
  EMAILED: () => i18next.t('constants.applicationStatus.EMAILED'),
  SCREENING: () => i18next.t('constants.applicationStatus.SCREENING'),
  SCREENING_PENDING: () => i18next.t('constants.applicationStatus.SCREENING_PENDING'),
  INTERVIEW_SCHEDULING: () => i18next.t('constants.applicationStatus.INTERVIEW_SCHEDULING'),
  INTERVIEWED_PENDING: () => i18next.t('constants.applicationStatus.INTERVIEWED_PENDING'),
  OFFERED: () => i18next.t('constants.applicationStatus.OFFERED'),
  REJECTED: () => i18next.t('constants.applicationStatus.REJECTED'),
};

// ===== UTILS =====

/**
 * Trả về danh sách [{label, value}] để map cho Picker hoặc Dropdown.
 * @param enumObj enum object (ví dụ EducationLevel)
 */
export const getEnumOptions = (enumObj: Record<string, () => string>) => {
  return Object.entries(enumObj).map(([value, labelFn]) => ({
    label: labelFn(),
    value,
  }));
};

const getNotUpdatedLabel = () => i18next.t('constants.notUpdated');

export const getCompanySizeLabel = (size?: string) => {
  const fn = LevelCompanySize[size as keyof typeof LevelCompanySize];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getSalaryTypeLabel = (type?: string) => {
  const fn = SalaryType[type as keyof typeof SalaryType];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getSalaryUnitLabel = (unit?: string) => {
  const fn = SalaryUnit[unit as keyof typeof SalaryUnit];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getEducationLevelLabel = (level?: string) => {
  const fn = EducationLevel[level as keyof typeof EducationLevel];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getExperienceLevelLabel = (exp?: string) => {
  const fn = ExperienceLevel[exp as keyof typeof ExperienceLevel];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getJobLevelLabel = (level?: string) => {
  const fn = JobLevel[level as keyof typeof JobLevel];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getJobTypeLabel = (type?: string) => {
  const fn = JobType[type as keyof typeof JobType];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getJobGenderLabel = (gender?: string) => {
  const fn = JobGender[gender as keyof typeof JobGender];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getAgeTypeLabel = (ageType?: string) => {
  const fn = AgeType[ageType as keyof typeof AgeType];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getJobStatusLabel = (status?: string) => {
  const fn = JobStatus[status as keyof typeof JobStatus];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getBenefitTypeLabel = (status?: string) => {
  const fn = BenefitType[status as keyof typeof BenefitType];
  return fn ? fn() : getNotUpdatedLabel();
};
export const getSortTypeLabel = (status?: string) => {
  const fn = Sort[status as keyof typeof Sort];
  return fn ? fn() : Sort.createdAt();
};
export const getApplicationStatusLabel = (status?: string) => {
  const fn = ApplicationStatus[status as keyof typeof ApplicationStatus];
  return fn ? fn() : getNotUpdatedLabel();
};
