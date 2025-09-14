import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useNavigation } from "@react-navigation/native";

interface IJobCardProps {
    logo_path: any; 
    job_title: string;
    company_name: string;
    job_location: string;
    salary_range: string;
    time_passed: string;
}
type JobDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "JobDetail"
>;
const JobCard = ({
    logo_path,
    job_title,
    company_name,
    job_location,
    salary_range,
    time_passed,
}: IJobCardProps) => {
    const navigation = useNavigation<JobDetailNavigationProp>();
    return (
        <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate("JobDetail")}>
            <LinearGradient
                colors={["#fff8e1", "#fceabb"]}
                style={styles.gradient}
            >
                <View style={styles.row}>
                    {/* Logo */}
                    <Image source={logo_path} style={styles.logo} />

                    {/* Thông tin job */}
                    <View style={styles.info}>
                        <Text style={styles.jobTitle}>{job_title}</Text>
                        <Text style={styles.company}>{company_name}</Text>
                        <Text style={styles.location}>{job_location}</Text>
                        <Text style={styles.salary}>{salary_range}</Text>
                    </View>

                    {/* Icon yêu thích */}
                    <View style={styles.rightSection}>
                        <Ionicons
                            name="heart-outline"
                            size={22}
                            color="#E74C3C"
                        />
                        <Text style={styles.time}>{time_passed}</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        marginVertical: 6,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ff9900ff",
    },
    gradient: {
        padding: 12,
        borderRadius: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: "contain",
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    jobTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#007AFF",
    },
    company: {
        fontSize: 13,
        color: "#000",
        marginTop: 2,
    },
    location: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    salary: {
        fontSize: 12,
        color: "red",
        marginTop: 2,
    },
    rightSection: {
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    time: {
        fontSize: 10,
        color: "#999",
        marginTop: 4,
    },
});

export default JobCard;
