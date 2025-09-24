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
    applied?: boolean;
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
    applied = false,
}: IJobCardProps) => {
    const navigation = useNavigation<JobDetailNavigationProp>();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("JobDetail")}
        >
            <LinearGradient
                colors={["#fff", applied ? "#fff" : "#fceabb"]}
                style={styles.gradient}
            >
                <View style={styles.row}>
                    {/* Logo */}
                    <Image source={logo_path} style={styles.logo} />

                    {/* Nội dung */}
                    <View style={styles.info}>
                        <View style={styles.titleRow}>
                            <Text
                                numberOfLines={2}
                                minimumFontScale={14}
                                style={styles.jobTitle}
                            >
                                {job_title}
                            </Text>
                            <Ionicons
                                name={applied ? "heart" : "heart-outline"}
                                size={22}
                                color="#E74C3C"
                                style={styles.heartIcon}
                            />
                        </View>

                        <Text style={styles.company} numberOfLines={1}>
                            {company_name}
                        </Text>
                        <Text style={styles.location}>{job_location}</Text>

                        {/* Lương & Thời gian */}
                        <View style={styles.bottomRow}>
                            <Text style={styles.salary}>{salary_range}</Text>
                            <Text style={styles.time}>{time_passed}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        overflow: "hidden",
        marginVertical: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    gradient: {
        borderWidth: 1,
        borderColor: "#ff9900ff",
        borderRadius: 10,
        padding: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: "contain",
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#007AFF",
        flex: 1,
        marginRight: 8,
        lineHeight: 20,   // chiều cao mỗi dòng
        height: 40,       // luôn đủ 2 dòng
    },
    company: {
        fontSize: 14,
        color: "#000",
        marginTop: 2,
    },
    location: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    salary: {
        fontSize: 14,
        color: "red",
    },
    time: {
        fontSize: 12,
        color: "#999",
    },
    heartIcon: {
        marginLeft: 6,
    },
});

export default JobCard;
