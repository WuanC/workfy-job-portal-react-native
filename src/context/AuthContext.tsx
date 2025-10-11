import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiInstance from "../api/apiInstance";

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
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        setUser(null);
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
