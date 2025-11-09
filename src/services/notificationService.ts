import apiInstance from "../api/apiInstance";

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: "NEW_APPLICATION" | "APPLICATION_STATUS_UPDATE";
  link: string;
  jobId: number;
  applicationId: number;
  readFlag: boolean;
  createdAt: string;
}

export interface PaginatedNotificationResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  numberOfElements: number;
  items: Notification[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// export interface UnreadCountResponse {
//   unreadCount: number;
// }

/**
 * Lấy danh sách thông báo (phân trang)
 */
export const getNotifications = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedNotificationResponse> => {
  try {
    const res = await apiInstance.get<ApiResponse<PaginatedNotificationResponse>>("/notifications", {
      params: { pageNumber, pageSize },
    });
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy danh sách thông báo:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Đánh dấu một thông báo là đã đọc
 */
export const markNotificationAsRead = async (id: number): Promise<void> => {
  try {
    await apiInstance.post(`/notifications/${id}/read`);
  } catch (error: any) {
    console.error(`❌ Lỗi khi đánh dấu thông báo ${id} là đã đọc:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Đánh dấu tất cả thông báo là đã đọc
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await apiInstance.post("/notifications/read-all");
  } catch (error: any) {
    console.error("❌ Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Lấy số lượng thông báo chưa đọc
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const res = await apiInstance.get<ApiResponse<number>>("/notifications/unread-count");
    return res.data.data ?? 0;
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy số lượng thông báo chưa đọc:", error.response?.data || error.message);
    // Trả về 0 thay vì throw error để tránh lỗi React Query
    return 0;
  }
};

