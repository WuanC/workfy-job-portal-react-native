import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LOGO_IMG } from "../utilities/constant";
import Checkbox from "expo-checkbox";
import { useState } from "react";

const JobSeekerRegisterScreen = () => {
    const [isChecked, setChecked] = useState(false);

    return (
        <View style={styles.container}>
            <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />

            <Text style={styles.title}>Job Seeker Registration</Text>

            {/* Fullname input */}
            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={22} color="#888" style={styles.icon} />
                <TextInput placeholder="Enter your full name" style={styles.input} />
            </View>

            {/* Email input */}
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#888" style={styles.icon} />
                <TextInput placeholder="Enter your email" style={styles.input} keyboardType="email-address" />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.input}
                />
                <MaterialIcons name="visibility" size={22} color="#888" style={styles.iconRight} />
            </View>

            {/* Confirm Password input */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder="Confirm password"
                    secureTextEntry={true}
                    style={styles.input}
                />
                <MaterialIcons name="visibility" size={22} color="#888" style={styles.iconRight} />
            </View>

            {/* Checkbox - Agree terms */}
            <View style={styles.agreeContainer}>
                <Checkbox
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? "#1976d2" : undefined}
                    style={styles.checkbox}
                />
                <Text style={styles.agreeText}>
                    I agree to the processing and provision of personal data that I have read and agree to the{" "}
                    <Text style={styles.link}>Terms & Conditions</Text>
                </Text>
            </View>

            {/* Sign up button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
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
                <Text style={styles.socialText}>Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
                <Text style={styles.socialText}>Sign up with LinkedIn</Text>
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
    agreeContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 12,
        width: "100%",
    },
    checkbox: {
        marginRight: 8,
        marginTop: 3,
    },
    agreeText: {
        flex: 1,
        color: "#555",
        fontSize: 14,
        lineHeight: 20,
    },
    link: {
        color: "#1976d2",
        fontWeight: "600",
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

export default JobSeekerRegisterScreen;
