import apiInstance from "../api/apiInstance";
export const applyWithFileCV = async (
  application: {
    fullName: string;
    email: string;
    phoneNumber: string;
    coverLetter: string;
    jobId: number;
  },
  file: any
) => {
  try {
    const formData = new FormData();

    // Phần JSON "application"
    formData.append("application", JSON.stringify(application));

    // Phần file "cv"
    // const filename = cvUri.split("/").pop() || "cv.pdf";
    // const match = /\.(\w+)$/.exec(filename);
    // const type = match ? `application/${match[1]}` : `application/pdf`;

    formData.append("cv", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream",
    } as any);

    const res = await apiInstance.post("/applications/mobile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data; // ApplicationResponse.data
  } catch (error: any) {
    console.error("❌ Lỗi khi ứng tuyển bằng file CV:", error.response?.data || error.message);

    // Xử lý lỗi cụ thể
    switch (error.response?.status) {
      case 400:
        throw new Error("Dữ liệu hoặc file không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để ứng tuyển.");
      case 403:
        throw new Error("Bạn không có quyền ứng tuyển công việc này.");
      case 404:
        throw new Error("Công việc không tồn tại hoặc chưa được duyệt.");
      case 409:
        throw new Error("Bạn đã đạt giới hạn số lần ứng tuyển cho công việc này.");
      default:
        throw new Error("Không thể gửi ứng tuyển.");
    }
  }
};
export const applyWithLinkCV = async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    coverLetter: string;
    jobId: number;
    cvUrl: string;
}) => {
    try {
        const res = await apiInstance.post("/applications/link", data);

        return res.data.data; // ApplicationResponse.data
    } catch (error: any) {
        console.error("❌ Lỗi khi ứng tuyển bằng link CV:", error.response?.data || error.message);

        // Xử lý lỗi cụ thể
        switch (error.response?.status) {
            case 400:
                throw new Error("Dữ liệu không hợp lệ.");
            case 401:
                throw new Error("Bạn cần đăng nhập để ứng tuyển.");
            case 403:
                throw new Error("Bạn không có quyền ứng tuyển công việc này.");
            case 404:
                throw new Error("Công việc không tồn tại hoặc chưa được duyệt.");
            case 409: {
                const message = error.response?.data?.message || "";
                if (message.includes("giới hạn"))
                    throw new Error("Bạn đã đạt giới hạn số lần ứng tuyển cho công việc này.");
                if (message.includes("ứng tuyển trước đó"))
                    throw new Error("Bạn cần có ứng tuyển trước đó để sử dụng tính năng nộp bằng đường dẫn CV.");
                throw new Error("Không thể gửi ứng tuyển.");
            }
            default:
                throw new Error("Không thể gửi ứng tuyển bằng link CV.");
        }
    }
};
export const getLatestApplicationByJob = async (jobId: number) => {
  try {
    const res = await apiInstance.get(`/applications/latest/${jobId}`);
    return res.data.data; // ✅ ApplicationResponse.data
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy application gần nhất:", error.response?.data || error.message);

    // ✅ Xử lý lỗi cụ thể
    switch (error.response?.status) {
      case 400:
        throw new Error("Yêu cầu không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để xem thông tin này.");
      case 403:
        throw new Error("Bạn không có quyền truy cập thông tin ứng tuyển này.");
      case 404:
        throw new Error("Không tìm thấy hồ sơ ứng tuyển gần nhất cho công việc này.");
      default:
        throw new Error("Không thể tải dữ liệu ứng tuyển gần nhất.");
    }
  }
};
export const getMyApplications = async (params?: {
  pageNumber?: number;
  pageSize?: number;
  sorts?: string; // ví dụ: "createdAt,desc" hoặc "updatedAt,asc"
}) => {
  try {
    const res = await apiInstance.get("/applications/me", { params });
    return res.data.data; // ✅ PageResponse<List<ApplicationResponse>>
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy danh sách application của tôi:", error.response?.data || error.message);

    // ✅ Xử lý lỗi cụ thể
    switch (error.response?.status) {
      case 400:
        throw new Error("Tham số phân trang hoặc sắp xếp không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để xem danh sách ứng tuyển của mình.");
      case 403:
        throw new Error("Bạn không có quyền truy cập danh sách này.");
      default:
        throw new Error("Không thể tải danh sách hồ sơ ứng tuyển.");
    }
  }
};