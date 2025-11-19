import apiInstance from "../api/apiInstance";
import { ConversationResponse, MessageResponse, SendMessageRequest } from "../types/type";

// apiInstance đã có baseURL: http://192.168.0.101:8080/workify/api/v1
// Nên chỉ cần path tương đối từ đó

// ========== Conversations ==========

/**
 * Lấy danh sách tất cả conversations của user hiện tại
 */
export const getConversations = async (): Promise<ConversationResponse[]> => {
  console.log("🔍 Calling GET /conversations");
  try {
    const response = await apiInstance.get("/conversations");
    console.log("✅ Conversations response:", response.data);
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
  const response = await apiInstance.get(
    `/conversations/application/${applicationId}`
  );
  return response.data.data;
};

// ========== Messages ==========

/**
 * Lấy lịch sử tin nhắn của một conversation
 */
export const getMessages = async (
  conversationId: number
): Promise<MessageResponse[]> => {
  console.log("🔍 Calling GET /messages/" + conversationId);
  try {
    const response = await apiInstance.get(`/messages/${conversationId}`);
    console.log("✅ Messages response:", response.data);
    console.log("✅ Number of messages:", response.data.data?.length || 0);
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
  const response = await apiInstance.post("/messages", data);
  return response.data.data;
};

/**
 * Đánh dấu tất cả tin nhắn trong conversation là đã đọc
 */
export const markMessagesAsSeen = async (
  conversationId: number
): Promise<void> => {
  await apiInstance.put(`/messages/${conversationId}/seen`);
};
