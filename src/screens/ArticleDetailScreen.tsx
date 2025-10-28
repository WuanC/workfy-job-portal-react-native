import React, { useEffect, useState, useRef, use } from "react";
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
>
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

    const [careerAdvice, setCareerAdvice] = useState<any[]>([])

    // 🟩 Trích xuất tiêu đề từ HTML
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

    // 🟩 Gắn id vào các thẻ heading để định vị
    const injectIdsToHeadings = (html: string, list: Heading[]) => {
        let index = 0;
        return html.replace(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, content) => {
            const heading = list[index++];
            if (!heading) return match;
            return `<h${level} id="${heading.id}"${attrs}>${content}</h${level}>`;
        });
    };

    // 🟩 Lấy bài viết
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
                else if (err.response?.status === 403)
                    setError("Bài viết chưa được công khai.");
                else setError("Đã xảy ra lỗi khi tải bài viết.");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // 🟩 Cuộn đến heading theo id
    const handleScrollToHeading = (id: string) => {

        // Đợi layout ổn định trước khi cuộn
        InteractionManager.runAfterInteractions(() => {
            const y = headingRefs.current[id]?.y;
            if (scrollRef.current && y !== undefined) {
                scrollRef.current.scrollTo({ y: y - 80, animated: true }); // trừ 80 để tiêu đề không bị che
            } else {
                console.log("❌ Không tìm thấy ref cho", id);
            }
        });
    };

    // 🟩 Định dạng ngày
    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "—";
        return date.toLocaleDateString("vi-VN");
    };

    if (loading)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
        );

    if (error)
        return (
            <View style={styles.center}>
                <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
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
        <ScrollView ref={scrollRef} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={22} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                    {post?.title ?? "Bài viết"}
                </Text>

                <View style={{ width: 38 }} />
            </View>

            {/* Thông tin bài viết */}
            <View style={styles.card}>
                {post?.category?.title && (
                    <View style={styles.categoryTag}>
                        <Text style={styles.categoryText}>{post.category.title}</Text>
                    </View>
                )}

                <View style={styles.authorRow}>
                    <Text style={styles.authorName}>{post?.authorName ?? "Ẩn danh"}</Text>
                    <View style={styles.dateRow}>
                        <MaterialIcons name="calendar-today" size={16} color="#333" />
                        <Text style={styles.dateText}>{formatDate(post?.updatedAt)}</Text>
                    </View>
                </View>

                <View style={styles.readTime}>
                    <Ionicons name="time-outline" size={16} color="#333" />
                    <Text style={styles.readText}>
                        {post?.readingTime ?? 0} phút đọc
                    </Text>
                </View>
            </View>

            {/* Mục lục */}
            {headings.length > 0 && (
                <View style={styles.tocContainer}>
                    <Text style={styles.tocTitle}>📑 Mục lục</Text>
                    {headings.map((h) => (
                        <TouchableOpacity
                            key={h.id}
                            onPress={() => handleScrollToHeading(h.id)}
                            activeOpacity={0.6}
                        >
                            <Text
                                style={{
                                    marginLeft: (h.level - 1) * 12,
                                    fontSize: 14,
                                    color: "#0f172a",
                                    marginBottom: 4,
                                }}
                            >
                                • {h.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Nội dung */}
            <View style={styles.content}>
                <RenderHtml
                    contentWidth={screenWidth - 32}
                    source={{ html: htmlWithIds }}
                    baseStyle={{
                        color: "#1e293b",
                        fontSize: 15,
                        lineHeight: 24,
                        fontFamily: "System",
                    }}
                    renderers={{
                        h1: ({ TDefaultRenderer, ...props }: any) => {
                            const id = props?.tnode?.attributes?.id ?? "";
                            return (
                                <View
                                    ref={(ref) => {
                                        if (ref) {
                                            ref.measure((x, y, width, height, pageX, pageY) => {
                                                headingRefs.current[id] = { y: pageY };
                                            });
                                        }
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
                                        if (ref) {
                                            ref.measure((x, y, width, height, pageX, pageY) => {
                                                headingRefs.current[id] = { y: pageY };
                                            });
                                        }
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
                                        if (ref) {
                                            ref.measure((x, y, width, height, pageX, pageY) => {
                                                headingRefs.current[id] = { y: pageY };
                                            });
                                        }
                                    }}
                                >
                                    <TDefaultRenderer {...props} />
                                </View>
                            );
                        },
                    }}
                    tagsStyles={{
                        h1: {
                            fontSize: 24,
                            fontWeight: "700",
                            color: "#0f172a",
                            marginBottom: 10,
                            marginTop: 10,
                        },
                        h2: {
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#1e293b",
                            marginBottom: 8,
                            marginTop: 10,
                        },
                        h3: {
                            fontSize: 18,
                            fontWeight: "600",
                            color: "#334155",
                            marginBottom: 6,
                            marginTop: 8,
                        },
                        p: { marginBottom: 8 },
                        strong: { fontWeight: "700" },
                        em: { fontStyle: "italic" },
                        ul: { paddingLeft: 20, marginBottom: 8 },
                        li: { marginBottom: 4 },
                        a: {
                            color: "#0ea5e9",
                            textDecorationLine: "underline",
                        },
                    }}
                />
            </View>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Bài viết liên quan</Text>
                </View>
                <FlatList
                    data={careerAdvice}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.articleCard}
                            onPress={() => {
                                if (item?.id) {
                                    console.log("Đi đến bài viết ID:", item.id);
                                    navigation.replace("ArticleDetail", { id: item.id }); // 👈 Truyền đúng key "id"
                                } else {
                                    console.warn("⚠️ Bài viết không có id hợp lệ:", item);
                                }
                            }}>
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
    },
    iconButton: { padding: 8, borderRadius: 8 },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "600",
        color: "#000",
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
    authorName: { color: "#1e293b" },
    dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    dateText: { color: "#475569", fontSize: 12 },
    readTime: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
    readText: { color: "#475569", fontSize: 13 },
    tocContainer: {
        backgroundColor: "#f1f5f9",
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tocTitle: {
        fontWeight: "700",
        color: "#0f172a",
        marginBottom: 4,
    },
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
    section: {
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    articleCard: {
        backgroundColor: "white",
        borderRadius: 12,
        marginRight: 15,
        width: 250,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    articleImage: { width: "100%", height: 120, resizeMode: "cover" },
    articleContent: { padding: 12 },
    articleCategory: { fontSize: 12, color: "#ff6b35", fontWeight: "600" },
    articleTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    articleDate: { fontSize: 12, color: "#999" },
});
