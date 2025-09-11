import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LOGO_IMG } from "../utilities/constant";
import Checkbox from "expo-checkbox"; // 👈 thêm dòng này
import { useState } from "react";

const JobSeekerLoginScreen = () => {
    const [isChecked, setChecked] = useState(false);

    return (
        <View style={styles.container}>
            <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />

            <Text style={styles.title}>Job Seeker Log In</Text>

            {/* Email input */}
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#888" style={styles.icon} />
                <TextInput placeholder="Enter your email" style={styles.input} />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder="Enter your password"
                    secureTextEntry={true}
                    style={styles.input}
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
                <Text style={styles.forgot}>Forgot password?</Text>
            </View>

            {/* Sign in button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.or}>or</Text>
                <View style={styles.line} />
            </View>

            {/* Social Login */}
            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
                <Text style={styles.socialText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
                <Text style={styles.socialText}>Sign in with LinkedIn</Text>
            </TouchableOpacity>

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
});

export default JobSeekerLoginScreen;
