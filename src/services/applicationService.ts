import apiInstance from "../api/apiInstance";
//12.2
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
//12.2
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
//12.4
export const getLatestApplicationByJob = async (jobId: number) => {
  try {
    const res = await apiInstance.get(`/applications/latest/${jobId}`);
    return res.data.data; // ✅ ApplicationResponse.data
  } catch (error: any) {
    console.log("❌ Lỗi khi lấy application gần nhất:", error.response?.data || error.message);

    // ✅ Xử lý lỗi cụ thể
    switch (error.response?.status) {
      case 400:
        throw new Error("Yêu cầu không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để xem thông tin này.");
      case 403:
        throw new Error("Bạn không có quyền truy cập thông tin ứng tuyển này.");
      case 404:
        return { message: "Không tìm thấy hồ sơ ứng tuyển gần nhất cho công việc này.", data: null };
      default:
        throw new Error("Không thể tải dữ liệu ứng tuyển gần nhất.");
    }
  }
};

// ===== Lấy application theo ID (12.3)
export const getApplicationById = async (id: number) => {
  try {
    const res = await apiInstance.get(`/applications/${id}`);
    console.log(res.data.data)
    return res.data.data; // ✅ ApplicationResponse
    
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy thông tin application:", error.response?.data || error.message);

    // ✅ Xử lý lỗi cụ thể
    switch (error.response?.status) {
      case 400:
        throw new Error("ID không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để xem hồ sơ ứng tuyển này.");
      case 403:
        throw new Error("Bạn không có quyền xem hồ sơ ứng tuyển này.");
      case 404:
        throw new Error("Không tìm thấy hồ sơ ứng tuyển.");
      default:
        throw new Error("Không thể tải thông tin hồ sơ ứng tuyển.");
    }
  }
};

//12.5
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

// ===== Employer: Lấy danh sách application theo job (12.6)
export const getApplicationsByJob = async (
  jobId: number,
  params?: {
    pageNumber?: number;
    pageSize?: number;
    receivedWithin?: number;
    status?: string;
  }
) => {
  try {
    const res = await apiInstance.get(`/applications/job/${jobId}`, { params });
    return res.data.data;
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy danh sách application theo job:", error.response?.data || error.message);
    switch (error.response?.status) {
      case 400:
        throw new Error("Tham số truy vấn không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để xem danh sách ứng tuyển.");
      case 403:
        throw new Error("Bạn không có quyền xem danh sách ứng tuyển cho công việc này.");
      case 404:
        return { message: "Không tìm thấy dữ liệu.", data: { items: [], totalItems: 0 } };
      default:
        throw new Error("Không thể tải danh sách ứng tuyển.");
    }
  }
};

// ===== Employer: Cập nhật trạng thái application (12.7)
export const updateApplicationStatus = async (applicationId: number, status: string) => {
  try {
    // PATCH /applications/{id}/status?status=<ApplicationStatus>
    const res = await apiInstance.patch(`/applications/${applicationId}/status`, null, { params: { status } });
    return res.data; // { message, data: ApplicationResponse }
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật trạng thái application:", error.response?.data || error.message);
    switch (error.response?.status) {
      case 400:
        throw new Error("Trạng thái không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để thực hiện hành động này.");
      case 403:
        throw new Error("Bạn không có quyền cập nhật trạng thái cho hồ sơ này.");
      case 404:
        throw new Error("Không tìm thấy hồ sơ ứng tuyển.");
      default:
        throw new Error("Không thể cập nhật trạng thái ứng tuyển.");
    }
  }
};