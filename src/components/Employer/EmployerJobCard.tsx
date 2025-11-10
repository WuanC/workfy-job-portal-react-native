import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

interface Props {
  status?: string;
  title: string;
  expireationDate: string;
  applications?: number;
  salaryRange: string;
  onOptionsPress?: () => void;
  companyLogo?: string;
  companyName?: string;
}

export const EmployerJobCard = ({
  status = "PENDING",
  title,
  expireationDate,
  applications = 0,
  salaryRange,
  onOptionsPress,
  companyLogo,
  companyName = "Công ty chưa xác định",
}: Props) => {
  const getStatusColor = () => {
    switch (status) {
      case "PENDING":
        return "#f2c94c";
      case "APPROVED":
        return "#4caf50";
      case "REJECTED":
        return "#f44336";
      case "CLOSED":
        return "#9e9e9e";
      case "EXPIRED":
        return "#ff9800";
      default:
        return "#607d8b";
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardBody}>
        {/* Header Row */}
        <View style={styles.row}>
          <View style={styles.logoContainer}>
            <Image
              source={
                companyLogo
                  ? { uri: companyLogo }
                  : require("../../../assets/App/companyLogoDefault.png")
              }
              style={styles.logo}
            />
          </View>

          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={styles.jobTitle} numberOfLines={2}>
                {title && title.trim() !== "" ? title : "(Chưa có tiêu đề)"}
              </Text>
              <TouchableOpacity
                onPress={onOptionsPress}
                style={styles.iconButton}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color="#777" />
              </TouchableOpacity>
            </View>


            <View style={styles.statusRow}>
              <View
                style={[styles.statusTag, { backgroundColor: getStatusColor() }]}
              >
                <Text style={styles.statusText}>{status}</Text>
              </View>
              <Text style={styles.expireText}> {expireationDate}</Text>
            </View>

            <View style={styles.footerRow}>
              <View style={styles.salaryBadge}>
                <Text style={styles.salaryText}>{salaryRange}</Text>
              </View>

              <View style={styles.appCount}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color= {colors.primary.start}
                />
                <Text style={styles.appText}>{applications}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 6,
    borderRadius: 24,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "#fff",
  },
  cardBody: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.08)",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#f9f9f9",
    padding: 8,
    marginRight: 12,
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
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    padding: 4,
  },
  companyName: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusTag: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  expireText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  salaryBadge: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(102,126,234,0.1)",
  },
  salaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary.dark,
  },
  appCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(102,126,234,0.1)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  appText: {
    marginLeft: 4,
    fontSize: 13,
    color: colors.primary.dark,
    fontWeight: "500",
  },
});
