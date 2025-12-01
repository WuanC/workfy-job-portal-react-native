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
  EmployerChat: { conversation: ConversationResponse };
};

/**
 * Màn hình hiển thị danh sách conversations cho Employer
 */
const EmployerConversationListScreen: React.FC = () => {
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
      console.log("✅ [Employer] Loaded conversations with unread status:", 
        sortedData.map(c => ({ id: c.id, hasUnread: c.hasUnread })));
    } catch (err: any) {
      console.error("❌ [Employer] Error loading conversations:", err);
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
      setConversations((prev) => {
        const updatedConversations = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            // Kiểm tra xem có phải tin nhắn của mình không
            const isOwnMessage = message.senderType === "EMPLOYER";
            
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageSenderId: message.senderId,
              lastMessageSenderType: message.senderType,
              updatedAt: message.createdAt,
              hasUnread: isOwnMessage ? conv.hasUnread : true,
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
    
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.id === event.conversationId) {
            // Cập nhật hasUnread từ SEEN_UPDATE event
            // Sử dụng unreadForEmployer vì đây là màn hình của Employer
            return {
              ...conv,
              hasUnread: event.unread.unreadForEmployer > 0,
            };
          }
          return conv;
        });
      });
    });
  }, [onSeenUpdate]);

  /**

   */
  useFocusEffect(
    useCallback(() => {
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
      // Reset hasUnread về false khi vào conversation (optimistic update)
      setConversations((prev) => 
        prev.map((conv) => 
          conv.id === conversation.id 
            ? { ...conv, hasUnread: false }
            : conv
        )
      );
      
      navigation.navigate("EmployerChat", { conversation });
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
        Tin nhắn với ứng viên sẽ xuất hiện ở đây
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
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Tin nhắn</Text>
          <View style={styles.connectionStatus}>
            <View style={isConnected ? styles.connectedDot : styles.disconnectedDot} />
            <Text style={styles.connectionText}>
              {isConnected ? "Đang kết nối" : "Ngoại tuyến"}
            </Text>
          </View>
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
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

export default EmployerConversationListScreen;
