import apiInstance from "../api/apiInstance";

/**
 * 13.1 Toggle lưu/bỏ lưu công việc
 */
export const toggleSaveJob = async (jobId: number) => {
  try {
    const res = await apiInstance.post(`/saved-jobs/toggle/${jobId}`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi toggle lưu/bỏ lưu công việc:", error.response?.data || error.message);

    switch (error.response?.status) {
      case 400:
        throw new Error("Tham số không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");
      case 403:
        throw new Error("Bạn không có quyền hoặc công việc chưa được phê duyệt.");
      case 404:
        throw new Error("Không tìm thấy công việc.");
      default:
        throw new Error("Không thể thay đổi trạng thái lưu công việc.");
    }
  }
};

/**
 * 13.2 Lấy danh sách công việc đã lưu (phân trang)
 */
export const getSavedJobs = async (params?: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  try {
    const res = await apiInstance.get("/saved-jobs", { params });
    return res.data.data; 
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy danh sách công việc đã lưu:", error.response?.data || error.message);

    switch (error.response?.status) {
      case 400:
        throw new Error("Tham số phân trang không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để xem danh sách công việc đã lưu.");
      default:
        throw new Error("Không thể tải danh sách công việc đã lưu.");
    }
  }
};

/**
 * 13.4 Kiểm tra đã lưu công việc hay chưa
 */
export const checkJobSaved = async (jobId: number) => {
  try {
    const res = await apiInstance.get(`/saved-jobs/check/${jobId}`);
    return res.data.data as boolean;
  } catch (error: any) {
    console.error("❌ Lỗi khi kiểm tra trạng thái lưu công việc:", error.response?.data || error.message);

    switch (error.response?.status) {
      case 400:
        throw new Error("jobId không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để kiểm tra trạng thái lưu công việc.");
      case 404:
        throw new Error("Không tìm thấy công việc.");
      default:
        throw new Error("Không thể kiểm tra trạng thái lưu công việc.");
    }
  }
};
