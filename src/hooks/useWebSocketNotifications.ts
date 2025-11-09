import { useEffect, useRef, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '../services/notificationService';

// 🔹 Hook chính để quản lý WebSocket notifications
export const useWebSocketNotifications = (
  onNotificationReceived?: (notification: Notification) => void
) => {
  const [connected, setConnected] = useState<boolean>(false);
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null);

  const connect = useCallback(async () => {
    // ⚠️ Không chạy WebSocket trên web browser (có vấn đề CORS)
    // WebSocket chỉ hoạt động tốt trên React Native (Android/iOS)
    if (Platform.OS === 'web') {
      console.log('⚠️ WebSocket không được hỗ trợ trên web browser do CORS. Chỉ hoạt động trên React Native.');
      return;
    }

    try {
      const jwtToken = await AsyncStorage.getItem('accessToken');
      if (!jwtToken) {
        console.log('⚠️ Chưa có token, không thể kết nối WebSocket');
        return;
      }

      const socketUrl = 'http://localhost:8080/ws';
      const socket = new SockJS(socketUrl);

      const stompClient = new Client({
        webSocketFactory: () => socket as WebSocket,
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
        debug: (msg) => {
          // Chỉ log errors và important messages để tránh spam console
          if (__DEV__ && (msg.includes('error') || msg.includes('ERROR') || msg.includes('connected') || msg.includes('CONNECTED'))) {
            console.log('[WebSocket]', msg);
          }
        },
        onConnect: () => {
          console.log('✅ WebSocket connected');
          setConnected(true);

          // Subscribe vào hàng đợi thông báo cá nhân
          subscriptionRef.current = stompClient.subscribe(
            '/user/queue/notifications',
            (message: IMessage) => {
              try {
                const notification: Notification = JSON.parse(message.body);
                console.log('📨 Nhận được thông báo mới:', notification);

                // Gọi callback nếu có
                if (onNotificationReceived) {
                  onNotificationReceived(notification);
                }
              } catch (e) {
                console.error('❌ Lỗi parse notification:', e);
              }
            }
          );
        },
        onStompError: (frame) => {
          console.error('❌ STOMP error:', frame.headers?.message || frame);
          setConnected(false);
        },
        onWebSocketClose: () => {
          if (__DEV__) {
            console.log('🔌 WebSocket closed');
          }
          setConnected(false);
        },
        onDisconnect: () => {
          if (__DEV__) {
            console.log('🔌 WebSocket disconnected');
          }
          setConnected(false);
        },
        onWebSocketError: (event) => {
          // Xử lý lỗi WebSocket (CORS, network, etc.)
          console.error('❌ WebSocket error:', event);
          setConnected(false);
        },
      });

      stompClient.activate();
      stompClientRef.current = stompClient;
    } catch (error) {
      console.error('❌ Lỗi khi kết nối WebSocket:', error);
      setConnected(false);
    }
  }, [onNotificationReceived]);

  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { connected, connect, disconnect };
};
