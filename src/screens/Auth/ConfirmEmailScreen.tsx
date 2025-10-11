import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ConfirmEmailScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Xác nhận email thành công!</Text>
      <Text style={styles.message}>
        Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập để tiếp tục.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.buttonText}>Đăng nhập ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1976d2", marginBottom: 10 },
  message: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 30 },
  button: { backgroundColor: "#1976d2", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ConfirmEmailScreen;
