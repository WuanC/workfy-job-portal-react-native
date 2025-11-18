import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    RefreshControl,
    TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getAllCategories, getPublicPosts, Category, Post } from "../services/postService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { useI18n } from "../hooks/useI18n";

type ExploreNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ArticleDetail"
>;

export default function BlogScreen() {
    const navigation = useNavigation<ExploreNavigationProp>();
    const { t } = useI18n();
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [filterExpanded, setFilterExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchPosts(1, true);
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.log(t('blog.categoryLoadError'), error);
        }
    };

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
            console.log(t('blog.postsLoadError'), error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchPosts(page + 1);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPosts(1, true);
    };

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSearchQuery("");
        fetchPosts(1, true);
    };

    const filteredPosts = posts.filter((p) => {
        const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category.title);
        const matchSearch = searchQuery === "" || 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.authorName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation?.goBack?.()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={22} color="#1f2937" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{t('blog.articleList')}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('blog.searchPlaceholder') || "Tìm kiếm bài viết..."}
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={20} color="#6b7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filter Section */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={styles.filterHeader}
                    onPress={() => setFilterExpanded(!filterExpanded)}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={styles.filterIconContainer}>
                            <Ionicons name="filter-outline" size={18} color="#1f2937" />
                        </View>
                        <Text style={styles.filterTitle}>{t('common.filter')}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {selectedCategories.length > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>
                                    {selectedCategories.length}
                                </Text>
                            </View>
                        )}
                        <MaterialCommunityIcons
                            name={filterExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#1f2937"
                        />
                    </View>
                </TouchableOpacity>

                {filterExpanded && (
                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownLabel}>{t('blog.categories')}</Text>
                        {categories.map((item) => {
                            const isSelected = selectedCategories.includes(item.title);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => toggleCategory(item.title)}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[
                                            styles.dropdownItem,
                                            isSelected && styles.dropdownItemSelected,
                                        ]}
                                    >
                                        <Ionicons
                                            name={
                                                isSelected
                                                    ? "checkmark-circle"
                                                    : "ellipse-outline"
                                            }
                                            size={20}
                                            color={isSelected ? "#0f172a" : "#9ca3af"}
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text
                                            style={[
                                                styles.dropdownText,
                                                isSelected && styles.dropdownTextSelected,
                                            ]}
                                        >
                                            {item.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {(selectedCategories.length > 0 || searchQuery.length > 0) && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={clearFilters}
                            >
                                <Text style={styles.clearButtonText}>{t('blog.clearFilter')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            {/* Articles */}
            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (item?.id) {
                                navigation.navigate("ArticleDetail", { id: item.id });
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.thumbnailUrl }}
                                style={styles.thumbnail}
                            />
                            <View style={{ flex: 1 }}>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryBadgeText}>
                                        {item.category.title}
                                    </Text>
                                </View>
                                <Text style={styles.title} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <View style={styles.metaRow}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={14}
                                        color="#6b7280"
                                    />
                                    <Text style={styles.meta}>
                                        {new Date(
                                            item.updatedAt
                                        ).toLocaleDateString("vi-VN")}
                                    </Text>
                                </View>
                                <View style={styles.authorRow}>
                                    <Ionicons
                                        name="person-outline"
                                        size={14}
                                        color="#0f172a"
                                    />
                                    <Text style={styles.author}>{item.authorName}</Text>
                                    <Ionicons
                                        name="time-outline"
                                        size={14}
                                        color="#6b7280"
                                        style={{ marginLeft: 12 }}
                                    />
                                    <Text style={styles.readTime}>
                                        {item.readingTime} {t('blog.minutes')}
                                    </Text>
                                </View>
                            </View>
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
                            <ActivityIndicator size="small" color="#0f172a" />
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb" },

    headerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#f3f4f6",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0f172a",
    },

    searchContainer: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
    },
    searchInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#0f172a",
    },

    filterContainer: {
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    filterHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    filterIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f3f4f6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    filterTitle: { fontWeight: "700", color: "#0f172a", fontSize: 16 },
    filterBadge: {
        backgroundColor: "#0f172a",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
    },
    filterBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },

    dropdown: {
        marginTop: 10,
        backgroundColor: "#f9fafb",
        borderRadius: 10,
        padding: 10,
    },
    dropdownLabel: {
        fontWeight: "700",
        fontSize: 15,
        marginBottom: 8,
        color: "#0f172a",
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 4,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
    },
    dropdownItemSelected: {
        backgroundColor: "#e0e7ff",
        borderColor: "#1e3a8a",
    },
    dropdownText: {
        fontSize: 14,
        color: "#0f172a",
        fontWeight: "500",
    },
    dropdownTextSelected: {
        color: "#1e3a8a",
        fontWeight: "600",
    },
    clearButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#1e3a8a",
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 10,
    },
    clearButtonText: {
        color: "#1e3a8a",
        fontWeight: "700",
        fontSize: 14,
    },

    card: {
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        flexDirection: "row",
        padding: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
    },
    categoryBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: "#1e3a8a",
        marginBottom: 6,
    },
    categoryBadgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    title: {
        fontWeight: "700",
        fontSize: 15,
        marginBottom: 4,
        color: "#0f172a",
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    meta: {
        fontSize: 12,
        color: "#6b7280",
        marginLeft: 4,
    },
    authorRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    author: {
        fontSize: 12,
        color: "#1e3a8a",
        marginLeft: 4,
        fontWeight: "600",
    },
    readTime: {
        fontSize: 12,
        color: "#6b7280",
        marginLeft: 4,
    },
});
