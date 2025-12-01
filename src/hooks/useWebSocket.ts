import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MessageResponse, WebSocketMessageEvent, WebSocketSeenUpdateEvent } from "../types/type";
import apiInstance from "../api/apiInstance";

// 🔹 Helper function để lấy WebSocket URL từ API base URL
const getWebSocketUrl = (): string => {
  // Lấy base URL từ API instance
  const apiBaseUrl = apiInstance.defaults.baseURL || 'http://192.168.0.102:8080/workify/api/v1';
  
  // Tách base URL: loại bỏ /api/v1 và thêm /ws
  let baseUrl: string;
  if (apiBaseUrl.includes('/api/v1')) {
    baseUrl = apiBaseUrl.replace('/api/v1', '');
  } else {
    baseUrl = apiBaseUrl.replace(/\/[^\/]+$/, '');
  }
  
  const wsUrl = `${baseUrl}/ws`;
  // console.log("🔧 [getWebSocketUrl] API Base URL:", apiBaseUrl);
  // console.log("🔧 [getWebSocketUrl] Extracted Base URL:", baseUrl);
  // console.log("🔧 [getWebSocketUrl] WebSocket URL:", wsUrl);
  
  return wsUrl;
};

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (conversationId: number, content: string) => void;
  onNewMessage: (callback: (message: MessageResponse, unreadInfo?: any) => void) => void;
  onSeenUpdate: (callback: (event: WebSocketSeenUpdateEvent) => void) => void;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Custom hook để quản lý WebSocket connection cho chat realtime
 */
