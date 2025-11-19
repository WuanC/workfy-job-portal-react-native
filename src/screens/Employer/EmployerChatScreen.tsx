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
  Image,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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
import { useWebSocket } from "../../hooks/useWebSocket";
import { useAuth } from "../../context/AuthContext";

type RouteParams = {
  EmployerChat: {
    conversation: ConversationResponse;
  };
};

/**
 * Màn hình chat cho Employer
 */
const EmployerChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "EmployerChat">>();
  const { conversation } = route.params;
  const { user } = useAuth();

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // WebSocket
  const { isConnected, sendMessage: sendMessageWS, onNewMessage } = useWebSocket();

  /**
   * Lưu tin nhắn vào AsyncStorage
   */
  const saveMessagesToStorage = useCallback(async (messages: MessageResponse[]) => {
    try {
      const key = `chat_history_${conversation.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(messages));
      console.log("💾 [EmployerChat] Saved messages to storage:", messages.length);
    } catch (error) {
      console.error("❌ [EmployerChat] Error saving messages:", error);
    }
  }, [conversation.id]);

  /**
   * Load tin nhắn từ AsyncStorage
   */
  const loadMessagesFromStorage = useCallback(async () => {
    try {
      const key = `chat_history_${conversation.id}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const messages = JSON.parse(stored);
        console.log("📂 [EmployerChat] Loaded messages from storage:", messages.length);
        return messages;
      }
      return null;
    } catch (error) {
      console.error("❌ [EmployerChat] Error loading from storage:", error);
      return null;
    }
  }, [conversation.id]);

  /**
   * Load tin nhắn từ server
   */
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load từ cache trước để hiển thị nhanh
      const cachedMessages = await loadMessagesFromStorage();
      if (cachedMessages && cachedMessages.length > 0) {
        setMessages(cachedMessages);
        setLoading(false);
      }

      console.log("📥 [EmployerChat] Loading messages for conversation:", conversation.id);
      const data = await getMessages(conversation.id);
      console.log("✅ [EmployerChat] Loaded messages:", data.length);
      
      // Sắp xếp tin nhắn theo thời gian (cũ nhất lên trước)
      const sortedMessages = data.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      console.log("✅ [EmployerChat] Sorted messages:", sortedMessages.length);
      setMessages(sortedMessages);
      
      // Lưu vào AsyncStorage
      await saveMessagesToStorage(sortedMessages);

      // Đánh dấu đã đọc
      if (sortedMessages.length > 0) {
        await markMessagesAsSeen(conversation.id);
      }
    } catch (error: any) {
      console.error("❌ [EmployerChat] Error loading messages:", error);
      console.error("❌ [EmployerChat] Error details:", error.response?.data);
      ToastService.error("Lỗi", "Không thể tải tin nhắn");
    } finally {
      setLoading(false);
    }
  }, [conversation.id, loadMessagesFromStorage, saveMessagesToStorage]);

  /**
   * Xử lý tin nhắn mới từ WebSocket
   */
  useEffect(() => {
    onNewMessage((message: MessageResponse) => {
      // Chỉ xử lý tin nhắn của conversation hiện tại
      if (message.conversationId === conversation.id) {
        setMessages((prev) => {
          // Kiểm tra xem tin nhắn đã tồn tại chưa (tránh duplicate)
          if (prev.some((m) => m.id === message.id)) {
            console.log("⚠️ [EmployerChat] WebSocket message already exists, skipping:", message.id);
            return prev;
          }
          
          // Nếu là tin nhắn của mình, có thể đã được thêm qua REST API rồi
          if (message.senderId.toString() === user?.id) {
            console.log("ℹ️ [EmployerChat] Received own message from WebSocket:", message.id);
            
            // Xóa các tin nhắn tạm thời có nội dung giống nhau
            const messageTime = new Date(message.createdAt).getTime();
            const filteredMessages = prev.filter((m) => {
              // Giữ lại nếu không phải tin tạm
              if (m.id < 1000000000000) return true;
              
              // Xóa tin tạm nếu content giống và thời gian gần nhau (trong 10 giây)
              const tempTime = new Date(m.createdAt).getTime();
              const isSimilar = m.content === message.content && 
                               Math.abs(messageTime - tempTime) < 10000;
              return !isSimilar;
            });
            
            // Nếu sau khi lọc vẫn có tin nhắn với ID khác nhau nhưng content giống nhau
            // thì tin nhắn này đã được thêm qua REST API rồi, bỏ qua
            const hasMessageWithSameContent = filteredMessages.some((m) => 
              m.content === message.content &&
              Math.abs(new Date(m.createdAt).getTime() - messageTime) < 5000
            );
            
            if (hasMessageWithSameContent) {
              console.log("⚠️ [EmployerChat] Message with same content exists (from REST API), skipping WebSocket message");
              saveMessagesToStorage(filteredMessages);
              return filteredMessages;
            }
            
            // Nếu không có tin nhắn giống nhau, thêm vào
            const newMessages = [...filteredMessages, message];
            saveMessagesToStorage(newMessages);
            return newMessages;
          }
          
          // Tin nhắn từ người khác, thêm vào bình thường
          const newMessages = [...prev, message];
          saveMessagesToStorage(newMessages);
          return newMessages;
        });

        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Đánh dấu đã đọc nếu không phải tin nhắn của mình
        if (message.senderId.toString() !== user?.id) {
          markMessagesAsSeen(conversation.id).catch(console.error);
        }
      }
    });
  }, [conversation.id, onNewMessage, user?.id, saveMessagesToStorage]);

  /**
   * Load messages khi mount
   */
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  /**
   * Scroll to bottom khi messages thay đổi
   */
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length, loading]);

  /**
   * Gửi tin nhắn
   */
  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    const tempMessage = messageText.trim();
    setMessageText("");
    setSending(true);

    // Tạo tin nhắn tạm thời để hiển thị ngay lập tức (optimistic update)
    const tempMessageObj: MessageResponse = {
      id: Date.now(), // ID tạm thời
      conversationId: conversation.id,
      senderId: parseInt(user?.id || "0"),
      senderType: "EMPLOYER",
      senderName: user?.name || "You",
      senderAvatar: null,
      content: tempMessage,
      createdAt: new Date().toISOString(),
      seen: false,
    };

    try {
      // Thêm tin nhắn tạm thời ngay lập tức để UX mượt mà
      setMessages((prev) => {
        const newMessages = [...prev, tempMessageObj];
        saveMessagesToStorage(newMessages);
        return newMessages;
      });

      console.log("📤 [EmployerChat] Sending message...", {
        conversationId: conversation.id,
        content: tempMessage,
        isConnected
      });
      
      // Thử gửi qua WebSocket nếu connected (để realtime update)
      if (isConnected) {
        try {
          sendMessageWS(conversation.id, tempMessage);
          console.log("✅ [EmployerChat] Message sent via WebSocket");
        } catch (wsError) {
          console.warn("⚠️ [EmployerChat] WebSocket send failed:", wsError);
        }
      }
      
      // LUÔN gửi qua REST API để đảm bảo message được lưu vào database
      console.log("📤 [EmployerChat] Sending via REST API to ensure persistence...");
      const newMessage = await sendMessageAPI({
        conversationId: conversation.id,
        content: tempMessage,
      });
      
      console.log("✅ [EmployerChat] Message sent via REST API:", newMessage.id);
      
      // Xóa tin nhắn tạm và thêm tin nhắn thật từ API
      setMessages((prev) => {
        // Xóa CÁCH tin nhắn tạm thời
        const filtered = prev.filter((m) => m.id !== tempMessageObj.id);
        
        // Kiểm tra xem tin nhắn thật đã tồn tại chưa (tránh duplicate từ WebSocket)
        if (filtered.some((m) => m.id === newMessage.id)) {
          console.log("⚠️ [EmployerChat] Message already exists, skipping add:", newMessage.id);
          saveMessagesToStorage(filtered);
          return filtered;
        }
        
        const newMessages = [...filtered, newMessage];
        saveMessagesToStorage(newMessages);
        return newMessages;
      });

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error("❌ [EmployerChat] Error sending message:", error);
      console.error("❌ [EmployerChat] Error details:", error.response?.data || error.message);
      
      ToastService.error(
        "Gửi tin nhắn thất bại",
        "Vui lòng kiểm tra kết nối và thử lại"
      );
      
      // Xóa tin nhắn tạm thời nếu gửi thất bại
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempMessageObj.id);
        saveMessagesToStorage(filtered);
        return filtered;
      });
      
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
        Bắt đầu cuộc trò chuyện với ứng viên
      </Text>
    </View>
  );

  /**
   * Render header với thông tin ứng viên
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {conversation.jobSeekerAvatar ? (
          <Image
            source={{ uri: conversation.jobSeekerAvatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {conversation.jobSeekerName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.headerName} numberOfLines={1}>
          {conversation.jobSeekerName}
        </Text>
        <Text style={styles.headerJobTitle} numberOfLines={1}>
          {conversation.jobTitle}
        </Text>
      </View>

      <View style={styles.headerActions}>
        <View style={styles.connectionIndicator}>
          {isConnected ? (
            <View style={styles.connectedDot} />
          ) : (
            <View style={styles.disconnectedDot} />
          )}
        </View>
      </View>
    </View>
  );

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
      {renderHeader()}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isOwn = item.senderId.toString() === user?.id?.toString();
          console.log(`💬 [EmployerChatScreen] Message ${item.id}: senderId=${item.senderId}, userId=${user?.id}, isOwn=${isOwn}`);
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
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      {/* Input container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
          editable={!sending}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!messageText.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.primary.start} />
          ) : (
            <Ionicons
              name="send"
              size={22}
              color={
                messageText.trim()
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
  chatContainer: {
    flex: 1,
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
  avatarContainer: {
    marginRight: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary.start,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
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

export default EmployerChatScreen;
