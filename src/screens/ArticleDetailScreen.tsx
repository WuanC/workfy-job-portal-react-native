import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    InteractionManager,
    FlatList,
    Image
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import { getPostById, getRelatedPosts, Post } from "../services/postService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Heading = {
    id: string;
    level: 1 | 2 | 3;
    text: string;
};

type DetailBlogNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ArticleDetail"
>;

const ArticleDetailScreen = ({ route }: any) => {
    const navigation = useNavigation<DetailBlogNavigationProp>();
    const { id } = route.params as { id: number };

    const [post, setPost] = useState<Post | null>(null);
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<ScrollView>(null);
    const screenWidth = Dimensions.get("window").width;
    const headingRefs = useRef<Record<string, { y: number }>>({});
    const [careerAdvice, setCareerAdvice] = useState<any[]>([]);

    const extractHeadings = (html: string): Heading[] => {
        const regex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
        const result: Heading[] = [];
        let match: RegExpExecArray | null;
        let count = 0;
        while ((match = regex.exec(html)) !== null) {
            const id = `heading-${count++}`;
            result.push({
                id,
                level: Number(match[1]) as 1 | 2 | 3,
                text: match[2].replace(/<[^>]+>/g, ""),
            });
        }
        return result;
    };

    const injectIdsToHeadings = (html: string, list: Heading[]) => {
        let index = 0;
        return html.replace(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, content) => {
            const heading = list[index++];
            if (!heading) return match;
            return `<h${level} id="${heading.id}"${attrs}>${content}</h${level}>`;
        });
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const relative = await getRelatedPosts(id, 5);
                const data = await getPostById(id);
                setPost(data);
                setCareerAdvice(relative);
                if (data?.content) {
                    const extracted = extractHeadings(data.content);
                    setHeadings(extracted);
                }
            } catch (err: any) {
                if (err.response?.status === 404) setError("Không tìm thấy bài viết.");
                else if (err.response?.status === 403) setError("Bài viết chưa được công khai.");
                else setError("Đã xảy ra lỗi khi tải bài viết.");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleScrollToHeading = (id: string) => {
        InteractionManager.runAfterInteractions(() => {
            const y = headingRefs.current[id]?.y;
            if (scrollRef.current && y !== undefined) {
                scrollRef.current.scrollTo({ y: y - 80, animated: true });
            }
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "—";
        return date.toLocaleDateString("vi-VN");
    };

    if (loading)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1e293b" />
            </View>
        );

    if (error)
        return (
            <View style={styles.center}>
                <Text style={{ color: "#b91c1c", fontSize: 16 }}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryBtn}
                    onPress={() => {
                        setError(null);
                        setLoading(true);
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );

    const htmlWithIds =
        post?.content && headings.length > 0
            ? injectIdsToHeadings(post.content, headings)
            : post?.content ?? "";

    return (
        <ScrollView ref={scrollRef} style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {post?.title ?? "Bài viết"}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Info Card */}
            <View style={styles.card}>
                {post?.category?.title && (
                    <View style={styles.categoryTag}>
                        <Text style={styles.categoryText}> {post.category.title}</Text>
                    </View>
                )}

                <View style={styles.authorRow}>
                    <View style={styles.authorContainer}>
                        <Ionicons name="person-circle-outline" size={20} color="#1e293b" />
                        <Text style={styles.authorName}>{post?.authorName ?? "Ẩn danh"}</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <MaterialIcons name="calendar-today" size={14} color="#6b7280" />
                        <Text style={styles.dateText}>{formatDate(post?.updatedAt)}</Text>
                    </View>
                </View>

                <View style={styles.readTime}>
                    <View style={styles.readTimeBadge}>
                        <Ionicons name="time-outline" size={14} color="#1e293b" />
                        <Text style={styles.readText}>{post?.readingTime ?? 0} phút đọc</Text>
                    </View>
                </View>
            </View>

            {/* Table of Contents */}
            {headings.length > 0 && (
                <View style={styles.tocContainer}>
                    <View style={styles.tocHeader}>
                        <Ionicons name="list-outline" size={20} color="#1e293b" />
                        <Text style={styles.tocTitle}>Mục lục</Text>
                    </View>
                    <View style={styles.tocContent}>
                        {headings.map((h) => (
                            <TouchableOpacity
                                key={h.id}
                                onPress={() => handleScrollToHeading(h.id)}
                                activeOpacity={0.6}
                                style={styles.tocItem}
                            >
                                <View style={styles.tocBullet} />
                                <Text
                                    style={[
                                        styles.tocText,
                                        { marginLeft: (h.level - 1) * 16 },
                                    ]}
                                >
                                    {h.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Content */}
            <View style={styles.content}>
                <RenderHtml
                    contentWidth={screenWidth - 32}
                    source={{ html: htmlWithIds }}
                    baseStyle={{
                        color: "#1e293b",
                        fontSize: 16,
                        lineHeight: 26,
                        fontFamily: "System",
                    }}
                    renderers={{
                        h1: ({ TDefaultRenderer, ...props }: any) => {
                            const id = props?.tnode?.attributes?.id ?? "";
                            return (
                                <View
                                    ref={(ref) => {
                                        if (ref)
                                            ref.measure((x, y, width, height, pageX, pageY) => {
                                                headingRefs.current[id] = { y: pageY };
                                            });
                                    }}
                                >
                                    <TDefaultRenderer {...props} />
                                </View>
                            );
                        },
                        h2: ({ TDefaultRenderer, ...props }: any) => {
                            const id = props?.tnode?.attributes?.id ?? "";
                            return (
                                <View
                                    ref={(ref) => {
                                        if (ref)
                                            ref.measure((x, y, width, height, pageX, pageY) => {
                                                headingRefs.current[id] = { y: pageY };
                                            });
                                    }}
                                >
                                    <TDefaultRenderer {...props} />
                                </View>
                            );
                        },
                        h3: ({ TDefaultRenderer, ...props }: any) => {
                            const id = props?.tnode?.attributes?.id ?? "";
                            return (
                                <View
                                    ref={(ref) => {
                                        if (ref)
                                            ref.measure((x, y, width, height, pageX, pageY) => {
                                                headingRefs.current[id] = { y: pageY };
                                            });
                                    }}
                                >
                                    <TDefaultRenderer {...props} />
                                </View>
                            );
                        },
                    }}
                    tagsStyles={{
                        h1: { fontSize: 22, fontWeight: "700", color: "#111827", marginVertical: 10 },
                        h2: { fontSize: 19, fontWeight: "700", color: "#1f2937", marginVertical: 8 },
                        h3: { fontSize: 17, fontWeight: "600", color: "#374151", marginVertical: 6 },
                        p: { marginBottom: 10, color: "#1e293b" },
                        a: { color: "#2563eb", textDecorationLine: "underline" },
                        ul: { paddingLeft: 20, marginBottom: 10 },
                        li: { marginBottom: 6 },
                    }}
                />
            </View>

            {/* Related Articles */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bài viết liên quan</Text>
                <FlatList
                    data={careerAdvice}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.articleCard}
                            onPress={() =>
                                navigation.replace("ArticleDetail", { id: item.id })
                            }
                        >
                            <Image source={{ uri: item.thumbnailUrl }} style={styles.articleImage} />
                            <View style={styles.articleContent}>
                                <Text style={styles.articleCategory}>{item.category}</Text>
                                <Text style={styles.articleTitle} numberOfLines={3}>
                                    {item.title}
                                </Text>
                                <Text style={styles.articleDate}>{item.date}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ScrollView>
    );
};

export default ArticleDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        backgroundColor: "#ffffff",
    },
    iconButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    card: {
        margin: 16,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    categoryTag: {
        alignSelf: "flex-start",
        backgroundColor: "#e0e7ff",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    categoryText: {
        color: "#1e3a8a",
        fontWeight: "600",
        fontSize: 12,
        textTransform: "uppercase",
    },
    authorRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    authorContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
    authorName: { color: "#111827", fontWeight: "600", fontSize: 14 },
    dateRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    dateText: { color: "#6b7280", fontSize: 12 },
    readTime: { flexDirection: "row", alignItems: "center" },
    readTimeBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "#f3f4f6",
        alignSelf: "flex-start",
    },
    readText: { color: "#111827", fontSize: 13 },
    tocContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    tocHeader: { flexDirection: "row", alignItems: "center", padding: 12, gap: 8 },
    tocTitle: { fontWeight: "700", color: "#111827", fontSize: 16 },
    tocContent: { paddingHorizontal: 16, paddingBottom: 12 },
    tocItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
    tocBullet: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#1e3a8a",
        marginRight: 12,
    },
    tocText: { fontSize: 14, color: "#111827" },
    content: {
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" },
    retryBtn: {
        marginTop: 10,
        backgroundColor: "#1e3a8a",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
    },
    section: { marginTop: 20, marginBottom: 30, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 12 },
    articleCard: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginRight: 12,
        width: 250,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        overflow: "hidden",
    },
    articleImage: { width: "100%", height: 140, resizeMode: "cover" },
    articleContent: { padding: 12 },
    articleCategory: {
        fontSize: 12,
        color: "#1e3a8a",
        fontWeight: "600",
        textTransform: "uppercase",
    },
    articleTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
        marginTop: 6,
        marginBottom: 6,
        lineHeight: 22,
    },
    articleDate: { fontSize: 12, color: "#6b7280" },
});
