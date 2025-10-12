// services/authService.ts
//const BASE_URL = "http://localhost:8080/workify/api/v1/auth";

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
