import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme";

const JobSubmitSucessScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color={colors.primary.light} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Nộp hồ sơ thành công!</Text>
      <Text style={styles.description}>
        Nhà tuyển dụng đã nhận được hồ sơ của bạn. Hãy chờ phản hồi trong thời gian sớm nhất.
      </Text>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>

    </View>
  );
};

export default JobSubmitSucessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  iconContainer: {
    backgroundColor: colors.primary.light + 20,
    padding: 25,
    borderRadius: 100,
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    maxWidth: 300,
  },
  button: {
    marginTop: 40,
    backgroundColor: colors.primary.start,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
