import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { verifyEmployeeEmail, verifyEmployerEmail } from "../../services/authService";
import { AntDesign } from '@expo/vector-icons';
import { useI18n } from "../../hooks/useI18n";

const ConfirmEmailScreen = ({ navigation, route }: any) => {
  const { t } = useI18n();
  const { email, role } = route.params as { email: string; role: string };
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
    // debug
    // Alert replaced by toast
    const { ToastService } = require("../../services/toastService");
    if (code.length < 8) {
      ToastService.error(t('common.error'), t('auth.enter8DigitOTP'));
      return;
    }

    try {
      if (role === "employer") {
        const res = await verifyEmployerEmail({ email, code: otp.join("") });
        ToastService.success(t('common.success'), res.message);
        navigation.replace("EmployerLogin");
      }
      else if (role === "employee") {
        const res = await verifyEmployeeEmail({ email, code: otp.join("") });
        ToastService.success(t('common.success'), res.message);
        navigation.replace("Login");
      }

    } catch (err: any) {
      ToastService.error(t('common.error'), err.message || t('auth.errorOccurred'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrow-left" size={24} color="#1E293B" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('auth.confirmEmailTitle')}</Text>
          <Text style={styles.label}>
            {t('auth.confirmEmailDesc')}
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
            <Text style={styles.buttonText}>{t('auth.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
  },
  otpContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginBottom: 24 
  },
  otpInput: {
    width: 40,
    height: 48,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    color: "#1E293B",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
  },
  linkText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ConfirmEmailScreen;
