// services/authService.ts
//const BASE_URL = "http://localhost:8080/workify/api/v1/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import apiInstance from "../api/apiInstance";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    data: {
        id: number;
        fullName: string;
        email: string;
        role: string;
        status: string;
    };
}

export const loginUser = async (payload: LoginRequest) => {
    try {
        const res = await apiInstance.post("/auth/users/sign-in", payload);
        return res.data.data as TokenResponse;
    } catch (err: any) {
        if (err.response) {
            throw err.response.data;
        } else {
            throw new Error("Không thể kết nối server");
        }
    }
};
export const loginEmployer = async (payload: LoginRequest) => {
    try {
        const res = await apiInstance.post("/auth/employers/sign-in", payload);
         const { accessToken } = res.data?.data || {};
         console.log("Access Token:", accessToken);
         if (accessToken) {
              await AsyncStorage.setItem("accessToken", accessToken);
         }
        return res.data.data as TokenResponse;
    } catch (err: any) {
        if (err.response) {
            throw err.response.data;
        } else {
            throw new Error("Không thể kết nối server");
        }
    }
};
export const registerUser = async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => {
    try {
        const res = await apiInstance.post("/users/sign-up", payload);
        return res.data;
    } catch (err: any) {
        // Nếu có phản hồi từ server
        if (err.response && err.response.data) {
            const data = err.response.data;

            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const firstError = data.errors[0];
                throw new Error(`${firstError.fieldName}: ${firstError.message}`);
            }

            if (data.message) {
                throw new Error(data.message);
            }
        }

        // Nếu không có response (lỗi kết nối, CORS, server không chạy...)
        if (err.request) {
            throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại server.");
        }

        // Lỗi khác (do code)
        throw new Error(err.message || "Đăng ký thất bại, vui lòng thử lại.");
        //throw new Error("Đăng ký thất bại, vui lòng thử lại.");
    }
};
export const confirmEmail = async (token: string) => {
    try {
        const res = await apiInstance.patch(
            "/auth/users/verify-email",
            {}, // hoặc bỏ luôn nếu server không yêu cầu body
            {
                headers: { "C-Token": token },
            }
        );
        return res.data;
    } catch (err: any) {
        console.log("ConfirmEmail error:", err.response?.data || err.message);

        if (err.response?.data?.message)
            throw new Error(err.response.data.message);

        throw new Error("Xác nhận email thất bại.");
    }
};
export const confirmEmailEmployer = async (token: string) => {
    try {
        const res = await apiInstance.patch(
            "/auth/employers/verify-email",
            {}, // hoặc bỏ luôn nếu server không yêu cầu body
            {
                headers: { "C-Token": token },
            }
        );
        return res.data;
    } catch (err: any) {
        console.log("ConfirmEmail error:", err.response?.data || err.message);

        if (err.response?.data?.message)
            throw new Error(err.response.data.message);

        throw new Error("Xác nhận email thất bại.");
    }
};

export interface EmployerRegisterRequest {
    email: string;
    password: string;
    companyName: string;
    companySize: string;
    contactPerson: string;
    phoneNumber: string;
    provinceId: number;
    districtId: number;
    detailAddress?: string;
}

export const registerEmployer = async (payload: EmployerRegisterRequest) => {
    try {
        const res = await apiInstance.post("/employers/sign-up", payload);
        return res.data; // trả về data để UI hiển thị message
    } catch (err: any) {
        // Nếu có phản hồi từ server (status 400 / 409 / 500)
        if (err.response && err.response.data) {
            const data = err.response.data;

            // Nếu có danh sách lỗi cụ thể (400 Bad Request)
            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const firstError = data.errors[0];
                throw new Error(`${firstError.fieldName}: ${firstError.message}`);
            }

            // Nếu có message chung (409 hoặc 500)
            if (data.message) {
                throw new Error(data.message);
            }
        }

        // Nếu request được gửi nhưng không nhận phản hồi
        if (err.request) {
            throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại server.");
        }

        // Lỗi khác (do code hoặc axios)
        throw new Error(err.message || "Đăng ký nhà tuyển dụng thất bại, vui lòng thử lại.");
    }
};

/**
 * Sign out (used for both users and employers)
 * Sends X-Token (accessToken) and Y-Token (refreshToken) in headers
 */
export const signOut = async (accessToken: string | null, refreshToken: string | null) => {
    try {
        await apiInstance.post(
            "/auth/sign-out",
            {},
            {
                headers: {
                    ...(accessToken ? { "X-Token": accessToken } : {}),
                    ...(refreshToken ? { "Y-Token": refreshToken } : {}),
                },
            }
        );
        return true;
    } catch (err: any) {
        // per docs, frontend should still treat logout as success even if server returns error
        console.warn("signOut failed:", err?.response?.data || err.message || err);
        return false;
    }
};
