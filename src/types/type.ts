export type JobLocation = {
  provinceId: number;
  districtId: number;
  detailAddress: string;
};

// ========== Chat & Messaging Types ==========
export interface ConversationResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  applicationId: number;
  jobSeekerId: number;
  jobSeekerName: string;
  jobSeekerAvatar: string | null;
  employerId: number;
  employerName: string;
  employerAvatar: string | null;
  lastMessage: string | null;
  lastMessageSenderId: number | null;
  lastMessageSenderType: "USER" | "EMPLOYER" | null;
  hasEmployerMessage: boolean;
  unreadCount: number; // Số tin nhắn chưa đọc từ API (theo docs: unread_count_job_seeker hoặc unread_count_employer)
  hasUnread?: boolean; // Optional fallback field (nếu backend trả về)
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: "USER" | "EMPLOYER";
  senderName: string;
  senderAvatar: string | null;
  content: string;
  seen: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
}

// ========== WebSocket Event Types ==========
export interface WebSocketMessageEvent {
  type: "MESSAGE";
  message: MessageResponse;
  unread: {
    conversationId: number;
    unreadForRecipient: number;
    totalUnread: number;
  };
}

export interface WebSocketSeenUpdateEvent {
  type: "SEEN_UPDATE";
  conversationId: number;
  updatedByUserId: number;
  unread: {
    conversationId: number;
    unreadForJobSeeker: number;
    unreadForEmployer: number;
  };
  totalUnread: {
    jobSeeker: number;
    employer: number;
  };
}

export type WebSocketEvent = WebSocketMessageEvent | WebSocketSeenUpdateEvent;
