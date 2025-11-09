import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { shadows } from "../theme/spacing";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  Notification,
} from "../services/notificationService";
import { useWebSocketNotifications } from "../hooks/useWebSocketNotifications";
import { useAuth } from "../context/AuthContext";

type NotificationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Notification"
>;

const NotificationScreen = () => {
  const navigation = useNavigation<NotificationNavigationProp>();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const pageSize = 10;

  // 🔹 Query để lấy danh sách thông báo với infinite scroll
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) => getNotifications(pageParam, pageSize),
    enabled: isAuthenticated,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNumber < lastPage.totalPages) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // 🔹 Flatten tất cả notifications từ các pages
  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  // 🔹 Query để lấy số lượng thông báo chưa đọc
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch mỗi 30 giây
  });

  // 🔹 Mutation để đánh dấu một thông báo là đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate queries để refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  // 🔹 Mutation để đánh dấu tất cả thông báo là đã đọc
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onError: (error) => {
      console.error("❌ Lỗi khi đánh dấu tất cả thông báo đã đọc:", error);
    },
  });

  // 🔹 Callback khi nhận được thông báo mới từ WebSocket
  const handleNewNotification = useCallback(
    (notification: Notification) => {
      // Invalidate queries để refetch danh sách
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    [queryClient]
  );

  // 🔹 Kết nối WebSocket
  const { connected, connectionError } = useWebSocketNotifications(handleNewNotification);

  // 🔹 Xử lý khi click vào một thông báo
  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.readFlag) {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    // TODO: Navigate đến link tương ứng (job detail, application detail, etc.)
    // if (notification.link) {
    //   navigation.navigate(...);
    // }
  };

  // 🔹 Xử lý load more
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 🔹 Lấy màu sắc dựa trên type của thông báo
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_APPLICATION':
        return {
          border: colors.success.start,
          background: colors.success.light + '20',
          icon: 'person-add-outline' as const,
        };
      case 'APPLICATION_STATUS_UPDATE':
        return {
          border: colors.primary.start,
          background: colors.primary.light + '20',
          icon: 'checkmark-circle-outline' as const,
        };
      default:
        return {
          border: colors.primary.start,
          background: colors.primary.light + '20',
          icon: 'notifications-outline' as const,
        };
    }
  };

  // 🔹 Render một item thông báo
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const isUnread = !item.readFlag;
    const notificationColor = getNotificationColor(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          isUnread && styles.notificationItemUnread,
          { borderLeftColor: notificationColor.border },
          isUnread && { backgroundColor: notificationColor.background },
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        {/* Icon bên trái */}
        <View style={[
          styles.notificationIconContainer,
          { backgroundColor: notificationColor.background }
        ]}>
          <Ionicons
            name={notificationColor.icon}
            size={24}
            color={notificationColor.border}
          />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[
              styles.notificationTitle,
              isUnread && styles.notificationTitleUnread
            ]}>
              {item.title}
            </Text>
            {isUnread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationText} numberOfLines={2}>
            {item.content}
          </Text>
          <View style={styles.notificationFooter}>
            <Text style={styles.notificationTime}>
              {formatNotificationTime(item.createdAt)}
            </Text>
            {isUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>Mới</Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.text.tertiary}
        />
      </TouchableOpacity>
    );
  };

  // 🔹 Format thời gian thông báo
  const formatNotificationTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.markAllReadButton,
              markAllAsReadMutation.isPending && styles.markAllReadButtonDisabled,
              unreadCount === 0 && styles.markAllReadButtonInactive
            ]}
            onPress={() => {
              if (!markAllAsReadMutation.isPending && unreadCount > 0) {
                markAllAsReadMutation.mutate();
              }
            }}
            disabled={markAllAsReadMutation.isPending || unreadCount === 0}
            activeOpacity={unreadCount > 0 ? 0.7 : 1}
          >
            {markAllAsReadMutation.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons 
                  name="checkmark-done-outline" 
                  size={18} 
                  color={unreadCount > 0 ? "#ffffff" : colors.text.tertiary} 
                />
                <Text style={[
                  styles.markAllReadText,
                  unreadCount === 0 && styles.markAllReadTextInactive
                ]}>
                  Đọc tất cả
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Connection Status - Chỉ hiển thị trên React Native (không phải web) */}
      {Platform.OS !== "web" && !connected && (
        <View style={styles.connectionStatus}>
          <Ionicons name="warning-outline" size={16} color={colors.warning.start} />
          <Text style={styles.connectionStatusText}>
            {connectionError ? `Lỗi: ${connectionError}` : "Đang kết nối WebSocket..."}
          </Text>
        </View>
      )}

      {/* Content */}
      {isLoading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.start} />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color={colors.text.tertiary}
          />
          <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
          <Text style={styles.emptySubtext}>
            Thông báo mới sẽ xuất hiện ở đây
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary.start}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary.start} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...shadows.soft,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  markAllReadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary.start,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary.start,
    shadowColor: colors.primary.start,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  markAllReadButtonDisabled: {
    opacity: 0.6,
  },
  markAllReadButtonInactive: {
    backgroundColor: colors.border.light + "40",
    borderColor: colors.border.light,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  markAllReadText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "700",
  },
  markAllReadTextInactive: {
    color: colors.text.tertiary,
    fontWeight: "600",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    backgroundColor: colors.warning.light,
    gap: spacing.xs,
  },
  connectionStatusText: {
    fontSize: 12,
    color: colors.warning.dark,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.border.light,
    ...shadows.soft,
    shadowColor: colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationItemUnread: {
    borderLeftWidth: 4,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: "700",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error.start,
    marginLeft: spacing.xs,
    shadowColor: colors.error.start,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  unreadBadge: {
    backgroundColor: colors.error.start,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  notificationText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
});

export default NotificationScreen;

