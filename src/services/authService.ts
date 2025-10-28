

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
        console.log("Employee login")
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
        console.log("Employer login")
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
export interface VerifyEmailRequest {
    email: string;
    code: string;
}
export const registerEmployee = async (payload: {
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
export const registerEmployer = async (payload: EmployerRegisterRequest) => {
    try {
        const res = await apiInstance.post("/employers/sign-up", payload);

        return res.data;
    } catch (err: any) {
        if (err.response && err.response.data) {
            const { status, message, errors } = err.response.data;

            switch (status) {
                case 400:
                    if (Array.isArray(errors) && errors.length > 0) {
                        const errorMessages = errors
                            .map((e: any) => `${e.fieldName}: ${e.message}`)
                            .join("\n");
                        throw new Error(errorMessages);
                    }
                    throw new Error(message || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.");

                case 409:
                    throw new Error(message || "Email đã tồn tại trong hệ thống.");

                case 500:
                    throw new Error(message || "Lỗi máy chủ, vui lòng thử lại sau.");

                default:
                    throw new Error(message || `Lỗi không xác định (mã ${status}).`);
            }
        }

        if (err.request) {
            throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc server.");
        }
        throw new Error(err.message || "Đăng ký nhà tuyển dụng thất bại, vui lòng thử lại.");
    }
};
export const verifyEmployerEmail = async (payload: VerifyEmailRequest) => {
    try {
        const res = await apiInstance.patch("/auth/employers/mobile/verify-email", payload);
        return res.data; // trả về kết quả để UI xử lý
    } catch (err: any) {
        if (err.response && err.response.data) {
            const data = err.response.data;

            // Trường hợp lỗi validate (400)
            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const firstError = data.errors[0];
                throw new Error(`${firstError.fieldName}: ${firstError.message}`);
            }

            // Các lỗi khác (409, 500, v.v.)
            if (data.message) {
                throw new Error(data.message);
            }
        }

        if (err.request) {
            throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng hoặc server.");
        }

        throw new Error(err.message || "Xác nhận email thất bại, vui lòng thử lại.");
    }
};
export const verifyEmployeeEmail = async (payload: VerifyEmailRequest) => {
    try {
        const res = await apiInstance.patch("/auth/users/mobile/verify-email", payload);
        return res.data; // trả về kết quả để UI xử lý
    } catch (err: any) {
        if (err.response && err.response.data) {
            const data = err.response.data;

            // Trường hợp lỗi validate (400)
            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const firstError = data.errors[0];
                throw new Error(`${firstError.fieldName}: ${firstError.message}`);
            }

            // Các lỗi khác (409, 500, v.v.)
            if (data.message) {
                throw new Error(data.message);
            }
        }

        if (err.request) {
            throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng hoặc server.");
        }

        throw new Error(err.message || "Xác nhận email thất bại, vui lòng thử lại.");
    }
};

//Get INFO
export const getProfile = async () => {
    try {
        const response = await apiInstance.get("/users/me");
        return response.data.data;
    } catch (error: any) {
        // Kiểm tra lỗi 401 (token không hợp lệ)
        if (error.response?.status === 401) {
            throw new Error("Token không hợp lệ hoặc đã hết hạn.");
        }
        throw new Error(error.response?.data?.message || "Lỗi không xác định.");
    }
};
export const getEmployerProfile = async () => {
    try {
        const response = await apiInstance.get("/employers/me");
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error("Token không hợp lệ hoặc bạn không phải nhà tuyển dụng.");
        }
        throw new Error(error.response?.data?.message || "Lỗi không xác định.");
    }
};

//LOG OUT
export const logoutService = async () => {
    try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!accessToken || !refreshToken) {
            console.warn("Thiếu token khi logout.");
            return;
        }

        await apiInstance.post(
            "/auth/sign-out",
            {},
            {
                headers: {
                    "X-Token": accessToken,
                    "Y-Token": refreshToken,
                },
            }
        );
    } catch (err) {
        console.error("Logout request failed:", err);
    }
};