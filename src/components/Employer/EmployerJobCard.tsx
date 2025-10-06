import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  status?: "draft" | "active" | "exprired";
  title: string;
  duration: string;
  dateRange: string;
  views?: number;
  applications?: number;
}

export default function EmployerJobCard({
  status = "draft",
  title,
  duration,
  dateRange,
  views = 0,
  applications = 0,
}: Props) {
  const getStatusColor = () => {
    return status === "draft" ? "#607d8b" : "#4caf50";
  };

  return (
    <TouchableOpacity style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.statusTag, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>
            {status === "draft" ? "BẢN TẠM" : "ĐANG DUYỆT"}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
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

        <View style={{ marginLeft: "auto" }}>
          <Text style={styles.createdBy}>Được tạo bởi</Text>
          <Ionicons name="person-circle-outline" size={22} color="#bbb" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

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
