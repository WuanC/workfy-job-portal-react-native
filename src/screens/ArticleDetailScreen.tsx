import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import { getPostById, Post } from "../services/postService";
import { useNavigation } from "@react-navigation/native";

export default function ArticleDetailScreen({ route }: any) {
    const navigation = useNavigation();
    const { id } = route.params as { id: number };
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const data = await getPostById(id);
            setPost(data);
        } catch (err: any) {
            if (err.response?.status === 404)
                setError("Không tìm thấy bài viết.");
            else if (err.response?.status === 403)
                setError("Bài viết chưa được công khai.");
            else setError("Đã xảy ra lỗi khi tải bài viết.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Hàm xử lý ngày an toàn
    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "—";
        return date.toLocaleDateString("vi-VN");
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryBtn}
                    onPress={() => {
                        setError(null);
                        setLoading(true);
                        fetchPost();
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={22} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{post?.title ?? "Bài viết"}</Text>
                <View style={{ width: 38 }} />
            </View>

            {/* Thông tin bài viết */}
            <View style={styles.card}>
                {post?.category?.title ? (
                    <View style={styles.categoryTag}>
                        <Text style={styles.categoryText}>{post.category.title}</Text>
                    </View>
                ) : null}

                <View style={styles.authorRow}>
                    <View style={styles.authorInfo}> 
                        <Text style={styles.authorName}>{post?.authorName ?? "Ẩn danh"}</Text>
                    </View>

                    <View style={styles.dateRow}>
                        <MaterialIcons name="calendar-today" size={16} color="#333" />
                        <Text style={styles.dateText}>
                            {formatDate(post?.updatedAt)}
                        </Text>
                    </View>
                </View>

                <View style={styles.readTime}>
                    <Ionicons name="time-outline" size={16} color="#333" />
                    <Text style={styles.readText}>
                        {post?.readingTime ?? 0} phút đọc
                    </Text>
                </View>
            </View>

            {/* Nội dung bài viết */}
            <View style={styles.content}>
                <RenderHtml
                    contentWidth={screenWidth - 32}
                    source={{ html: post?.content ?? "" }} // ✅ đảm bảo luôn là string
                    baseStyle={{ color: "#334155", fontSize: 15, lineHeight: 22 }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
        position: "relative",
    },
    iconButton: { padding: 8, borderRadius: 8, zIndex: 100 },
    headerTitle: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "700",
        color: "#075985",
    },
    card: {
        margin: 16,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        elevation: 1,
    },
    categoryTag: {
        alignSelf: "flex-start",
        backgroundColor: "#0ea5e9",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 8,
    },
    categoryText: { color: "#fff", fontWeight: "600", fontSize: 12 },
    authorRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    authorInfo: { flexDirection: "row", alignItems: "center" },
    authorAvatar: {
        backgroundColor: "#e2e8f0",
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },
    avatarText: { color: "#0f172a", fontWeight: "700" },
    authorName: { color: "#1e293b" },
    dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    dateText: { color: "#475569", fontSize: 12 },
    readTime: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
    readText: { color: "#475569", fontSize: 13 },
    content: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    retryBtn: {
        marginTop: 10,
        backgroundColor: "#0ea5e9",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
});
