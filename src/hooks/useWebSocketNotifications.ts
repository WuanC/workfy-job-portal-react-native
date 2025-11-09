import { useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '../services/notificationService';
import apiInstance from '../api/apiInstance';

// 🔹 Helper function để lấy WebSocket URL từ API base URL
const getWebSocketUrl = (): string => {
  // Lấy base URL từ API instance (http://192.168.0.102:8080/workify/api/v1)
  // Tách ra để lấy base: http://192.168.0.102:8080/workify
  const apiBaseUrl = apiInstance.defaults.baseURL || 'http://192.168.0.102:8080/workify/api/v1';
  
  // Tách base URL: loại bỏ /api/v1 và thêm /ws
  // Nếu baseURL không có /api/v1, giả sử nó đã là base URL
  let baseUrl: string;
  if (apiBaseUrl.includes('/api/v1')) {
    baseUrl = apiBaseUrl.replace('/api/v1', '');
  } else {
    // Nếu không có /api/v1, lấy base URL bằng cách loại bỏ phần cuối
    baseUrl = apiBaseUrl.replace(/\/[^\/]+$/, '');
  }
  
  const wsUrl = `${baseUrl}/ws`;
  
  console.log('[WebSocket] 🔗 API Base URL:', apiBaseUrl);
  console.log('[WebSocket] 🔗 Extracted Base URL:', baseUrl);
  console.log('[WebSocket] 🔗 WebSocket URL:', wsUrl);
  
  return wsUrl;
};

// 🔹 Hook chính để quản lý WebSocket notifications
export const useWebSocketNotifications = (
  onNotificationReceived?: (notification: Notification) => void
) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(async () => {
    // ⚠️ Không chạy WebSocket trên web browser (có vấn đề CORS)
    // WebSocket chỉ hoạt động tốt trên React Native (Android/iOS)
    if (Platform.OS === 'web') {
      console.log('[WebSocket] ⚠️ WebSocket không được hỗ trợ trên web browser do CORS. Chỉ hoạt động trên React Native.');
      setConnectionError('WebSocket không hỗ trợ trên web browser');
      return;
    }

    try {
      console.log('[WebSocket] 🔄 Bắt đầu kết nối WebSocket...');
      
      const jwtToken = await AsyncStorage.getItem('accessToken');
      if (!jwtToken) {
        const errorMsg = '⚠️ Chưa có token, không thể kết nối WebSocket';
        console.log('[WebSocket]', errorMsg);
        setConnectionError(errorMsg);
        return;
      }

      console.log('[WebSocket] ✅ Đã lấy JWT token');
      console.log('[WebSocket] 🔑 Token length:', jwtToken.length);

      const socketUrl = getWebSocketUrl();
      console.log('[WebSocket] 🔌 Đang tạo SockJS connection đến:', socketUrl);
      
      const socket = new SockJS(socketUrl);
      
      // Thêm event listeners cho SockJS để debug
      socket.onopen = () => {
        console.log('[WebSocket] ✅ SockJS connection opened');
      };
      
      socket.onclose = (event: CloseEvent) => {
        console.log('[WebSocket] 🔌 SockJS connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setConnectionError(`SockJS closed: ${event.code} - ${event.reason || 'No reason'}`);
      };
      
      socket.onerror = (error: Event) => {
        console.error('[WebSocket] ❌ SockJS error:', error);
        setConnectionError(`SockJS error: ${error.type || 'Unknown error'}`);
      };

      console.log('[WebSocket] 🔧 Đang tạo STOMP client...');
      
      const stompClient = new Client({
        webSocketFactory: () => socket as WebSocket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
        debug: (msg) => {
          // Log tất cả debug messages trong development
          if (__DEV__) {
            console.log('[WebSocket] [STOMP Debug]', msg);
          }
        },
        onConnect: (frame) => {
          console.log('[WebSocket] ✅ STOMP connected successfully!');
          console.log('[WebSocket] 📋 CONNECT frame:', {
            command: frame.command,
            headers: frame.headers
          });
          
          setConnected(true);
          setConnectionError(null);
          reconnectAttemptsRef.current = 0;

          // Subscribe vào hàng đợi thông báo cá nhân
          console.log('[WebSocket] 📬 Đang subscribe vào /user/queue/notifications...');
          
          subscriptionRef.current = stompClient.subscribe(
            '/user/queue/notifications',
            (message: IMessage) => {
              try {
                console.log('[WebSocket] 📨 Nhận được message từ server');
                console.log('[WebSocket] 📄 Message headers:', message.headers);
                console.log('[WebSocket] 📄 Message body:', message.body);
                
                const notification: Notification = JSON.parse(message.body);
                console.log('[WebSocket] 📨 Nhận được thông báo mới:', notification);

                // Gọi callback nếu có
                if (onNotificationReceived) {
                  onNotificationReceived(notification);
                }

                // Hiển thị toast cho thông báo mới (non-blocking)
                try {
                  const { ToastService } = require('../services/toastService');
                  // Nếu backend trả loại thông báo, có thể map sang success/error/warning
                  // Mặc định dùng info
                  ToastService.info(notification.title || 'Thông báo mới', notification.content || undefined);
                } catch (e) {
                  console.warn('[WebSocket] ToastService unavailable', e);
                }
              } catch (e) {
                console.error('[WebSocket] ❌ Lỗi parse notification:', e);
                console.error('[WebSocket] ❌ Raw message body:', message.body);
              }
            },
            {
              // Thêm headers nếu cần
            }
          );
          
          console.log('[WebSocket] ✅ Đã subscribe thành công vào /user/queue/notifications');
        },
        onStompError: (frame) => {
          const errorMsg = frame.headers?.message || 'Unknown STOMP error';
          console.error('[WebSocket] ❌ STOMP error:', {
            command: frame.command,
            headers: frame.headers,
            body: frame.body,
            message: errorMsg
          });
          setConnected(false);
          setConnectionError(`STOMP error: ${errorMsg}`);
          
          // Retry connection nếu chưa vượt quá số lần thử
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            console.log(`[WebSocket] 🔄 Sẽ thử kết nối lại (lần ${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          } else {
            console.error('[WebSocket] ❌ Đã vượt quá số lần thử kết nối lại');
            setConnectionError('Không thể kết nối WebSocket sau nhiều lần thử');
          }
        },
        onWebSocketClose: (event) => {
          console.log('[WebSocket] 🔌 WebSocket closed:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          setConnected(false);
          setConnectionError(`WebSocket closed: ${event.code} - ${event.reason || 'No reason'}`);
        },
        onDisconnect: () => {
          console.log('[WebSocket] 🔌 WebSocket disconnected');
          setConnected(false);
        },
        onWebSocketError: (event) => {
          // Xử lý lỗi WebSocket (CORS, network, etc.)
          console.error('[WebSocket] ❌ WebSocket error:', event);
          console.error('[WebSocket] ❌ Error type:', event.type);
          console.error('[WebSocket] ❌ Error target:', event.target);
          setConnected(false);
          setConnectionError(`WebSocket error: ${event.type}`);
        },
      });

      console.log('[WebSocket] 🚀 Đang activate STOMP client...');
      stompClient.activate();
      stompClientRef.current = stompClient;
      
      console.log('[WebSocket] ✅ STOMP client đã được activate');
    } catch (error: any) {
      console.error('[WebSocket] ❌ Lỗi khi kết nối WebSocket:', error);
      console.error('[WebSocket] ❌ Error message:', error.message);
      console.error('[WebSocket] ❌ Error stack:', error.stack);
      setConnected(false);
      setConnectionError(`Connection error: ${error.message || 'Unknown error'}`);
    }
  }, [onNotificationReceived]);

  const disconnect = useCallback(() => {
    console.log('[WebSocket] 🔌 Đang disconnect WebSocket...');
    
    if (subscriptionRef.current) {
      console.log('[WebSocket] 🔌 Unsubscribing từ /user/queue/notifications...');
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    if (stompClientRef.current) {
      console.log('[WebSocket] 🔌 Deactivating STOMP client...');
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    
    setConnected(false);
    setConnectionError(null);
    reconnectAttemptsRef.current = 0;
    
    console.log('[WebSocket] ✅ Đã disconnect thành công');
  }, []);

  useEffect(() => {
    console.log('[WebSocket] 🎯 Hook mounted, bắt đầu kết nối...');
    connect();

    return () => {
      console.log('[WebSocket] 🎯 Hook unmounted, đang cleanup...');
      disconnect();
    };
  }, [connect, disconnect]);

  return { 
    connected, 
    connectionError,
    connect, 
    disconnect 
  };
};
