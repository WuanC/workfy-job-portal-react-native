import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LOGO_IMG } from "../../utilities/constant";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { loginEmployer } from "../../services/authService";

type MainNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login" |
    "Register" | "MainAppEmployer" | "ConfirmEmail" | "ForgotPassword"
>;

const EmployerLoginScreen = () => {
    const { loginEmployerAuth } = useAuth();
    const [isChecked, setChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<MainNavigationProp>();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
            return;
        }
        try {
            await loginEmployerAuth(email, password);

            navigation.replace("MainAppEmployer");


        }
        catch (error: any) {
            Alert.alert('Lỗi', error.message || 'Đăng nhập thất bại');
            console.error(error);
        } finally {
            //setLoading(false);
        }

    };

    return (
        <View style={styles.container}>
            <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Employer Log In</Text>

            {/* Email input */}
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder="Enter your email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder="Enter your password"
                    secureTextEntry={true}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />
                <MaterialIcons name="visibility" size={22} color="#888" style={styles.iconRight} />
            </View>

            {/* Remember & Forgot */}
            <View style={styles.row}>
                <View style={styles.rememberContainer}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? "#1976d2" : undefined}
                        style={styles.checkbox}
                    />
                    <Text style={styles.remember}>Remember me</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword", { isEmployee: false })}>
                    <Text style={styles.forgot}>Forgot password?</Text>
                </TouchableOpacity>
            </View>

            {/* Sign in button */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.or}>or</Text>
                <View style={styles.line} />
            </View>

            {/* Social Login */}
            {/* <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
                <Text style={styles.socialText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
                <Text style={styles.socialText}>Sign in with LinkedIn</Text>
            </TouchableOpacity> */}

            {/* 🆕 Signup and Employer login */}
            <View style={styles.bottomLinks}>
                <TouchableOpacity onPress={() => navigation.navigate("EmployerRegister")}>
                    <Text style={styles.linkText}>
                        Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.linkText}>
                        Are you an job seeker? <Text style={styles.linkHighlight}>Sign in here</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 8,
        width: "100%",
        backgroundColor: "#fff",
        height: 50,
    },
    icon: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: "auto",
    },
    input: {
        flex: 1,
        paddingVertical: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 10,
        alignItems: "center",
    },
    rememberContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        marginRight: 6,
    },
    remember: {
        color: "#555",
    },
    forgot: {
        color: "#007bff",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#1976d2",
        paddingVertical: 16,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
        width: "100%",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    or: {
        marginHorizontal: 8,
        fontSize: 14,
        color: "#555",
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 50,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        marginVertical: 6,
    },
    socialText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    bottomLinks: {
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        color: "#555",
        fontSize: 14,
        marginVertical: 4,
    },
    linkHighlight: {
        color: "#1976d2",
        fontWeight: "bold",
    },
});

export default EmployerLoginScreen;
