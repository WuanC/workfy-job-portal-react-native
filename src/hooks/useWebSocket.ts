import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MessageResponse, WebSocketMessageEvent, WebSocketSeenUpdateEvent } from "../types/type";
import apiInstance from "../api/apiInstance";

// 🔹 SINGLETON - Shared state cho tất cả components
let sharedClient: Client | null = null;
let sharedIsConnected = false;
let connectionPromise: Promise<void> | null = null;
const messageCallbacks = new Set<(message: MessageResponse, unreadInfo?: any) => void>();
const seenUpdateCallbacks = new Set<(event: WebSocketSeenUpdateEvent) => void>();
const stateListeners = new Set<(connected: boolean) => void>();

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
 * Sử dụng Singleton pattern - chỉ 1 connection cho toàn app
 */
export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(sharedIsConnected);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Đăng ký listener để nhận state updates
  useEffect(() => {
    stateListeners.add(setIsConnected);
    return () => {
      stateListeners.delete(setIsConnected);
    };
  }, []);

  /**
   * Kết nối WebSocket
   */
  const connect = useCallback(async () => {
    // Nếu đã connected hoặc đang connect, dùng lại connection
    if (sharedClient?.connected) {
      console.log("🔌 [useWebSocket] Already connected, reusing connection");
      setIsConnected(true);
      return;
    }

    if (connectionPromise) {
      console.log("🔌 [useWebSocket] Connection in progress, waiting...");
      await connectionPromise;
      setIsConnected(sharedIsConnected);
      return;
    }

    console.log("🔌 [useWebSocket] Starting NEW connection...");

    connectionPromise = (async () => {
      try {
        const WS_BASE_URL = getWebSocketUrl();
        console.log("🔌 [useWebSocket] WS URL:", WS_BASE_URL);
        
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          console.error("❌ [useWebSocket] No access token");
          connectionPromise = null;
          return;
        }
        console.log("🔑 [useWebSocket] Token found");

        const socket = new SockJS(WS_BASE_URL);
      
      // Log SockJS events
        socket.onopen = () => {
          console.log("✅ [useWebSocket] SockJS opened");
        };
        
        socket.onerror = (error: any) => {
          console.error("❌ [useWebSocket] SockJS error:", error);
        };

        console.log("🔌 [useWebSocket] Creating STOMP client...");
        const stompClient = new Client({
          webSocketFactory: () => socket as any,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => {
            if (str.includes('CONNECTED')) {
              console.log("🔌 [STOMP]:", str);
            }
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log("✅ [useWebSocket] STOMP CONNECTED!");
            sharedIsConnected = true;
            stateListeners.forEach(listener => listener(true));
            reconnectAttempts.current = 0;

            // Subscribe để nhận tin nhắn
            stompClient.subscribe("/user/queue/messages", (message) => {
              try {
                const event = JSON.parse(message.body);
                
                if (event.type === "MESSAGE") {
                  const messageEvent = event as WebSocketMessageEvent;
                  // Gọi TẤT CẢ callbacks đã đăng ký
                  messageCallbacks.forEach(callback => {
                    try {
                      callback(messageEvent.message, messageEvent.unread);
                    } catch (err) {
                      console.error("❌ [useWebSocket] Callback error:", err);
                    }
                  });
                } else if (event.type === "SEEN_UPDATE") {
                  const seenEvent = event as WebSocketSeenUpdateEvent;
                  // Gọi TẤT CẢ callbacks đã đăng ký
                  seenUpdateCallbacks.forEach(callback => {
                    try {
                      callback(seenEvent);
                    } catch (err) {
                      console.error("❌ [useWebSocket] Callback error:", err);
                    }
                  });
                }
              } catch (error) {
                console.error("❌ [useWebSocket] Error parsing message:", error);
              }
            });
            console.log("✅ [useWebSocket] Subscribed to /user/queue/messages");
          },
          onDisconnect: () => {
            console.log("❌ [useWebSocket] DISCONNECTED");
            sharedIsConnected = false;
            stateListeners.forEach(listener => listener(false));
            
            // Thử reconnect
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current += 1;
              console.log(`🔄 [useWebSocket] Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
              
              reconnectTimeoutRef.current = setTimeout(() => {
                connectionPromise = null;
                connect();
              }, 5000 * reconnectAttempts.current);
            } else {
              console.error("❌ [useWebSocket] Max reconnect attempts reached!");
            }
          },
          onStompError: (frame) => {
            console.error("❌ [useWebSocket] STOMP ERROR:", frame.headers["message"]);
            sharedIsConnected = false;
            stateListeners.forEach(listener => listener(false));
          },
        });

        console.log("🔌 [useWebSocket] Activating STOMP...");
        stompClient.activate();
        sharedClient = stompClient;
        console.log("✅ [useWebSocket] STOMP activated");
      } catch (error) {
        console.error("❌ [useWebSocket] Connection error:", error);
        connectionPromise = null;
      }
    })();

    await connectionPromise;
  }, []);

  /**
   * Ngắt kết nối WebSocket (chỉ khi cần thiết)
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    // Singleton: Không disconnect khi component unmount
    console.log("🔌 [useWebSocket] Component unmounting, keeping connection alive");
  }, []);

  /**
   * Gửi tin nhắn qua WebSocket
   */
  const sendMessage = useCallback((conversationId: number, content: string) => {
    if (!sharedClient?.connected) {
      console.warn("⚠️ [useWebSocket] WebSocket not connected");
      return;
    }

    try {
      const payload = { conversationId, content };
      sharedClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(payload),
      });
      console.log("✅ [useWebSocket] Message sent");
    } catch (error) {
      console.error("❌ [useWebSocket] Error sending message:", error);
    }
  }, []);

  /**
   * Đăng ký callback để nhận tin nhắn mới
   */
  const onNewMessage = useCallback((callback: (message: MessageResponse, unreadInfo?: any) => void) => {
    console.log("🔔 [useWebSocket] Registering message callback");
    messageCallbacks.add(callback);
    // Cleanup khi component unmount
    return () => {
      messageCallbacks.delete(callback);
    };
  }, []);

  /**
   * Đăng ký callback để nhận seen update events
   */
  const onSeenUpdate = useCallback((callback: (event: WebSocketSeenUpdateEvent) => void) => {
    console.log("👁️ [useWebSocket] Registering seen update callback");
    seenUpdateCallbacks.add(callback);
    // Cleanup khi component unmount
    return () => {
      seenUpdateCallbacks.delete(callback);
    };
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
