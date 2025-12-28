import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  AppState,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { ToastService } from "../../services/toastService";
import { ConversationResponse, MessageResponse } from "../../types/type";
import {
  getMessages,
  sendMessage as sendMessageAPI,
  markMessagesAsSeen,
} from "../../services/messageService";
import { MessageBubble } from "../../components/MessageBubble";
import { WebSocketStatusBanner } from "../../components/WebSocketStatusBanner";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

type RouteParams = {
  Chat: {
    conversation: ConversationResponse;
  };
};

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "Chat">>();
  const { conversation } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasEmployerMessage, setHasEmployerMessage] = useState(conversation.hasEmployerMessage);
  const flatListRef = useRef<FlatList>(null);
  const appState = useRef(AppState.currentState);
  const isScreenFocused = useRef(true);

  // WebSocket
  const { isConnected, sendMessage: sendMessageWS, onNewMessage, connect: reconnectWS } = useWebSocket();

  const isEmployer = user?.role === "employer";
  const canSendMessage = isEmployer || hasEmployerMessage;

  /**
   * Load tin nhắn từ server
   */
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getMessages(conversation.id);
      
      // Sắp xếp tin nhắn theo thời gian (cũ nhất lên trước)
      const sortedMessages = data.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      setMessages(sortedMessages);
      
      // Kiểm tra xem có tin nhắn từ employer không
      const hasEmployerMsg = sortedMessages.some((m) => m.senderType === "EMPLOYER");
      if (hasEmployerMsg && !hasEmployerMessage) {
        setHasEmployerMessage(true);
      }

      // KHÔNG đánh dấu đã đọc ở đây - sẽ được xử lý bởi useFocusEffect
    } catch (error: any) {
      console.error("❌ [JobSeekerChat] Error loading messages:", error);
      console.error("❌ [JobSeekerChat] Error details:", error.response?.data);
      ToastService.error("Lỗi", "Không thể tải tin nhắn");
    } finally {
      setLoading(false);
    }
  }, [conversation.id, hasEmployerMessage]);

  /**
   * Load messages khi mount
   */
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  /**
   * Lắng nghe tin nhắn mới từ WebSocket
   */
  useEffect(() => {
    if (!onNewMessage) return;

    const handleNewMessage = (newMessage: MessageResponse) => {
      console.log("📨 [JobSeekerChat] New message received:", newMessage);
      
      // Chỉ xử lý tin nhắn thuộc conversation hiện tại
      if (newMessage.conversationId === conversation.id) {
        console.log("✅ [JobSeekerChat] Adding new message to current conversation");
        
        setMessages((prev) => {
          // Kiểm tra xem tin nhắn đã tồn tại chưa (tránh duplicate)
          if (prev.some((m) => m.id === newMessage.id)) {
            console.log("⚠️ [JobSeekerChat] Message already exists, skipping");
            return prev;
          }
          
          const updatedMessages = [...prev, newMessage];
          console.log("📬 [JobSeekerChat] Total messages:", updatedMessages.length);
          return updatedMessages;
        });

        // Kiểm tra và cập nhật hasEmployerMessage nếu tin nhắn từ employer
        if (newMessage.senderType === "EMPLOYER" && !hasEmployerMessage) {
          console.log("✅ [JobSeekerChat] Enabling reply - received first employer message");
          setHasEmployerMessage(true);
        }

        // Scroll to bottom khi có tin nhắn mới
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Đánh dấu đã đọc ngay lập tức nếu màn hình đang focus
        if (isScreenFocused.current && appState.current === 'active') {
          markMessagesAsSeen(conversation.id)
            .then(() => {
              console.log("✅ [JobSeekerChat] Marked new message as seen");
              queryClient.invalidateQueries({ queryKey: ["messages", "unread-count"] });
            })
            .catch(console.error);
        }
      }
    };

    // Đăng ký listener
    onNewMessage(handleNewMessage);

    // Không cần cleanup vì useWebSocket đã xử lý
  }, [onNewMessage, conversation.id, hasEmployerMessage, queryClient]);

  /**
   * Đánh dấu đã đọc khi màn hình được focus
   */
  useFocusEffect(
    useCallback(() => {
      isScreenFocused.current = true;
      console.log("👁️ [JobSeekerChat] Screen focused");
      
      // Đánh dấu đã đọc ngay khi focus
      markMessagesAsSeen(conversation.id)
        .then(() => {
          console.log("✅ [JobSeekerChat] Marked as seen on focus");
          // Invalidate unread count để cập nhật badge
          queryClient.invalidateQueries({ queryKey: ["messages", "unread-count"] });
        })
        .catch(console.error);

      return () => {
        isScreenFocused.current = false;
        console.log("👁️ [JobSeekerChat] Screen unfocused");
      };
    }, [conversation.id, queryClient])
  );

  /**
   * Đánh dấu đã đọc khi messages được load xong và màn hình đang focus
   */
  useEffect(() => {
    if (!loading && messages.length > 0 && isScreenFocused.current && appState.current === 'active') {
      console.log("📧 [JobSeekerChat] Messages loaded, marking as seen");
      markMessagesAsSeen(conversation.id)
        .then(() => {
          console.log("✅ [JobSeekerChat] Marked as seen after loading");
          queryClient.invalidateQueries({ queryKey: ["messages", "unread-count"] });
        })
        .catch(console.error);
    }
  }, [loading, messages.length, conversation.id, queryClient]);

  /**
   * Scroll to bottom khi messages thay đổi hoặc sau khi load xong
   */
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      // Delay để đảm bảo FlatList đã render xong
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, loading]);

  /**
   * Gửi tin nhắn
   */
  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    if (!canSendMessage) {
      ToastService.warning(
        "Không thể gửi tin nhắn",
        "Chờ nhà tuyển dụng liên hệ với bạn trước"
      );
      return;
    }

    const tempMessage = messageText.trim();
    setMessageText("");
    setSending(true);

    // Tạo tin nhắn tạm thời để hiển thị ngay lập tức (optimistic update)
    const tempMessageObj: MessageResponse = {
      id: Date.now(), // ID tạm thời
      conversationId: conversation.id,
      senderId: parseInt(user?.id || "0"),
      senderType: "USER",
      senderName: user?.name || "You",
      senderAvatar: null,
      content: tempMessage,
      createdAt: new Date().toISOString(),
      seen: false,
    };

    try {
      // Thêm tin nhắn tạm thời ngay lập tức để UX mượt mà
      setMessages((prev) => [...prev, tempMessageObj]);

      // Thử gửi qua WebSocket nếu connected (để realtime update)
      if (isConnected) {
        try {
          sendMessageWS(conversation.id, tempMessage);
        } catch (wsError) {
          console.warn("⚠️ [JobSeekerChat] WebSocket send failed:", wsError);
        }
      }
      
      // LUÔN gửi qua REST API để đảm bảo message được lưu vào database
      const newMessage = await sendMessageAPI({
        conversationId: conversation.id,
        content: tempMessage,
      });
      
      // Xóa tin nhắn tạm và thêm tin nhắn thật từ API
      setMessages((prev) => {
        // Xóa tin nhắn tạm thời
        const filtered = prev.filter((m) => m.id !== tempMessageObj.id);
        
        // Kiểm tra xem tin nhắn thật đã tồn tại chưa (tránh duplicate từ WebSocket)
        if (filtered.some((m) => m.id === newMessage.id)) {
          return filtered;
        }
        
        const newMessages = [...filtered, newMessage];
        return newMessages;
      });

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error("❌ [JobSeekerChat] Error sending message:", error);
      console.error("❌ [JobSeekerChat] Error details:", error.response?.data || error.message);
      
      // Kiểm tra lỗi 403
      if (error.response?.status === 403) {
        ToastService.warning(
          "Không thể gửi tin nhắn",
          error.response?.data?.message || "Bạn chưa được phép gửi tin nhắn"
        );
      } else {
        ToastService.error(
          "Gửi tin nhắn thất bại",
          "Vui lòng kiểm tra kết nối và thử lại"
        );
      }
      
      // Xóa tin nhắn tạm thời nếu gửi thất bại
      setMessages((prev) => prev.filter((m) => m.id !== tempMessageObj.id));
      
      // Khôi phục text nếu gửi thất bại
      setMessageText(tempMessage);
    } finally {
      setSending(false);
    }
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyText}>
        {canSendMessage
          ? "Hãy bắt đầu cuộc trò chuyện"
          : "Chờ nhà tuyển dụng gửi tin nhắn đầu tiên"}
      </Text>
    </View>
  );

  /**
   * Thông tin hiển thị header
   */
  const displayName = isEmployer
    ? conversation.jobSeekerName
    : conversation.employerName;
  const displayAvatar = isEmployer
    ? conversation.jobSeekerAvatar
    : conversation.employerAvatar;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.start} />
        <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 50}
    >
      {/* WebSocket Status Banner */}
      <WebSocketStatusBanner 
        isConnected={isConnected} 
        onReconnect={reconnectWS}
        message="WebSocket: Đang kết nối..."
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.headerJobTitle} numberOfLines={1}>
            {conversation.jobTitle}
          </Text>
        </View>

        <View style={styles.connectionIndicator}>
          {isConnected ? (
            <View style={styles.connectedDot} />
          ) : (
            <View style={styles.disconnectedDot} />
          )}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isOwn = isEmployer 
            ? item.senderType === "EMPLOYER" 
            : item.senderType === "USER";
          return (
            <MessageBubble
              message={item}
              isOwnMessage={isOwn}
            />
          );
        }}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.messagesContainer,
          messages.length === 0 && styles.emptyMessagesContainer,
        ]}
        onContentSizeChange={() => {
          if (messages.length > 0 && !loading) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
        onLayout={() => {
          // Scroll to bottom khi FlatList layout xong
          if (messages.length > 0 && !loading) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: false });
            }, 100);
          }
        }}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        maintainVisibleContentPosition={null}
      />

      {/* Input container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            !canSendMessage && styles.textInputDisabled,
          ]}
          placeholderTextColor="#6B7280"
          placeholder={
            canSendMessage
              ? "Nhập tin nhắn..."
              : "Chờ nhà tuyển dụng liên hệ..."
          }
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
          editable={canSendMessage && !sending}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!messageText.trim() || !canSendMessage || sending) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || !canSendMessage || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.primary.start} />
          ) : (
            <Ionicons
              name="send"
              size={22}
              color={
                messageText.trim() && canSendMessage
                  ? colors.primary.start
                  : colors.text.tertiary
              }
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
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
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  headerJobTitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  connectionIndicator: {
    marginLeft: spacing.sm,
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
  messagesContainer: {
    paddingVertical: spacing.md,
  },
  emptyMessagesContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    fontSize: 15,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  textInputDisabled: {
    backgroundColor: colors.border.light,
    color: colors.text.tertiary,
  },
  sendButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;
