import apiInstance from "../api/apiInstance";

export const getEmployerProfile = async () => {
    try {
        const res = await apiInstance.get("/employers/me");
        return res.data.data;
    } catch (error: any) {
        console.error("Lỗi lấy thông tin nhà tuyển dụng:", error.message);
        throw error;
    }
};
export const updateEmployerAvatar = async (uri: string) => {
    const formData = new FormData();
    const filename = uri.split("/").pop() || "avatar.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("avatar", {
        uri,
        name: filename,
        type,
    } as any);

    const res = await apiInstance.patch("/employers/me/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data.data; // { id, avatarUrl, ... }
};
export const updateEmployerBG = async (uri: string) => {
    const formData = new FormData();

    // 👇 Lấy tên file và loại mime (quan trọng)
    const filename = uri.split("/").pop() || "bg.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("background", {
        uri,
        name: filename,
        type,
    } as any);

    const res = await apiInstance.patch("/employers/me/background", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data.data; // { id, avatarUrl, ... }
};
export const getEmployerById = async (id: number) => {
    try {
        const response = await apiInstance.get(`/employers/${id}`);
        return response.data.data; // server trả về {status, message, data}
    } catch (error: any) {
        console.error("❌ Lỗi lấy thông tin nhà tuyển dụng:", error.response?.data || error);
        throw error;
    }
};
export const updateEmployerProfile = async (data: {
    companyName: string;
    companySize: string;
    contactPerson: string;
    phoneNumber: string;
    provinceId: number;
    districtId: number;
    detailAddress: string;
    aboutCompany: string;
}) => {
    try {
        const response = await apiInstance.put("/employers/me", data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi cập nhật nhà tuyển dụng:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Cập nhật thất bại");
    }
};
export const updateEmployerWebsiteUrls = async (data: {
    websiteUrls: string[];
    linkedinUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    googleUrl: string;
    youtubeUrl: string

}) => {
    try {
        const res = await apiInstance.patch("/employers/me/website-urls", data);
        return res.data;
    } catch (error: any) {
        console.error("❌ Error updating employer website URLs:", error.response?.data || error.message);
        throw error;
    }
};
export const updateEmployerPassword = async (
    currentPassword: string,
    newPassword: string
) => {
    try {
        const response = await apiInstance.patch("/employers/me/password", {
            currentPassword,
            newPassword,
        });

        return response.data; // { status, message }
    } catch (error: any) {
        // Xử lý lỗi rõ ràng hơn
        if (error.response?.status === 400) {
            throw new Error("Dữ liệu không hợp lệ (mật khẩu không đúng định dạng).");
        }
        if (error.response?.status === 401) {
            throw new Error("Mật khẩu hiện tại không chính xác.");
        }
        throw new Error("Không thể cập nhật mật khẩu.");
    }
};

export const getTopHiringEmployers = async (limit: number = 10) => {
    try {
        const res = await apiInstance.get(`/employers/top-hiring`, {
            params: { limit },
        });
        return res.data.data; 
    } catch (error: any) {
        console.error("❌ Lỗi lấy danh sách nhà tuyển dụng top tuyển dụng:", error.response?.data || error.message);

        // Xử lý lỗi cụ thể hơn
        if (error.response?.status === 400) {
            throw new Error("Giá trị 'limit' không hợp lệ (phải >= 1).");
        }

        throw new Error("Không thể lấy danh sách nhà tuyển dụng top tuyển dụng.");
    }
};