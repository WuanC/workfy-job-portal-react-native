import apiInstance from "../api/apiInstance";
import { JobLocation } from "../types/type";

export type Benefit = {
  type: string;
  description: string;
};
export type JobRequest = {
  companyName: string;
  companySize: string;
  companyWebsite?: string;
  aboutCompany: string;
  jobTitle: string;
  jobLocations: JobLocation[];
  jobBenefits: Benefit[];
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
export type AdvancedJobQuery = {
  keyword?: string;
  industryIds?: (number | string)[];
  provinceIds?: (number | string)[];
  jobLevels?: string[];
  jobTypes?: string[];
  experienceLevels?: string[];
  educationLevels?: string[];
  postedWithinDays?: number;
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryUnit?: string | null;
  sort?: string; // ✅ dùng union type chuẩn
  pageNumber?: number;
  pageSize?: number;
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
// 🔍 Tìm kiếm nâng cao (public)
export const getAdvancedJobs = async ({
  keyword,
  industryIds,
  provinceIds,
  jobLevels,
  jobTypes,
  experienceLevels,
  educationLevels,
  postedWithinDays,
  minSalary,
  maxSalary,
  salaryUnit,
  sort,
  pageNumber = 1,
  pageSize = 10,
}: AdvancedJobQuery) => {
  try {
    const params: any = {
      pageNumber,
      pageSize,
    };

    if (keyword) params.keyword = keyword;
    if (industryIds?.length) params.industryIds = industryIds.join(",");
    if (provinceIds?.length) params.provinceIds = provinceIds.join(",");
    if (jobLevels?.length) params.jobLevels = jobLevels.join(",");
    if (jobTypes?.length) params.jobTypes = jobTypes.join(",");
    if (experienceLevels?.length)
      params.experienceLevels = experienceLevels.join(",");
    if (educationLevels?.length)
      params.educationLevels = educationLevels.join(",");
    if (postedWithinDays && postedWithinDays >= 1)
      params.postedWithinDays = postedWithinDays;
    if (minSalary !== undefined) params.minSalary = minSalary;
    if (maxSalary !== undefined) params.maxSalary = maxSalary;
    if (salaryUnit) params.salaryUnit = salaryUnit;
    if (sort) params.sort = sort;
    const res = await apiInstance.get("/jobs/advanced", { params });
    return res.data.data; // Trả về phần "data" để dễ xử lý hơn
  } catch (error: any) {
    console.error("❌ Lỗi khi tìm kiếm nâng cao:", error.response?.data || error.message);
    throw error;
  }
};
export const updateJobStatus = async (id: number, status: string) => {
  try {
    const res = await apiInstance.patch(`/jobs/status/${id}`, null, {
      params: { status },
    });
    return res.data; // ✅ { status, message }
  } catch (error: any) {
    if (error.response) {
      const { status: httpStatus, data } = error.response;

      switch (httpStatus) {
        case 400:
          console.error("❌ Lỗi 400: Trạng thái không hợp lệ (enum sai).", data);
          break;
        case 401:
          console.error("❌ Lỗi 401: Chưa đăng nhập hoặc token hết hạn.");
          break;
        case 403:
          console.error("❌ Lỗi 403: Bạn không có quyền ADMIN để cập nhật trạng thái công việc.");
          break;
        case 404:
          console.error("❌ Lỗi 404: Không tìm thấy công việc hoặc ID không tồn tại.");
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
export const getAllJobsAdmin = async ({
  pageNumber = 1,
  pageSize = 10,
  industryId,
  provinceId,
  keyword,
  sorts,
}: {
  pageNumber?: number;
  pageSize?: number;
  industryId?: number;
  provinceId?: number;
  keyword?: string;
  sorts?: string; // ví dụ: "createdAt:desc" hoặc "jobTitle:asc"
}) => {
  try {
    const params: any = { pageNumber, pageSize };

    if (industryId) params.industryId = industryId;
    if (provinceId) params.provinceId = provinceId;
    if (keyword) params.keyword = keyword;
    if (sorts) params.sorts = sorts;

    const res = await apiInstance.get("/jobs/all", { params });
    return res.data; // ✅ trả về PageResponse<List<JobResponse>>
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
          console.error("❌ Lỗi 403: Bạn không có quyền truy cập danh sách công việc (chỉ ADMIN).");
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

export const getEmployerJobOpenings = async (
  employerId: number,
  pageNumber: number = 1,
  pageSize: number = 10,
  sorts: string = "createdAt,desc"
) => {
  try {
    if (!employerId || employerId < 1) {
      throw new Error("ID nhà tuyển dụng không hợp lệ (phải >= 1).");
    }

    const params = { pageNumber, pageSize, sorts };
    const res = await apiInstance.get(`/jobs/openings/${employerId}`, { params });
    return res.data.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error("❌ Lỗi 400: employerId hoặc query không hợp lệ:", data);
          throw new Error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại tham số.");
        case 404:
          console.error("❌ Lỗi 404: Không tìm thấy công việc phù hợp:", data);
          throw new Error("Không tìm thấy công việc phù hợp cho nhà tuyển dụng này.");
        default:
          console.error("❌ Lỗi không xác định:", data);
          throw new Error(data?.message || "Lỗi không xác định từ server.");
      }
    } else if (error.request) {
      throw new Error("Không thể kết nối đến máy chủ. Kiểm tra lại mạng hoặc server.");
    } else {
      throw new Error(error.message || "Lỗi khi lấy danh sách công việc.");
    }
  }
};
export const getTopAttractiveJobs = async (limit: number = 10) => {
    try {
        const res = await apiInstance.get("/jobs/top-attractive", {
            params: { limit },
        });

        // Trả về danh sách công việc
        return res.data.data;
    } catch (error: any) {
        console.error("❌ Lỗi lấy danh sách công việc hấp dẫn:", error.response?.data || error.message);

        // Xử lý lỗi cụ thể
        if (error.response?.status === 400) {
            throw new Error("Giá trị 'limit' không hợp lệ (phải >= 1).");
        }

        throw new Error("Không thể lấy danh sách công việc hấp dẫn.");
    }
};
