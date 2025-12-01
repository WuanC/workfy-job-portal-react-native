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
  status?: "PENDING" | "PUBLIC" | "DRAFT";
  title: string;
  createdAt: string;
  category: string;
  thumbnailUrl?: string;
  readingTime: number;
  onOptionsPress?: () => void;
}

export const EmployerPostCard = ({
  status = "PENDING",
  title,
  createdAt,
  category,
  thumbnailUrl,
  readingTime,
  onOptionsPress,
}: Props) => {
  const getStatusColor = () => {
    switch (status) {
      case "PENDING":
        return "#f2c94c";
      case "PUBLIC":
        return "#4caf50";
      case "DRAFT":
        return "#9e9e9e";
      default:
        return "#607d8b";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "PUBLIC":
        return "Công khai";
      case "DRAFT":
        return "Nháp";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardBody}>
        {/* Header Row */}
        <View style={styles.row}>
          <View style={styles.thumbnailContainer}>
            <Image
              source={
                thumbnailUrl
                  ? { uri: thumbnailUrl }
                  : require("../../../assets/App/companyLogoDefault.png")
              }
              style={styles.thumbnail}
            />
          </View>

          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={styles.postTitle} numberOfLines={2}>
                {title && title.trim() !== "" ? title : "(Chưa có tiêu đề)"}
              </Text>
              <TouchableOpacity
                onPress={onOptionsPress}
                style={styles.iconButton}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color="#777" />
              </TouchableOpacity>
            </View>

            <View style={styles.categoryRow}>
              <Ionicons name="pricetag-outline" size={14} color="#777" />
              <Text style={styles.categoryText}>{category}</Text>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[styles.statusTag, { backgroundColor: getStatusColor() }]}
              >
                <Text style={styles.statusText}>{getStatusText()}</Text>
              </View>
              <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
            </View>

            <View style={styles.footerRow}>
              <View style={styles.readingTimeBadge}>
                <Ionicons name="time-outline" size={14} color={colors.primary.start} />
                <Text style={styles.readingTimeText}>{readingTime} phút</Text>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBody: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  postTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    color: "#777",
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readingTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readingTimeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary.start,
    marginLeft: 4,
  },
});
