import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface WebSocketStatusBannerProps {
  isConnected: boolean;
  onReconnect?: () => void;
  message?: string;
}

export const WebSocketStatusBanner: React.FC<WebSocketStatusBannerProps> = ({
  isConnected,
  onReconnect,
  message,
}) => {
  if (isConnected) {
    return null; // Không hiển thị gì khi đã kết nối
  }

  return (
    <View style={styles.banner}>
      <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
      <Text style={styles.text}>
        {message || "Đang kết nối WebSocket..."}
      </Text>
      {onReconnect && (
        <TouchableOpacity style={styles.reconnectBtn} onPress={onReconnect}>
          <Ionicons name="refresh" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FF9800",
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  reconnectBtn: {
    marginLeft: 8,
    padding: 4,
  },
});
