import apiInstance from "../api/apiInstance";
import { ConversationResponse, MessageResponse, SendMessageRequest } from "../types/type";

// apiInstance đã có baseURL: http://192.168.0.101:8080/workify/api/v1
// Nên chỉ cần path tương đối từ đó

// ========== Conversations ==========

/**
 * Lấy danh sách tất cả conversations của user hiện tại
 */
export const getConversations = async (): Promise<ConversationResponse[]> => {
  try {
    const response = await apiInstance.get("/conversations");
    return response.data.data;
  } catch (error: any) {
    console.error("❌ getConversations error:", error.response?.status, error.response?.data);
    throw error;
  }
};

/**
 * Lấy conversation theo applicationId
 */
export const getConversationByApplicationId = async (
  applicationId: number
): Promise<ConversationResponse> => {
  console.log("🔍 Calling GET /conversations/application/" + applicationId);
  try {
    const response = await apiInstance.get(
      `/conversations/application/${applicationId}`
    );
    return response.data.data;
  } catch (error: any) {
    console.error("❌ getConversationByApplicationId error:", error.response?.status, error.response?.data);
    throw error;
  }
};

// ========== Messages ==========

/**
 * Lấy lịch sử tin nhắn của một conversation
 */
export const getMessages = async (
  conversationId: number
): Promise<MessageResponse[]> => {
  try {
    const response = await apiInstance.get(`/messages/${conversationId}`);
    return response.data.data || [];
  } catch (error: any) {
    console.error("❌ getMessages error:", error.response?.status, error.response?.data);
    throw error;
  }
};

/**
 * Gửi tin nhắn qua REST API (fallback nếu WebSocket không hoạt động)
 */
export const sendMessage = async (
  data: SendMessageRequest
): Promise<MessageResponse> => {
  console.log("📤 Sending message via REST:", { conversationId: data.conversationId, contentLength: data.content.length });
  try {
    const response = await apiInstance.post("/messages", data);
    console.log("✅ Message sent:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ sendMessage error:", error.response?.status, error.response?.data);
    throw error;
  }
};

/**
 * Đánh dấu tất cả tin nhắn trong conversation là đã đọc
 */
export const markMessagesAsSeen = async (
  conversationId: number
): Promise<void> => {
  try {
    console.log("Marking messages as seen for conversationId:", conversationId);
    await apiInstance.put(`/messages/${conversationId}/seen`);
  } catch (error: any) {
    console.error("❌ markMessagesAsSeen error:", error.response?.status, error.response?.data);
    throw error;
  }
};

/**
 * Lấy tổng số tin nhắn chưa đọc của user hiện tại
 * Workaround: Tính từ conversations vì endpoint /messages/unread-count có routing conflict với /messages/{conversationId}
 * API spec: GET /api/v1/messages/unread-count (backend cần fix routing để endpoint này hoạt động)
 */
export const getUnreadMessagesCount = async (): Promise<number> => {
  console.log("🔍 Calculating total unread count from conversations");
  try {
    const conversations = await getConversations();
    // Tính tổng số tin nhắn chưa đọc từ tất cả conversations
    const totalUnread = conversations.reduce((sum, conv) => {
      return sum + (conv.unreadCount || 0);
    }, 0);
    return totalUnread;
  } catch (error: any) {
    console.error("❌ getUnreadMessagesCount error:", error.response?.status, error.response?.data);
    return 0; // Trả về 0 nếu có lỗi
  }
};
