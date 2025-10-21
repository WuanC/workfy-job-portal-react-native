import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiInstance from "../api/apiInstance";
import { signOut } from "../services/authService";
import { navigationRef } from "../navigations/NavigationRef";

type User = {
    id: string;
    email: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: true,
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ Khôi phục token khi mở app
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                if (token) {
                    // Gọi API lấy thông tin user
                    const res = await apiInstance.get("/users/me");
                    setUser(res.data.data);
                }
            } catch (error) {
                console.warn("Không thể khôi phục token:", error);
                await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
            } finally {
                setLoading(false);
            }
        };

        bootstrapAsync();
    }, []);

    // ✅ Login
    const login = async (email: string, password: string) => {
        try {
            const res = await apiInstance.post("/auth/users/sign-in", { email, password });
            const { accessToken, refreshToken, user } = res.data.data;

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);
            setUser(user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    // ✅ Logout
    const logout = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("accessToken");
            const refreshToken = await AsyncStorage.getItem("refreshToken");

            // attempt server-side sign-out, but proceed regardless of result per docs
            try {
                await signOut(accessToken, refreshToken);
            } catch (err) {
                console.warn("signOut failed:", err);
            }
        } finally {
            // always clear local state
            await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
            setUser(null);

            // reset navigation to Login
            try {
                if (navigationRef.isReady()) {
                    navigationRef.reset({ index: 0, routes: [{ name: "Login" }] });
                }
            } catch (err) {
                // ignore
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
