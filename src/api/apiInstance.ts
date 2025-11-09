import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
//import { setUserOutsideContext } from "../context/AuthContext";

/**
 * ===============================
 * 🔧 TẠO AXIOS INSTANCE
 * ===============================
 */
const apiInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/workify/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // Chỉ set User-Agent trên React Native, không set trên web (browser sẽ từ chối)
    ...(Platform.OS !== "web" && {
      "User-Agent": "ReactNativeApp/1.0 (Android; Mobile)",
    }),
  },
});



/**
 * ===============================
 * 🧩 REQUEST INTERCEPTOR
 * ===============================
 */
apiInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ===============================
 * 🔄 QUẢN LÝ REFRESH TOKEN
 * ===============================
 */
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}
/**
 * ===============================
 * ⚙️ RESPONSE INTERCEPTOR
 * ===============================
 */
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (originalRequest.url?.endsWith("/sign-in") || originalRequest.url?.endsWith("/forgot-password") || originalRequest.url?.endsWith("/reset-password") || originalRequest.url?.endsWith("/refresh-token")) {
      return Promise.reject(error);
    }
    console.log("a")
    // Nếu token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("b")
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        console.log(refreshToken)
        if (refreshToken) {
          try {
            const res = await apiInstance.post("/auth/users/refresh-token", {}, {
              headers: { "Y-Token": refreshToken },
            });
            console.log("d")
            const newAccessToken: string = res.data.data.accessToken;
            const newRefreshToken: string = res.data.data.refreshToken;

            await AsyncStorage.setItem("accessToken", newAccessToken);
            await AsyncStorage.setItem("refreshToken", newRefreshToken);

            isRefreshing = false;
            onRefreshed(newAccessToken);

            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiInstance(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            console.log("e")
            await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);

            console.warn("⚠️ Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
            throw new Error("Phieen banr đăng nhập hết hạn.");
          }
        } else {
          console.log("f")
          console.warn("⚠️ Không có refresh token, cần đăng nhập lại.");
        }
      }

      // Nếu đang refresh, chờ token mới
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          if (originalRequest.headers)
            originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
