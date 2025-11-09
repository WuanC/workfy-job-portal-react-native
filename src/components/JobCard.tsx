import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { toggleSaveJob } from "../services/saveJobService";

interface IJobCardProps {
  id: number;
  logo_path?: string | any;
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

const JobCard: React.FC<IJobCardProps> = ({
  id,
  logo_path,
  job_title,
  company_name,
  job_location,
  salary_range,
  time_passed,
  applied = false,
}) => {
  const navigation = useNavigation<JobDetailNavigationProp>();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const [heartApply, setheartApply] = useState<boolean>(applied)
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleHeartPress = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const handleToggleSave = async (jobId: number) => {
    try {
      console.log(logo_path)
      await toggleSaveJob(jobId)
    }
    catch (e) {
      console.error(e)
    }

  };
    const handleToggleSavea =  () => {
      console.log(logo_path)

  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {
        handleToggleSavea()
        navigation.navigate("JobDetail", { id })}}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.95 },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={
              heartApply
                ? ["rgba(102, 126, 234, 0.05)", "rgba(118, 75, 162, 0.05)"]
                : ["#ffffff", "#ffffff"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.row}>
              <View style={styles.logoContainer}>
                <Image
                  source={
                    logo_path
                      ? { uri: logo_path }
                      : require("../../assets/App/companyLogoDefault.png")
                  }
                  style={styles.logo}
                />
              </View>

              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text numberOfLines={2} style={styles.jobTitle}>
                    {job_title}
                  </Text>
                  <Pressable onPress={() => {
                    handleHeartPress()
                    handleToggleSave(id)
                    setheartApply(!heartApply)
                  }}>
                    <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                      <Ionicons
                        name={heartApply ? "heart" : "heart-outline"}
                        size={24}
                        color={heartApply ? "#f5576c" : "#d1d5db"}
                        style={styles.heartIcon}
                      />
                    </Animated.View>
                  </Pressable>
                </View>

                <Text style={styles.company} numberOfLines={1}>
                  {company_name}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color="#667eea" />
                  <Text style={styles.location} numberOfLines={1}>
                    {job_location}
                  </Text>
                </View>

                <View style={styles.bottomRow}>
                  <LinearGradient
                    colors={["#f2994a", "#f2c94c"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.salaryBadge}
                  >
                    <Text style={styles.salary}>💰 {salary_range}</Text>
                  </LinearGradient>
                  <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={12} color="#999" />
                    <Text style={styles.time}>{time_passed}</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  cardContainer: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  gradient: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.1)",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    padding: 8,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 8,
    lineHeight: 24,
  },
  company: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  location: {
    fontSize: 13,
    color: "#999999",
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  salaryBadge: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: "#f2994a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  salary: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  time: {
    fontSize: 11,
    color: "#999",
    marginLeft: 4,
    fontWeight: "500",
  },
  heartIcon: {
    marginLeft: 4,
  },
});

export default JobCard;
