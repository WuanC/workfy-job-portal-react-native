import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWebSocketNotifications } from '../hooks/useWebSocketNotifications';

 const  Notification = () => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    // Giả sử bạn đã lưu token sau khi login
    AsyncStorage.getItem('accessToken').then((token) => {
      setJwtToken(token);
    });
  }, []);

  const { connected, notifications } = useWebSocketNotifications(jwtToken);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
        {connected ? '🟢 Đã kết nối' : '🔴 Chưa kết nối'}
      </Text>

      <Button title="Reload" onPress={() => console.log('Reload pressed')} />

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
    </View>
  );
}
export default Notification
