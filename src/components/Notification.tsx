import React, { useCallback } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWebSocketNotifications } from '../hooks/useWebSocketNotifications';
import { getNotifications, Notification as NotificationType } from '../services/notificationService';

const Notification = () => {
  const queryClient = useQueryClient();

  // 🔹 Query để lấy danh sách thông báo
  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notifications', 1],
    queryFn: () => getNotifications(1, 10),
  });

  // 🔹 Callback khi nhận được thông báo mới từ WebSocket
  const handleNewNotification = useCallback(
    (notification: NotificationType) => {
      // Invalidate queries để refetch danh sách
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    [queryClient]
  );

  // 🔹 Kết nối WebSocket
  const { connected } = useWebSocketNotifications(handleNewNotification);

  const notifications = notificationsData?.items || [];

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
    };

      <Button title="Reload" onPress={() => refetch()} />

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          style={{ marginTop: 20 }}
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderColor: '#ccc',
                backgroundColor: item.readFlag ? '#fff' : '#eef',
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>{item.content}</Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Notification;
