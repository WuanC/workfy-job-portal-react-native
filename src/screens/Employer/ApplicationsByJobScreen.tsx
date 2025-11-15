import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getApplicationsByJob } from "../../services/applicationService";
import { ToastService } from "../../services/toastService";
import {
  ApplicationStatus,
  formatDate,
  getApplicationStatusLabel,
  getEnumOptions,
} from "../../utilities/constant";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Dropdown } from "react-native-element-dropdown";
import { colors, gradients } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { useI18n } from "../../hooks/useI18n";

type EmployerJobNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmployerDetailApplication"
>;

const ApplicationsByJobScreen = ({ route }: any) => {
  const { jobId } = route.params as { jobId: number };
  const navigation = useNavigation<EmployerJobNavigationProp>();
  const { t } = useI18n();

  const [applications, setApplications] = useState<any[]>([]);
  const [applicationPageNumber, setApplicationPageNumber] = useState(1);
  const [isApplicationLoading, setIsApplicationLoading] = useState(false);
  const [applicationHasMore, setApplicationHasMore] = useState(true);
  const [isApplicationRefreshing, setIsApplicationRefreshing] = useState(false);
  const [searchStatus, setSearchStatus] = useState("ALL");

  // 🧠 Gọi API lấy danh sách
  const fetchApplications = async (page = 1, status = "ALL") => {
    if (isApplicationLoading) return;

    setIsApplicationLoading(true);
    try {
      let res;
      if (status === "ALL") {
        res = await getApplicationsByJob(jobId, { pageNumber: page, pageSize: 10 });
      } else {
        res = await getApplicationsByJob(jobId, { pageNumber: page, pageSize: 10, status });
      }

      if (page === 1) {
        setApplications(res.items);
      } else {
        setApplications((prev) => [...prev, ...res.items]);
      }

      setApplicationHasMore(page < res.totalPages);
      setApplicationPageNumber(page);
    } catch (err: any) {
      console.error("❌ Lỗi khi tải danh sách:", err);
      ToastService.error("Không tải được danh sách", err.message || String(err));
    } finally {
      setIsApplicationLoading(false);
    }
  };

  // 🔄 Gọi lại khi focus screen
  useFocusEffect(
    useCallback(() => {
      fetchApplications(1, searchStatus);
    }, [jobId])
  );

  // 🔁 Gọi API khi đổi dropdown
  useEffect(() => {
    setApplicationPageNumber(1);
    setApplicationHasMore(true);
    fetchApplications(1, searchStatus);
  }, [searchStatus]);

  // ↻ Refresh danh sách
  const handleRefreshApplications = async () => {
    setApplicationHasMore(true);
    setIsApplicationRefreshing(true);
    await fetchApplications(1, searchStatus);
    setIsApplicationRefreshing(false);
  };

  // 🔽 Load thêm khi scroll
  const handleApplicationLoadMore = () => {
    if (applicationHasMore && !isApplicationLoading) {
      fetchApplications(applicationPageNumber + 1, searchStatus);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("EmployerDetailApplication", {
          applicationId: item.id,
        })
      }
      activeOpacity={0.9}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person-circle-outline"
              size={56}
              color = {colors.primary.start}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>
              {item.fullName || item.applicant?.fullName || t('profile.profile')}
            </Text>
            <Text style={styles.meta}>
              {item.email || item.applicant?.email || t('auth.email')}
            </Text>
            <Text style={styles.meta}>
              {t('application.applicationDate')}: {formatDate(item.createdAt)}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {getApplicationStatusLabel(item.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isApplicationLoading && applications.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary.start} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('application.myApplications')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 🔽 Bộ lọc trạng thái */}
      <View style={styles.filterSection}>
        <Dropdown
          data={getEnumOptions(ApplicationStatus)}
          labelField="label"
          valueField="value"
          placeholder={t('common.filter')}
          value={searchStatus}
          onChange={(item) => setSearchStatus(item.value)}
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
        />
      </View>

      {/* 📋 Danh sách */}
      <FlatList
        data={applications}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={handleApplicationLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isApplicationRefreshing}
            onRefresh={handleRefreshApplications}
            colors={[colors.primary.start]}
          />
        }
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 80 }}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color="#ccc" />
            <Text style={styles.emptyText}>{t('search.noResults')}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ApplicationsByJobScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // giống EmployerJobScreen
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: colors.surface, // header màu surface
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { padding: 6, color: "#000000ff" },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },

  filterSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
  },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  placeholder: { color: "#aaa", fontSize: 14 },
  selectedText: { color: "#333", fontSize: 15 },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 8, color: "#777" },

  empty: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    marginTop: 8,
    fontSize: 15,
  },

  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(102,126,234,0.08)",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  meta: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 2,
  },
  statusBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(102,126,234,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary.dark,
  },
});

