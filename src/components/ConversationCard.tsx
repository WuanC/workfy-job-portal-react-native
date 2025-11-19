import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ConversationResponse } from "../types/type";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { useAuth } from "../context/AuthContext";

interface ConversationCardProps {
  conversation: ConversationResponse;
  onPress: () => void;
}

/**
 * Component hiển thị một conversation trong danh sách
 */
export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  onPress,
}) => {
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";

  // Xác định thông tin hiển thị (tên và avatar của người chat)
  const displayName = isEmployer
    ? conversation.jobSeekerName
    : conversation.employerName;
  const displayAvatar = isEmployer
    ? conversation.jobSeekerAvatar
    : conversation.employerAvatar;

  // Format thời gian theo múi giờ Việt Nam (giống MessageBubble)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    
    // Chuyển sang múi giờ Việt Nam (UTC+7)
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return vietnamTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Hôm qua";
    } else {
      return vietnamTime.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  // Kiểm tra xem có tin nhắn mới không (chưa đọc)
  // Chỉ hiển thị unread nếu có unreadCount > 0 (từ backend hoặc local state)
  const hasUnreadMessage = (conversation as any).unreadCount > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {displayAvatar ? (
          <Image source={{ uri: displayAvatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {hasUnreadMessage && <View style={styles.unreadBadge} />}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          {conversation.updatedAt && (
            <Text style={styles.time}>{formatTime(conversation.updatedAt)}</Text>
          )}
        </View>

        <Text style={styles.jobTitle} numberOfLines={1}>
          {conversation.jobTitle}
        </Text>

        {conversation.lastMessage && (
          <Text
            style={[
              styles.lastMessage,
              hasUnreadMessage && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessageSenderType === "USER" && isEmployer
              ? ""
              : conversation.lastMessageSenderType === "EMPLOYER" && !isEmployer
              ? ""
              : conversation.lastMessageSenderId?.toString() === user?.id
              ? "Bạn: "
              : ""}
            {conversation.lastMessage}
          </Text>
        )}
      </View>

      {/* Unread indicator */}
      {hasUnreadMessage && (
        <View style={styles.unreadIndicator}>
          <View style={styles.unreadDot} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary.start,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  unreadBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ff3b30",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  time: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  jobTitle: {
    fontSize: 13,
    color: colors.primary.start,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  unreadMessage: {
    fontWeight: "600",
    color: colors.text.primary,
  },
  unreadIndicator: {
    marginLeft: spacing.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.start,
  },
});
