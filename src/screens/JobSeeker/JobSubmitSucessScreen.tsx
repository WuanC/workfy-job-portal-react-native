import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const JobSubmitSucessScreen = () => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Thành công</Text>

            {/* Icon check */}
            <View style={styles.iconWrapper}>
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            </View>

            {/* Thông báo */}
            <Text style={styles.successText}>Bạn đã nộp hồ sơ thành công</Text>
            <Text style={styles.subText}>
                Đơn đăng ký Middle/Senior Unity Game Developer (C#) - Thu Nhập
                Lên Đến 50 Triệu/Tháng của bạn đã được gửi. Chúc bạn ứng tuyển
                thành công!
            </Text>

            {/* Box lưu CV */}
            <View style={styles.saveBox}>
                <Text style={styles.saveTitle}>Dùng lại CV lần sau?</Text>
                <Text style={styles.saveSub}>
                    Lưu Test-Documentation.pdf vào tủ hồ sơ trên CareerLink và
                    ứng tuyển nhanh hơn lần sau
                </Text>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>
                        Lưu CV vào tủ hồ sơ
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Quay lại */}
            <TouchableOpacity>
                <Text style={styles.backText}>Quay lại</Text>
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
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: "600",
        marginVertical: 15,
        color: "#000",
    },
    iconWrapper: {
        marginVertical: 10,
    },
    successText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        textAlign: "center",
        marginTop: 10,
    },
    subText: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
    saveBox: {
        backgroundColor: "#E6F7E6",
        padding: 15,
        borderRadius: 8,
        marginVertical: 20,
        width: "100%",
    },
    saveTitle: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 5,
        color: "#000",
    },
    saveSub: {
        fontSize: 13,
        color: "#333",
        marginBottom: 12,
    },
    saveButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    backText: {
        color: "#007BFF",
        fontSize: 14,
        marginTop: 15,
    },
});
