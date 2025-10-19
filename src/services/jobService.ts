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
export const getJobById = async (id: number) => {
  try {
    if (!id) throw new Error("ID công việc không hợp lệ");
    const res = await apiInstance.get(`/jobs/${id}`);
    return res.data.data;
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message;
    console.error(`❌ Lỗi khi lấy job ID ${id}:`, errMsg);
    throw error;
  }
};

export const updateJob = async (id: number, job: JobRequest) => {
  try {
    const res = await apiInstance.put(`/jobs/${id}`, job);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error("❌ Lỗi 400: Dữ liệu không hợp lệ:", data);
          break;
        case 401:
          console.error("❌ Lỗi 401: Chưa đăng nhập hoặc token hết hạn.");
          break;
        case 403:
          console.error("❌ Lỗi 403: Bạn không có quyền cập nhật công việc này.");
          break;
        case 404:
          console.error("❌ Lỗi 404: Công việc hoặc ID liên quan không tồn tại.");
          break;
        default:
          console.error("❌ Lỗi không xác định:", data);
      }
    } else {
      console.error("❌ Lỗi mạng hoặc server:", error.message);
    }
    throw error;
  }
};
export const deleteJob = async (id: number) => {
  try {
    const res = await apiInstance.delete(`/jobs/${id}`);
    return res.data; // { status: 200, message: "Xóa công việc thành công" }
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa job:", error.response?.data || error.message);
    throw error;
  }
};
export const closeJob = async (id: number) => {
  try {
    const res = await apiInstance.patch(`/jobs/close/${id}`);
    return res.data; // { status, message }
  } catch (error: any) {
    console.error("Lỗi khi đóng tin tuyển dụng:", error.response?.data || error.message);
    throw error;
  }
};
export const getPopularIndustries = async (limit: number = 10) => {
  try {
    const res = await apiInstance.get("/jobs/industries/popular", {
      params: { limit },
    });
    return res.data.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách ngành nghề phổ biến:", error.response?.data || error.message);
    throw error;
  }
};