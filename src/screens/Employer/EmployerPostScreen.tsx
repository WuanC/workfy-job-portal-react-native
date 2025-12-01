import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { deletePost, getMyPosts } from "../../services/postService";
import { EmployerPostCard } from "../../components/Employer/EmployerPostCard";
import { colors, gradients } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { useI18n } from "../../hooks/useI18n";

type EmployerPostNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePost" | "UpdatePost"
>;

const EmployerPostScreen = () => {
  const navigation = useNavigation<EmployerPostNavigationProp>();
  const { t } = useI18n();

  const [selectedId, setSelectedId] = useState<number>(-1);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setPageNumber(1);
      const res = await getMyPosts(1, pageSize);
      const items = res.items ?? [];
      setPosts(items);
      // determine if more pages exist
      if (Array.isArray(items) && items.length < pageSize) setHasMore(false);
      else setHasMore(true);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bài viết:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = pageNumber + 1;
      const res = await getMyPosts(nextPage, pageSize);
      const items = res.items ?? [];
      if (!items || items.length === 0) {
        setHasMore(false);
        return;
      }
      setPosts((prev) => [...prev, ...items]);
      setPageNumber(nextPage);
      if (items.length < pageSize) setHasMore(false);
    } catch (err) {
      console.error("Lỗi khi load thêm bài viết:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleDeletePost = async (id: number) => {
    try {
      const res = await deletePost(id);
      if (res.status === 200) {
        const { ToastService } = require("../../services/toastService");
        ToastService.success(t('common.success'), res.message || t('post.deleteSuccess'));
        fetchPosts();
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        t('messages.deleteError');
      const { ToastService } = require("../../services/toastService");
      ToastService.error(t('common.error'), msg);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary.start} />
        <Text style={{ color: "#777", marginTop: 8 }}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('post.myPosts')}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <LinearGradient
            colors={gradients.purpleDream as any}
            style={styles.addBtnGradient}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Danh sách bài viết */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EmployerPostCard
            status={item.status}
            title={item.title}
            createdAt={item.createdAt}
            category={item.category?.title ?? "Không có danh mục"}
            thumbnailUrl={item.thumbnailUrl}
            readingTime={item.readingTimeMinutes}
            onOptionsPress={() => {
              setSelectedId(item.id);
              setShowActionMenu(true);
            }}
          />
        )}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary.start} />
            </View>
          ) : null
        }
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 80 }}
      />

      {/* Menu hành động */}
      <Modal
        visible={showActionMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.menuBox}>
            <Text style={styles.menuTitle}>{t('common.edit')}</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowActionMenu(false);
                navigation.navigate("UpdatePost", { id: selectedId });
              }}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.primary.start}
              />
              <Text style={styles.menuText}>{t('common.edit')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowActionMenu(false);
                handleDeletePost(selectedId);
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#ff3b30" />
              <Text style={[styles.menuText, { color: "#ff3b30" }]}>
                {t('common.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default EmployerPostScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text.primary,
    alignContent: "center"
  },
  addBtn: {
    marginLeft: 10,
  },
  addBtnGradient: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 320,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: colors.text.primary,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    marginLeft: 12,
    fontSize: 15,
    color: colors.text.primary,
  },
});
