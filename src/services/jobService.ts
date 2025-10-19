import apiInstance from "../api/apiInstance";
import { JobLocation } from "../types/type";

export type JobRequest = {
  companyName: string;
  companySize: string;
  companyWebsite?: string;
  aboutCompany: string;
  jobTitle: string;
  jobLocations: JobLocation[];
  salaryType: string;
  minSalary?: number;
  maxSalary?: number;
  salaryUnit?: string;
  jobDescription: string;
  requirement: string;
  educationLevel: string;
  experienceLevel: string;
  jobLevel: string;
  jobType: string;
  gender: string;
  jobCode: string;
  industryIds: number[];
  ageType: string;
  minAge?: number;
  maxAge?: number;
  contactPerson: string;
  phoneNumber: string;
  contactLocation: JobLocation;
  description?: string;
  expirationDate: string; // format dd/MM/yyyy
};

// ✅ Hàm gọi API tạo job
export const createJob = async (job: JobRequest) => {
  try {
    const res = await apiInstance.post("/jobs", job);
    return res.data;
  } catch (error: any) {
    console.error("Lỗi khi tạo job:", error.response?.data || error.message);
    throw error;
  }
};

export const getMyJobs = async (
  pageNumber = 1,
  pageSize = 10,
  industryId?: number,
  provinceId?: number,
  keyword?: string
) => {
  const params: any = { pageNumber, pageSize };
  if (industryId) params.industryId = industryId;
  if (provinceId) params.provinceId = provinceId;
  if (keyword) params.keyword = keyword;

  const res = await apiInstance.get("/jobs/me", { params });
  return res.data;
};
