import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiInstance from "../api/apiInstance";
import { getEmployerProfile, getProfile, loginEmployer, loginUser, logoutService } from "../services/authService";

type Role = "employee" | "employer";

type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    loginEmployeeAuth: (email: string, password: string) => Promise<void>;
    loginEmployerAuth: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    loginEmployeeAuth: async () => { },
    loginEmployerAuth: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    /**
     * ⚙️ Khi mở app, kiểm tra token và tải thông tin user
     */
    const loadUser = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        const role = (await AsyncStorage.getItem("role")) as Role | null;
        if (token && role) {
            try {
                if (role === "employee") {
                    const user = await getProfile();
                    setUser({ ...user, role });
                }
                else if (role === "employer") {
                    const employer = await getEmployerProfile()
                    setUser({ ...employer, role });
                }
            } catch {
                await AsyncStorage.multiRemove(["accessToken", "refreshToken", "role"]);
            }
        }
        setLoading(false);
    };
    useEffect(() => {

        loadUser();
    }, []);

    /**
     * 🔐 Đăng nhập EMPLOYEE
     */
    const loginEmployeeAuth = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await loginUser({ email, password });
            const { accessToken, refreshToken } = res;

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);
            await AsyncStorage.setItem("role", "employee");
            await loadUser();
        } catch (err) {
            console.error("Employee login failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 🔐 Đăng nhập EMPLOYER
     */
    const loginEmployerAuth = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await loginEmployer({ email, password });
            const { accessToken, refreshToken } = res;

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);
            await AsyncStorage.setItem("role", "employer");
            await loadUser();
        } catch (err) {
            console.error("Employer login failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 🚪 Đăng xuất
     */
    const logout = async () => {
        try {
            await logoutService();
        } catch (err) {
            console.error("Error when logging out:", err);
        } finally {
            await AsyncStorage.multiRemove(["accessToken", "refreshToken", "role"]);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                loginEmployeeAuth,
                loginEmployerAuth,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
