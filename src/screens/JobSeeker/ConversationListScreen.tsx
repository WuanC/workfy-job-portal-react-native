import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { ConversationResponse, MessageResponse } from "../../types/type";
import { getConversations } from "../../services/messageService";
import { ConversationCard } from "../../components/ConversationCard";
import { useWebSocket } from "../../hooks/useWebSocket";

type RootStackParamList = {
  Chat: { conversation: ConversationResponse };
};

/**
 * Màn hình hiển thị danh sách conversations
 */
const ConversationListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection
  const { isConnected, onNewMessage, onSeenUpdate } = useWebSocket();

  /**
   * Load danh sách conversations
   */
  const loadConversations = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const data = await getConversations();
      // Sắp xếp theo thời gian update mới nhất
      const sortedData = data.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      setConversations(sortedData);
      console.log("✅ Loaded conversations with unread counts:", 
        sortedData.map(c => ({ id: c.id, hasUnread: c.hasUnread })));
    } catch (err: any) {
      console.error("❌ Error loading conversations:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      const errorMsg = err.response?.status === 401 
        ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
        : err.response?.data?.message || "Không thể tải danh sách tin nhắn";
      setError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Xử lý tin nhắn mới từ WebSocket với unread info
   */
  useEffect(() => {
    onNewMessage((message: MessageResponse, unreadInfo?: any) => {
      console.log("📩 ConversationList received message:", message);
      console.log("📊 Unread info from WebSocket:", unreadInfo);
      
      setConversations((prev) => {
        const updatedConversations = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            // Kiểm tra xem có phải tin nhắn của mình không
            const isOwnMessage = message.senderType === "USER";
            
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageSenderId: message.senderId,
              lastMessageSenderType: message.senderType,
              updatedAt: message.createdAt,
              // Sử dụng unreadCount từ WebSocket event nếu có, nếu không thì tăng lên
              unreadCount: unreadInfo?.unreadForRecipient ?? (isOwnMessage ? 0 : (conv.unreadCount || 0) + 1),
            };
          }
          return conv;
        });

        // Sắp xếp lại theo thời gian mới nhất
        return updatedConversations.sort((a, b) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      });
    });
  }, [onNewMessage]);

  /**
   * Xử lý SEEN_UPDATE event từ WebSocket
   */
  useEffect(() => {
    onSeenUpdate((event) => {
      console.log("👁️ ConversationList received SEEN_UPDATE:", event);
      
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.id === event.conversationId) {
            // Cập nhật unreadCount từ SEEN_UPDATE event
            // Sử dụng unreadForJobSeeker vì đây là màn hình của JobSeeker
            return {
              ...conv,
              unreadCount: event.unread.unreadForJobSeeker,
            };
          }
          return conv;
        });
      });
    });
  }, [onSeenUpdate]);

  /**
   * Reload conversations khi quay lại màn hình (từ chat screen hoặc tab khác)
   * để cập nhật unreadCount mới nhất từ server
   */
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 ConversationListScreen focused - reloading conversations");
      // Reload mỗi khi focus vào màn hình để lấy unreadCount mới nhất từ server
      loadConversations(true);
    }, [loadConversations])
  );

  /**
   * Refresh handler
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadConversations();
  }, [loadConversations]);

  /**
   * Điều hướng tới màn hình chat
   */
  const handleConversationPress = useCallback(
    (conversation: ConversationResponse) => {
      // Reset unreadCount về 0 khi vào conversation (optimistic update)
      setConversations((prev) => 
        prev.map((conv) => 
          conv.id === conversation.id 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      navigation.navigate("Chat", { conversation });
    },
    [navigation]
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>Chưa có tin nhắn</Text>
      <Text style={styles.emptySubtitle}>
        Tin nhắn của bạn với nhà tuyển dụng sẽ xuất hiện ở đây
      </Text>
    </View>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.error.start} />
      <Text style={styles.emptyTitle}>Có lỗi xảy ra</Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadConversations(true)}>
        <Text style={styles.retryButtonText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.start} />
        <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
        <View style={styles.headerRight}>
          {isConnected ? (
            <View style={styles.connectionStatus}>
              <View style={styles.connectedDot} />
              <Text style={styles.connectionText}>Đang kết nối</Text>
            </View>
          ) : (
            <View style={styles.connectionStatus}>
              <View style={styles.disconnectedDot} />
              <Text style={styles.connectionText}>Ngoại tuyến</Text>
            </View>
          )}
        </View>
      </View>

      {/* List */}
      {error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ConversationCard
              conversation={item}
              onPress={() => handleConversationPress(item)}
            />
          )}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary.start}
            />
          }
          contentContainerStyle={
            conversations.length === 0 ? styles.emptyListContainer : undefined
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.text.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34c759",
  },
  disconnectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.tertiary,
  },
  connectionText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.start,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default ConversationListScreen;
