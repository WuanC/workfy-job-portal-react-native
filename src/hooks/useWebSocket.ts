import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MessageResponse } from "../types/type";

// Base URL cho WebSocket (thay đổi theo backend của bạn)
const WS_BASE_URL = "http://192.168.0.101:8080/workify/ws";

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (conversationId: number, content: string) => void;
  onNewMessage: (callback: (message: MessageResponse) => void) => void;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Custom hook để quản lý WebSocket connection cho chat realtime
 */
export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const messageCallbackRef = useRef<((message: MessageResponse) => void) | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  /**
   * Kết nối WebSocket
   */
  const connect = useCallback(async () => {
    try {
      console.log("🔌 [useWebSocket] Starting WebSocket connection...");
      console.log("🔌 [useWebSocket] WS URL:", WS_BASE_URL);
      
      // Lấy access token
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        console.warn("⚠️ [useWebSocket] Không có access token, không thể kết nối WebSocket");
        return;
      }
      console.log("🔑 [useWebSocket] Access token found:", token.substring(0, 20) + "...");

      // Tạo SockJS instance
      console.log("🔌 [useWebSocket] Creating SockJS instance...");
      const socket = new SockJS(WS_BASE_URL);

      // Tạo STOMP client
      const stompClient = new Client({
        webSocketFactory: () => socket as any,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log("🔌 STOMP:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("✅ [useWebSocket] WebSocket connected successfully");
          console.log("✅ [useWebSocket] Client state:", {
            connected: stompClient.connected,
            active: stompClient.active,
          });
          setIsConnected(true);
          reconnectAttempts.current = 0;

          // Subscribe để nhận tin nhắn
          const subscription = stompClient.subscribe("/user/queue/messages", (message) => {
            try {
              const messageData: MessageResponse = JSON.parse(message.body);
              console.log("📩 [useWebSocket] Received message:", messageData);
              
              // Gọi callback nếu có
              if (messageCallbackRef.current) {
                messageCallbackRef.current(messageData);
              }
            } catch (error) {
              console.error("❌ [useWebSocket] Error parsing message:", error);
            }
          });
          console.log("✅ [useWebSocket] Subscribed to /user/queue/messages");
        },
        onDisconnect: () => {
          console.log("❌ [useWebSocket] WebSocket disconnected");
          console.log("❌ [useWebSocket] Disconnect state:", {
            reconnectAttempts: reconnectAttempts.current,
            maxReconnectAttempts,
          });
          setIsConnected(false);
          
          // Thử reconnect
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            console.log(`🔄 [useWebSocket] Reconnecting... (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 5000 * reconnectAttempts.current);
          } else {
            console.log("❌ [useWebSocket] Max reconnect attempts reached");
          }
        },
        onStompError: (frame) => {
          console.error("❌ STOMP error:", frame.headers["message"]);
          console.error("❌ Details:", frame.body);
        },
      });

      // Activate connection
      stompClient.activate();
      clientRef.current = stompClient;
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
      console.log("🔌 WebSocket disconnected manually");
    }
  }, []);

  /**
   * Gửi tin nhắn qua WebSocket
   */
  const sendMessage = useCallback((conversationId: number, content: string) => {
    console.log("🔍 [useWebSocket] sendMessage called:", {
      conversationId,
      content,
      clientExists: !!clientRef.current,
      clientConnected: clientRef.current?.connected,
      clientActive: clientRef.current?.active,
    });

    if (!clientRef.current?.connected) {
      console.warn("⚠️ [useWebSocket] WebSocket not connected, cannot send message");
      console.warn("⚠️ [useWebSocket] State:", {
        clientExists: !!clientRef.current,
        isActive: clientRef.current?.active,
        isConnected: clientRef.current?.connected,
      });
      return;
    }

    try {
      const payload = {
        conversationId,
        content,
      };
      console.log("📤 [useWebSocket] Publishing to /app/chat.sendMessage:", payload);
      
      clientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(payload),
      });
      
      console.log("✅ [useWebSocket] Message sent successfully via WebSocket");
    } catch (error) {
      console.error("❌ [useWebSocket] Error sending message:", error);
      console.error("❌ [useWebSocket] Error details:", JSON.stringify(error, null, 2));
    }
  }, []);

  /**
   * Đăng ký callback để nhận tin nhắn mới
   */
  const onNewMessage = useCallback((callback: (message: MessageResponse) => void) => {
    messageCallbackRef.current = callback;
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
    connect,
    disconnect,
  };
};
