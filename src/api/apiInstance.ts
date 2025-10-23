import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * ===============================
 * 🔧 TẠO AXIOS INSTANCE
 * ===============================
 */
const apiInstance: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.2:8080/workify/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "ReactNativeApp/1.0 (Android; Mobile)",
  },
});

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
 * ⚙️ RESPONSE INTERCEPTOR
 * ===============================
 */
// apiInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error) => {
//     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

//     // Nếu token hết hạn
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;
//         const refreshToken = await AsyncStorage.getItem("refreshToken");

//         if (refreshToken) {
//           try {
//             const res = await apiInstance.post("/auth/users/refresh-token", {}, {
//               headers: { "Y-Token": refreshToken },
//             });

//             const newAccessToken: string = res.data.data.accessToken;
//             const newRefreshToken: string = res.data.data.refreshToken;

//             await AsyncStorage.setItem("accessToken", newAccessToken);
//             await AsyncStorage.setItem("refreshToken", newRefreshToken);

//             isRefreshing = false;
//             onRefreshed(newAccessToken);

//             if (originalRequest.headers)
//               originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//             return apiInstance(originalRequest);
//           } catch (refreshError) {
//             isRefreshing = false;
//             await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
//             console.warn("⚠️ Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
//           }
//         } else {
//           console.warn("⚠️ Không có refresh token, cần đăng nhập lại.");
//         }
//       }

//       // Nếu đang refresh, chờ token mới
//       return new Promise((resolve) => {
//         subscribeTokenRefresh((token: string) => {
//           if (originalRequest.headers)
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//           resolve(apiInstance(originalRequest));
//         });
//       });
//     }

//     return Promise.reject(error);
//   }
// );

export default apiInstance;
