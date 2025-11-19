import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { MessageResponse } from "../types/type";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

interface MessageBubbleProps {
  message: MessageResponse;
  isOwnMessage: boolean;
}

/**
 * Component hiển thị một tin nhắn trong chat
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    
    // Chuyển sang múi giờ Việt Nam (UTC+7)
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    
    return vietnamTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {/* Avatar (chỉ hiển thị cho tin nhắn của người khác) */}
      {!isOwnMessage && (
        <View style={styles.avatarContainer}>
          {message.senderAvatar ? (
            <Image
              source={{ uri: message.senderAvatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {message.senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Message bubble */}
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        {!isOwnMessage && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}
        <Text
          style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {message.content}
        </Text>
        <View style={styles.metaContainer}>
          <Text
            style={[
              styles.timeText,
              isOwnMessage ? styles.ownTimeText : styles.otherTimeText,
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>
          {isOwnMessage && (
            <Text style={styles.seenText}>{message.seen ? "✓✓" : "✓"}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    maxWidth: "80%",
  },
  ownMessageContainer: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  avatarContainer: {
    marginHorizontal: spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary.start,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: "85%",
  },
  ownBubble: {
    backgroundColor: colors.primary.start,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary.start,
    marginBottom: spacing.xs,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#ffffff",
  },
  otherMessageText: {
    color: colors.text.primary,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  timeText: {
    fontSize: 11,
  },
  ownTimeText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherTimeText: {
    color: colors.text.tertiary,
  },
  seenText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
});
