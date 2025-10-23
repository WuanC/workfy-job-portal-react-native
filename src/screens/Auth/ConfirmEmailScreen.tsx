import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { verifyEmployerEmail } from "../../services/authService";

const ConfirmEmailScreen = ({ navigation, route }: any) => {
  const { email } = route.params as { email: string };
  const [otp, setOtp] = useState(Array(8).fill(""));
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 7) inputs.current[index + 1]?.focus();
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleConfirm = async () => {
    const code = otp.join("");
    Alert.alert(email + " " + code);
    if (code.length < 8) {
      alert("Vui lòng nhập đủ 8 chữ số OTP.");
      return;
    }

    try {

      const res = await verifyEmployerEmail({ email, code: otp.join("") });
      Alert.alert("Thành công", res.message);
      navigation.replace("EmployerLogin");
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔒 Nhập mã OTP xác nhận</Text>
      <Text style={styles.message}>
        Chúng tôi đã gửi mã xác nhận gồm 8 chữ số đến email của bạn.
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputs.current[index] = ref; }}

            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
                inputs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Login")}>
        <Text style={styles.linkText}>Đăng nhập ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1976d2", marginBottom: 10 },
  message: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 30 },
  otpContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 30 },
  otpInput: {
    width: 40,
    height: 50,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    color: "#000",
  },
  button: { backgroundColor: "#1976d2", paddingVertical: 14, paddingHorizontal: 60, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  linkText: { color: "#1976d2", marginTop: 20, fontSize: 15 },
});

export default ConfirmEmailScreen;
