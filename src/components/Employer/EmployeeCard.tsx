import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmployeeCardProps {
  name: string;
  location: string;
  salary: string;
  experience: string;
  position: string;
  age: number;
  resumeType: string;
  status: string;
  avatarUrl?: string;
  onPress?: () => void;
  onSavePress?: () => void; // ✅ thêm prop cho icon lưu
  saved?: boolean; // ✅ nếu bạn muốn hiển thị icon bookmark đã lưu
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  name,
  location,
  salary,
  experience,
  position,
  age,
  resumeType,
  status,
  avatarUrl,
  onPress,
  onSavePress,
  saved = false,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Icon lưu góc phải trên */}
      <TouchableOpacity style={styles.saveIcon} onPress={onSavePress}>
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={20}
          color={saved ? "#007bff" : "#999"}
        />
      </TouchableOpacity>

      <View style={styles.row}>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require("../../../assets/App/logo.png")
          }
          style={styles.avatar}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{name}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="#555" />
            <Text style={styles.infoText}>{location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={14} color="#555" />
            <Text style={styles.infoText}>{salary}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={14} color="#555" />
            <Text style={styles.infoText}>
              {experience} ({position})
            </Text>
          </View>

          <Text style={styles.age}>Tuổi: {age}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.resumeType}>Loại hồ sơ: {resumeType}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EmployeeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: "relative", // ✅ để icon save định vị được
  },
  saveIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  infoText: {
    marginLeft: 4,
    color: "#555",
    fontSize: 13,
  },
  age: {
    marginTop: 4,
    fontSize: 13,
    color: "#555",
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 6,
  },
  resumeType: {
    fontSize: 12,
    color: "#666",
  },
  status: {
    fontSize: 12,
    color: "green",
    fontWeight: "500",
  },
});
