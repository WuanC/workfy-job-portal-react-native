import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

// Thay bằng logo thật của bạn
const careerLinkLogo = require("../../../assets/App/logoJob.png")
const vietCVLogo = require("../../../assets/App/logoJob.png")
type JobSubmitSuccessNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "JobSubmitSuccess"
>;
export default function JobSubmitScreen() {
    const [coverSelected, setCoverSelected] = useState(false);
    const [saveChecked, setSaveChecked] = useState(false);
    const navigation = useNavigation<JobSubmitSuccessNavigationProp>();
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backBtn, { paddingVertical: 20, paddingHorizontal: 5}]} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Nộp đơn cho</Text>
                    <Text style={styles.jobTitle}>
                        NHÂN VIÊN CHĂM SÓC KHÁCH HÀNG THƯƠNG MẠI ĐIỆN TỬ TIẾNG NHẬT - N1/N2
                    </Text>
                </View>
            </View>

            {/* Form */}
            <ScrollView contentContainerStyle={styles.form}>
                {/* User Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.userRow}>
                        <Ionicons name="person-circle-outline" size={48} color="#555" />
                        <View>
                            <Text style={styles.name}>Wuan C</Text>
                            <Text style={styles.email}>bo11082007@gmail.com</Text>
                        </View>
                    </View>

                    <Text style={styles.label}>
                        Số điện thoại <Text style={{ color: "red" }}>*</Text>
                    </Text>
                    <TextInput
                        placeholder="Nhập số điện thoại của bạn"
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Resume Section */}
                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>Hồ sơ xin việc</Text>
                    <Text style={styles.subLabel}>
                        Nhà tuyển dụng yêu cầu hồ sơ:{" "}
                        <Text style={styles.highlight}>Tiếng Việt</Text>
                    </Text>

                    {/* CareerLink */}
                    <TouchableOpacity style={styles.option}>
                        <Image source={careerLinkLogo} style={styles.logo} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.optionTitle}>Từ CareerLink</Text>
                            <Text style={styles.optionDesc}>Bạn chưa có hồ sơ trên CareerLink</Text>
                        </View>
                    </TouchableOpacity>

                    {/* VietCV */}
                    <TouchableOpacity style={styles.option}>
                        <Image source={vietCVLogo} style={styles.logo} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.optionTitle}>Từ VietCV</Text>
                            <Text style={styles.optionDesc}>Ứng tuyển từ VietCV hồ sơ</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Upload */}
                    <TouchableOpacity style={styles.uploadBox}>
                        <MaterialIcons name="upload-file" size={24} color="#007bff" />
                        <Text style={styles.uploadText}>Tải lên từ điện thoại của bạn</Text>
                    </TouchableOpacity>
                </View>

                {/* Cover Letter Section */}
                <View style={styles.infoContainer}>
                    <View style={styles.letterTitleRow}>
                        <Text style={styles.sectionTitle}>Thư xin việc</Text>
                        <Text style={{ color: "#666" }}> Không bắt buộc</Text>
                    </View>

                    {/* Cell */}
                    <TouchableOpacity
                        style={[styles.cell, coverSelected && styles.cellActive]}
                        onPress={() => setCoverSelected(!coverSelected)}
                    >
                        <View style={styles.cellLeft}>
                            <MaterialIcons name="email" size={28} color="#007bff" />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.cellTitle}>Tạo thư xin việc</Text>
                                <Text style={styles.cellDesc}>
                                    Chứng tỏ với nhà tuyển dụng bạn là một ứng viên tiềm năng
                                </Text>
                            </View>
                        </View>

                        <View style={styles.radioOuter}>
                            {coverSelected && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Form khi chọn */}
                    {coverSelected && (
                        <View style={styles.coverForm}>
                            <TextInput
                                placeholder="Tiêu đề thư"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Nội dung thư"
                                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                                multiline
                            />
                            <View style={styles.checkboxRow}>
                                <Checkbox
                                    value={saveChecked}
                                    onValueChange={setSaveChecked}
                                    color={saveChecked ? "#007bff" : undefined}
                                />
                                <Text style={{ marginLeft: 8 }}>Lưu thư xin việc này</Text>
                            </View>
                            <TouchableOpacity style={styles.selectBtn}>
                                <Text style={{ color: "#007bff", fontWeight: "600" }}>
                                    Chọn thư xin việc khác
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Submit button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} onPress={() => navigation.replace("JobSubmitSuccess")}>
                    <Text style={styles.submitText}>Nộp đơn ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#e1eff5ff" },

    // Header
    backBtn: { marginRight: 12 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#fff",
    },
    headerTitle: { fontSize: 14, fontWeight: "500", color: "#333" },
    jobTitle: { fontSize: 16, fontWeight: "700", marginTop: 4, color: "#000" },

    // Form
    form: { marginTop: 1 },
    userRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    name: { fontSize: 16, fontWeight: "600", marginBottom: 2, color: "#000" },
    email: { fontSize: 14, color: "#666" },
    label: { fontSize: 14, fontWeight: "500", marginTop: 12, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        fontSize: 14,
        backgroundColor: "#fff",
        marginTop: 8,
    },

    // Resume Section
    sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 6 },
    subLabel: { fontSize: 14, marginBottom: 12, color: "#555" },
    highlight: { color: "red", fontWeight: "600" },
    option: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    logo: { width: 32, height: 32, marginRight: 12, resizeMode: "contain" },
    optionTitle: { fontSize: 14, fontWeight: "600", color: "#000" },
    optionDesc: { fontSize: 12, color: "#666" },
    uploadBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#007bff",
        borderStyle: "dashed",
        padding: 14,
        borderRadius: 6,
        marginTop: 8,
    },
    uploadText: { fontSize: 14, color: "#007bff", fontWeight: "600", marginLeft: 8 },

    // Footer
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#ddd" },
    submitButton: {
        backgroundColor: "#007bff",
        padding: 14,
        borderRadius: 6,
        alignItems: "center",
    },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },

    // Cover Letter
    infoContainer: {
        backgroundColor: "#ffffffff",
        marginTop: 10,
        padding: 16,
    },
    cell: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        backgroundColor: "#fff",
        marginTop: 8,
    },
    cellActive: {
        backgroundColor: "#eaf2ff",
        borderColor: "#007bff",
    },
    cellLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 30 },
    cellTitle: { fontSize: 14, fontWeight: "600", color: "#000" },
    cellDesc: { fontSize: 12, color: "#666", marginTop: 2 },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#007bff",
        alignItems: "center",
        justifyContent: "center",
    },
    letterTitleRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between", // 👈 thêm dòng này
            marginBottom: 12
        },
        radioInner: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: "#007bff",
        },
        coverForm: { marginTop: 12 },
        checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
        selectBtn: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            padding: 12,
            marginTop: 12,
            alignItems: "center",
            backgroundColor: "#fff",
        },
    });
