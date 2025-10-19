import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  status?: "draft" | "active" | "expired";
  title: string;
  duration: string;
  dateRange: string;
  views?: number;
  applications?: number;
  onOptionsPress?: () => void;
}

export const EmployerJobCard = ({
  status = "draft",
  title,
  duration,
  dateRange,
  views = 0,
  applications = 0,
  onOptionsPress,
}: Props) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "expired":
        return "#f44336";
      default:
        return "#607d8b";
    }
  };

  // const getStatusText = () => {
  //   switch (status) {
  //     case "active":
  //       return "ĐANG DUYỆT";
  //     case "expired":
  //       return "HẾT HẠN";
  //     default:
  //       return "BẢN TẠM";
  //   }
  // };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.statusTag, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        {/* 👇 Thêm TouchableOpacity để click dấu ba chấm */}
        <TouchableOpacity
          onPress={onOptionsPress}
          activeOpacity={0.6}
          style={styles.iconButton}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        {title && title.trim() !== "" ? title : "(Chưa có tiêu đề)"}
      </Text>

      {/* Date info */}
      <Text style={styles.duration}>
        {duration} | {dateRange}
      </Text>

      {/* Footer stats */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="document-text-outline" size={18} color="#4caf50" />
          <Text style={styles.footerText}>{applications}</Text>
        </View>

        <View style={styles.footerItem}>
          <Ionicons name="eye-outline" size={18} color="#4caf50" />
          <Text style={styles.footerText}>{views}</Text>
        </View>

        <View style={{ marginLeft: "auto", alignItems: "center" }}>
          <Text style={styles.createdBy}>Được tạo bởi</Text>
          <Ionicons name="person-circle-outline" size={22} color="#bbb" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusTag: {
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  iconButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  duration: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  footerText: {
    marginLeft: 4,
    color: "#333",
  },
  createdBy: {
    fontSize: 11,
    color: "#888",
    textAlign: "right",
  },
});
