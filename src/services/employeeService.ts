import apiInstance from "../api/apiInstance";

/**
 * 📌 Lấy thông tin người dùng hiện tại (JOB_SEEKER hoặc ADMIN)
 * Endpoint: GET /users/me
 * Auth: Bearer Token
 */
export const getUserProfile = async () => {
  try {
    const res = await apiInstance.get("/users/me");
    return res.data.data; // { id, fullName, email, role, ... }
  } catch (error: any) {
    // Xử lý lỗi chi tiết
    if (error.response?.status === 401) {
      console.error("❌ Token không hợp lệ hoặc chưa đăng nhập:", error.response.data);
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    console.error("❌ Lỗi lấy thông tin người dùng:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Không thể lấy thông tin người dùng.");
  }
};
export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const res = await apiInstance.patch("/users/me/password", {
      currentPassword,
      newPassword,
    });

    return res.data; // { status, message }
  } catch (error: any) {
    // Xử lý lỗi chi tiết
    const status = error.response?.status;

    if (status === 400) {
      const apiMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        "Dữ liệu không hợp lệ.";
      throw new Error(apiMessage);
    }

    if (status === 401) {
      throw new Error("Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.");
    }

    if (status === 411) {
      throw new Error("Mật khẩu hiện tại không khớp.");
    }

    console.error("❌ Lỗi đổi mật khẩu:", error.response?.data || error.message);
    throw new Error("Không thể đổi mật khẩu. Vui lòng thử lại sau.");
  }
};

export const updateEmployeeAvatar = async (uri: string) => {
  try {
    const formData = new FormData();

    // Tách tên file và loại MIME
    const filename = uri.split("/").pop() || "avatar.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("avatar", {
      uri,
      name: filename,
      type,
    } as any);
    const res = await apiInstance.patch("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data; // nếu server trả { data: { ... } }
  } catch (error: any) {
    console.error("❌ Lỗi cập nhật avatar:", error.response?.data || error.message);

    if (error.response?.status === 400) {
      throw new Error("File ảnh không hợp lệ hoặc bị thiếu.");
    } else if (error.response?.status === 401) {
      throw new Error("Token không hợp lệ, vui lòng đăng nhập lại.");
    } else {
      throw new Error("Không thể cập nhật ảnh đại diện.");
    }
  }
};
