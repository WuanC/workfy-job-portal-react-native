import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { Alert } from 'react-native';

// 🔹 Kiểu Notification (theo backend của bạn)
export interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'NEW_APPLICATION' | 'APPLICATION_STATUS_UPDATE';
  link: string;
  jobId: number;
  applicationId: number;
  readFlag: boolean;
  createdAt: string;
}

// 🔹 Hook chính
export const useWebSocketNotifications = (jwtToken: string | null) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!jwtToken) return; // Chưa có token thì không connect

    const socketUrl = 'http://192.168.0.102:8080/ws'; // đổi sang domain thật khi deploy
    const socket = new SockJS(socketUrl);

    const stompClient = new Client({
      webSocketFactory: () => socket as WebSocket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
      debug: (msg) => console.log(msg),
      onConnect: () => {
        console.log('✅ WebSocket connected');
        setConnected(true);

        stompClient.subscribe('/user/queue/notifications', (message: IMessage) => {
          try {
            const notification: Notification = JSON.parse(message.body);
            setNotifications((prev) => [notification, ...prev]);
            Alert.alert('🔔 Thông báo mới', notification.title);
          } catch (e) {
            console.error('Parse error:', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame);
      },
      onWebSocketClose: () => {
        console.log('🔌 WebSocket closed');
        setConnected(false);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClientRef.current?.deactivate();
    };
  }, [jwtToken]);

  return { connected, notifications };
};
