import React, { useRef } from "react";
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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => navigation.navigate("JobDetail", { id })}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={
            applied
              ? ["#f8f8f8", "#ece9f1"]
              : ["#ffffff", "#fef3e6"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.row}>
            <Image
              source={
                logo_path
                  ? typeof logo_path === "string"
                    ? { uri: logo_path }
                    : logo_path
                  : require("../../assets/App/companyLogoDefault.png")
              }
              style={styles.logo}
            />

            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text numberOfLines={2} style={styles.jobTitle}>
                  {job_title}
                </Text>
                <Ionicons
                  name={applied ? "heart" : "heart-outline"}
                  size={22}
                  color={applied ? "#ff4d6d" : "#aaa"}
                  style={styles.heartIcon}
                />
              </View>

              <Text style={styles.company} numberOfLines={1}>
                {company_name}
              </Text>
              <Text style={styles.location} numberOfLines={1}>
                <Ionicons name="location-outline" size={13} color="#999" />{" "}
                {job_location}
              </Text>

              <View style={styles.bottomRow}>
                <LinearGradient
                  colors={["#ffb347", "#ffcc33"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.salaryBadge}
                >
                  <Text style={styles.salary}>{salary_range}</Text>
                </LinearGradient>
                <View style={styles.timeBadge}>
                  <Ionicons name="time-outline" size={13} color="#777" />
                  <Text style={styles.time}>{time_passed}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f0d8a8",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 14,
    borderRadius: 14,
    backgroundColor: "#f9f9f9",
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2c3e50",
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  company: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  location: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  salaryBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  salary: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  time: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  heartIcon: {
    marginLeft: 6,
  },
});

export default JobCard;
