import { TouchableOpacity, View, Text, StyleSheet, Image, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { getApplicationStatusLabel } from "../utilities/constant";
import { useI18n } from "../hooks/useI18n";

type JobDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmployeeDetailApplication"
>;

interface IAppliedJobCardProps {
  id: number;
  logo_path: any;
  title: string;
  company_name: string;
  applied_time: string;
  status: string;
  cvUrl: string;
  coverLetter: string;
}

const AppliedJobCard = ({
  id,
  title,
  logo_path,
  company_name,
  applied_time,
  status,
  cvUrl,
  coverLetter,
}: IAppliedJobCardProps) => {
  const navigation = useNavigation<JobDetailNavigationProp>();
  const { t } = useI18n();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() =>
          navigation.navigate("EmployeeDetailApplication", {
            applicationId: id,
            status,
            cvUrl,
            coverLetter,
            jobTitle: title,
          })
        }
      >
        <View style={styles.row}>
          {/* Logo */}
          <View style={styles.logoContainer}>
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
          </View>

          {/* Job details */}
          <View style={styles.info}>
            <Text style={styles.jobTitle} numberOfLines={2}>{title}</Text>
            <Text style={styles.company} numberOfLines={1}>{company_name}</Text>

            {/* STATUS đặt lên TRÊN */}
            <View style={[
              styles.statusBadge,
              status === "OFFERED"
                ? styles.approved
                : status === "REJECTED"
                ? styles.rejected
                : status === "INTERVIEWED_PENDING"
                ? styles.interviewed
                : status === "INTERVIEW_SCHEDULING"
                ? styles.scheduling
                : status === "SCREENING_PENDING"
                ? styles.screening
                : status === "SCREENING"
                ? styles.screening
                : status === "VIEWED"
                ? styles.viewed
                : styles.pending
            ]}>
              <Text style={styles.statusText}>
                {getApplicationStatusLabel(status)}
              </Text>
            </View>

            {/* TIME nằm phía dưới */}
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={13} color="#999" />
              <Text style={styles.time}>{t('application.applicationDate')}: {applied_time}</Text>
            </View>

          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AppliedJobCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "flex-start" },

  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    padding: 8,
    marginRight: 14,
    // lift slightly so it visually aligns higher than center
    marginTop: 4,
    elevation: 2,
  },
  logo: { width: "100%", height: "100%", resizeMode: "contain" },

  info: { flex: 1 },
  jobTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a1a" },
  company: { fontSize: 14, color: "#666", marginTop: 2, fontWeight: "500" },

  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  approved: { backgroundColor: "#4CAF50" },
  rejected: { backgroundColor: "#FF5252" },
  pending: { backgroundColor: "#FFB84C" },
  interviewed: { backgroundColor: "#2196F3" },
  scheduling: { backgroundColor: "#9C27B0" },
  screening: { backgroundColor: "#FF9800" },
  viewed: { backgroundColor: "#00BCD4" },

  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  time: { marginLeft: 4, fontSize: 12, color: "#999" },
});
