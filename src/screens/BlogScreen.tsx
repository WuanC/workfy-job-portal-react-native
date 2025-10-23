import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Category, getAllCategories, getPublicPosts, Post } from "../services/postService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useNavigation } from "@react-navigation/native";
type ExploreNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ArticleDetail"
>;
export default function BlogScreen() {
    const navigation = useNavigation<ExploreNavigationProp>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [filterExpanded, setFilterExpanded] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // --- Gọi API khi khởi tạo ---
    useEffect(() => {
        fetchCategories();
        fetchPosts(1, true);
    }, []);

    // --- Lấy danh mục ---
    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.log("Không thể lấy danh mục:", error);
        }
    };

    // --- Lấy bài viết public ---
    const fetchPosts = async (pageNum = 1, reset = false) => {
        if (isLoading || (!hasMore && !reset)) return;
        setIsLoading(true);
        try {
            const data = await getPublicPosts(pageNum, 10);
            if (data) {
                setPage(data.pageNumber);
                setHasMore(data.pageNumber < data.totalPages);
                if (reset) {
                    setPosts(data.items);
                } else {
                    setPosts((prev) => [...prev, ...data.items]);
                }
            }
        } catch (error) {
            console.log("Không thể lấy bài viết:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    // --- Load thêm khi cuộn ---
    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchPosts(page + 1);
        }
    };

    // --- Làm mới (kéo xuống) ---
    const handleRefresh = () => {
        setRefreshing(true);
        fetchPosts(1, true);
    };

    // --- Lọc danh mục ---
    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        fetchPosts(1, true);
    };

    const filteredPosts =
        selectedCategories.length === 0
            ? posts
            : posts.filter((p) => selectedCategories.includes(p.category.title));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f8ff" }}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation?.goBack?.()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={22} color="#000000ff" />
                </TouchableOpacity>

                {/* Thêm tiêu đề ở giữa */}
                <Text style={styles.headerTitle}>Danh sách bài viết</Text>
            </View>

            {/* Bộ lọc */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={styles.filterHeader}
                    onPress={() => setFilterExpanded(!filterExpanded)}
                    activeOpacity={0.8}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="filter-outline" size={18} color="#084C9E" />
                        <Text style={styles.filterTitle}>Bộ lọc</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ marginRight: 6, color: "#555" }}>
                            {selectedCategories.length > 0
                                ? `${selectedCategories.length} mục`
                                : "Tất cả"}
                        </Text>
                        <MaterialCommunityIcons
                            name={filterExpanded ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#555"
                        />
                    </View>
                </TouchableOpacity>

                {filterExpanded && (
                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownLabel}>Danh mục</Text>
                        {categories.map((item) => {
                            const isSelected = selectedCategories.includes(item.title);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.dropdownItem,
                                        isSelected && styles.dropdownItemActive,
                                    ]}
                                    onPress={() => toggleCategory(item.title)}
                                >
                                    <Ionicons
                                        name={isSelected ? "checkbox-outline" : "square-outline"}
                                        size={18}
                                        color={isSelected ? "#fff" : "#333"}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text
                                        style={[
                                            styles.dropdownText,
                                            isSelected && { color: "#fff" },
                                        ]}
                                    >
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        {selectedCategories.length > 0 && (
                            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                                <Text style={{ color: "#333", fontWeight: "600" }}>Xóa bộ lọc</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            {/* Danh sách bài viết */}
            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}
                        onPress={() => {
                            if (item?.id) {
                                console.log("Đi đến bài viết ID:", item.id);
                                navigation.navigate("ArticleDetail", { id: item.id }); // 👈 Truyền đúng key "id"
                            } else {
                                console.warn("⚠️ Bài viết không có id hợp lệ:", item);
                            }
                        }}
                    >

                        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.meta}>
                                {new Date(item.updatedAt).toLocaleDateString("vi-VN")} ·{" "}
                                {item.category.title}
                            </Text>
                            <Text style={styles.author}>
                                {item.authorName} ·  {item.readingTime} phút đọc
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListFooterComponent={
                    isLoading ? (
                        <View style={{ paddingVertical: 16 }}>
                            <ActivityIndicator size="small" color="#084C9E" />
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#ffffffff",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 0.5,
        borderColor: "#e5e7eb",
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "600",
        color: "#000000ff",
        marginRight: 50, // để cân giữa vì có nút back bên trái
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        marginRight: 10,

    },
    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    filterContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 12,
        elevation: 2,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    filterHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    filterTitle: {
        marginLeft: 5,
        fontWeight: "600",
        color: "#084C9E",
        fontSize: 15,
    },
    dropdown: {
        marginTop: 8,
        backgroundColor: "#f9fbff",
        borderRadius: 12,
        padding: 10,
    },
    dropdownLabel: {
        fontWeight: "600",
        fontSize: 15,
        marginBottom: 6,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginTop: 4,
        backgroundColor: "#EAF2FF",
        flexDirection: "row",
        alignItems: "center",
    },
    dropdownItemActive: {
        backgroundColor: "#084C9E",
    },
    dropdownText: {
        fontSize: 15,
        color: "#333",
    },
    clearButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 12,
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginVertical: 6,
        borderRadius: 10,
        flexDirection: "row",
        padding: 10,
        elevation: 2,
    },
    thumbnail: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginRight: 10,
    },
    title: {
        fontWeight: "600",
        fontSize: 15,
        marginBottom: 4,
        color: "#222",
    },
    meta: {
        fontSize: 13,
        color: "#777",
    },
    author: {
        fontSize: 13,
        color: "#555",
        marginTop: 4,
    },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