export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const messageCallbackRef = useRef<((message: MessageResponse, unreadInfo?: any) => void) | null>(null);
  const seenUpdateCallbackRef = useRef<((event: WebSocketSeenUpdateEvent) => void) | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  /**
   * Kết nối WebSocket
   */
  const connect = useCallback(async () => {
    try {
      // Lấy WebSocket URL động từ API base URL
      const WS_BASE_URL = getWebSocketUrl();
      
      // console.log("🔌 [useWebSocket] ========================================");
      // console.log("🔌 [useWebSocket] Starting WebSocket connection...");
      // console.log("🔌 [useWebSocket] WS URL:", WS_BASE_URL);
      // console.log("🔌 [useWebSocket] ========================================");
      
      // Lấy access token
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        console.error("❌ [useWebSocket] Không có access token, không thể kết nối WebSocket");
        return;
      }
      // console.log("🔑 [useWebSocket] Access token found:", token.substring(0, 30) + "...");

      // Tạo SockJS instance với error handling
      // console.log("🔌 [useWebSocket] Creating SockJS instance...");
      const socket = new SockJS(WS_BASE_URL);
      
      // Log SockJS events
      socket.onopen = () => {
        // console.log("✅ [useWebSocket] SockJS connection opened");
      };
      
      socket.onerror = (error: any) => {
        console.error("❌ [useWebSocket] SockJS error:", error);
      };
      
      socket.onclose = (event: any) => {
        // console.log("🔌 [useWebSocket] SockJS connection closed:", event);
      };

      // Tạo STOMP client
      // console.log("🔌 [useWebSocket] Creating STOMP client...");
      const stompClient = new Client({
        webSocketFactory: () => socket as any,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          // console.log("🔌 [STOMP DEBUG]:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          // console.log("========================================");
          // console.log("✅ [useWebSocket] WebSocket CONNECTED successfully!");
          // console.log("✅ [useWebSocket] Client state:", {
          //   connected: stompClient.connected,
          //   active: stompClient.active,
          // });
          // console.log("========================================");
          setIsConnected(true);
          reconnectAttempts.current = 0;

          // Subscribe để nhận tin nhắn
          const subscription = stompClient.subscribe("/user/queue/messages", (message) => {
            try {
              const event = JSON.parse(message.body);
              // console.log("📩 [useWebSocket] Raw event received:", JSON.stringify(event, null, 2));
              // console.log("📩 [useWebSocket] Event type:", event.type);
              
              if (event.type === "MESSAGE") {
                const messageEvent = event as WebSocketMessageEvent;
                // console.log("📩 [useWebSocket] MESSAGE event:", messageEvent.message);
                // console.log("📩 [useWebSocket] Message conversationId:", messageEvent.message?.conversationId);
                // console.log("📩 [useWebSocket] Unread info:", messageEvent.unread);
                // console.log("📩 [useWebSocket] Callback exists:", !!messageCallbackRef.current);
                
                // Gọi callback với message và unread info
                if (messageCallbackRef.current) {
                  // console.log("📩 [useWebSocket] Calling message callback...");
                  messageCallbackRef.current(messageEvent.message, messageEvent.unread);
                  // console.log("✅ [useWebSocket] Message callback completed");
                } else {
                  // console.warn("⚠️ [useWebSocket] No message callback registered!");
                }
              } else if (event.type === "SEEN_UPDATE") {
                const seenEvent = event as WebSocketSeenUpdateEvent;
                // console.log("👁️ [useWebSocket] SEEN_UPDATE event:", seenEvent);
                
                // Gọi callback cho seen update
                if (seenUpdateCallbackRef.current) {
                  seenUpdateCallbackRef.current(seenEvent);
                }
              } else {
                // console.warn("⚠️ [useWebSocket] Unknown event type:", event.type);
              }
            } catch (error) {
              console.error("❌ [useWebSocket] Error parsing message:", error);
              console.error("❌ [useWebSocket] Raw message body:", message.body);
            }
          });
          // console.log("✅ [useWebSocket] Subscribed to /user/queue/messages");
          // console.log("✅ [useWebSocket] Subscription ID:", subscription.id);
        },
        onDisconnect: () => {
          // console.log("========================================");
          // console.log("❌ [useWebSocket] WebSocket DISCONNECTED");
          // console.log("❌ [useWebSocket] Disconnect state:", {
          //   reconnectAttempts: reconnectAttempts.current,
          //   maxReconnectAttempts,
          // });
          // console.log("========================================");
          setIsConnected(false);
          
          // Thử reconnect
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            // console.log(`🔄 [useWebSocket] Reconnecting... (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 5000 * reconnectAttempts.current);
          } else {
            console.error("❌ [useWebSocket] Max reconnect attempts reached!");
          }
        },
        onStompError: (frame) => {
          // console.error("========================================");
          console.error("❌ [useWebSocket] STOMP ERROR!");
          // console.error("❌ Error message:", frame.headers["message"]);
          // console.error("❌ Error details:", frame.body);
          // console.error("❌ Full frame:", JSON.stringify(frame, null, 2));
          // console.error("========================================");
        },
        onWebSocketClose: (event) => {
          // console.log("========================================");
          // console.log("🔌 [useWebSocket] WebSocket close event:", {
          //   code: event.code,
          //   reason: event.reason,
          //   wasClean: event.wasClean,
          // });
          // console.log("========================================");
        },
        onWebSocketError: (event) => {
          // console.error("========================================");
          console.error("❌ [useWebSocket] WebSocket ERROR event:", event);
          // console.error("========================================");
        },
      });

      // Activate connection
      // console.log("🔌 [useWebSocket] Activating STOMP client...");
      stompClient.activate();
      clientRef.current = stompClient;
      // console.log("✅ [useWebSocket] STOMP client activated");
    } catch (error) {
      console.error("❌ Error connecting WebSocket:", error);
    }
  }, []);

  /**
   * Ngắt kết nối WebSocket
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (clientRef.current?.active) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
      // console.log("🔌 WebSocket disconnected manually");
    }
  }, []);

  /**
   * Gửi tin nhắn qua WebSocket
   */
  const sendMessage = useCallback((conversationId: number, content: string) => {
    // console.log("🔍 [useWebSocket] sendMessage called:", {
    //   conversationId,
    //   content,
    //   clientExists: !!clientRef.current,
    //   clientConnected: clientRef.current?.connected,
    //   clientActive: clientRef.current?.active,
    // });

    if (!clientRef.current?.connected) {
      // console.warn("⚠️ [useWebSocket] WebSocket not connected, cannot send message");
      // console.warn("⚠️ [useWebSocket] State:", {
      //   clientExists: !!clientRef.current,
      //   isActive: clientRef.current?.active,
      //   isConnected: clientRef.current?.connected,
      // });
      return;
    }

    try {
      const payload = {
        conversationId,
        content,
      };
      // console.log("📤 [useWebSocket] Publishing to /app/chat.sendMessage:", payload);
      
      clientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(payload),
      });
      
      // console.log("✅ [useWebSocket] Message sent successfully via WebSocket");
    } catch (error) {
      console.error("❌ [useWebSocket] Error sending message:", error);
      // console.error("❌ [useWebSocket] Error details:", JSON.stringify(error, null, 2));
    }
  }, []);

  /**
   * Đăng ký callback để nhận tin nhắn mới
   */
  const onNewMessage = useCallback((callback: (message: MessageResponse, unreadInfo?: any) => void) => {
    // console.log("🔔 [useWebSocket] Registering message callback");
    messageCallbackRef.current = callback;
  }, []);

  /**
   * Đăng ký callback để nhận seen update events
   */
  const onSeenUpdate = useCallback((callback: (event: WebSocketSeenUpdateEvent) => void) => {
    seenUpdateCallbackRef.current = callback;
  }, []);

  /**
   * Auto connect khi mount
   */
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    onNewMessage,
    onSeenUpdate,
    connect,
    disconnect,
  };
};
