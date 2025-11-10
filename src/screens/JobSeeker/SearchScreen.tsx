import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SearchBar from "../../components/SearchBar";
import JobCard from "../../components/JobCard";
import { RootStackParamList } from "../../types/navigation";
import { colors, gradients } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import {
  getIndustriesJobCount,
  CategoryJob,
} from "../../services/industryService";
import {
  AdvancedJobQuery,
  getAdvancedJobs,
} from "../../services/jobService";

type FilterNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SearchFilter"
>;

const SearchScreen = ({ route }: any) => {
  const initialTab = route?.params?.initialTab || "jobs";
  const navigation = useNavigation<FilterNavigationProp>();

  const [activeTab, setActiveTab] = useState<"jobs" | "industries">(initialTab);
  const [searchText, setSearchText] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [categoryJobs, setCategoryJobs] = useState<CategoryJob[]>([]);
  const [advanceFilter, setAdvanceFilter] = useState<AdvancedJobQuery>({
    sort: "createdAt",
  });
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 🟢 Gọi API job khi filter thay đổi
  useEffect(() => {
    if (activeTab === "jobs") {
      // load first page whenever filter or tab changes
      setHasMore(true);
      setPageNumber(1);
      fetchFilteredJobs(advanceFilter, 1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advanceFilter, activeTab]);

  // 🟢 Gọi API ngành nghề khi chuyển tab
  useEffect(() => {
    if (activeTab === "industries") {
      fetchCategoryJobs();
    }
  }, [activeTab]);

  const fetchFilteredJobs = async (
    filter: AdvancedJobQuery,
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (page === 1) setLoading(true);
      const query = { ...filter, pageNumber: page, pageSize } as AdvancedJobQuery;
      const data = await getAdvancedJobs(query);
      const items = data.items || [];
      if (append) setJobs((prev) => [...prev, ...items]);
      else setJobs(items);

      // determine if more pages exist
      if (!items || items.length < pageSize) setHasMore(false);
      else setHasMore(true);
    } catch (e) {
      console.error("fetchFilteredJobs error:", e);
    } finally {
      if (page === 1) setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreJobs = async () => {
    if (loadingMore || loading || !hasMore) return;
    try {
      setLoadingMore(true);
      const next = pageNumber + 1;
      await fetchFilteredJobs(advanceFilter, next, true);
      setPageNumber(next);
    } catch (e) {
      console.error("loadMoreJobs error:", e);
      setLoadingMore(false);
    }
  };

  const fetchCategoryJobs = async () => {
    try {
      setLoading(true);
      const data = await getIndustriesJobCount();
      setCategoryJobs(data || []);
    } catch (e) {
      console.error("fetchCategoryJobs error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Tìm kiếm công việc, công ty..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSubmit={() =>
            setAdvanceFilter((prev) => ({ ...prev, keyword: searchText }))
          }
        />
      </View>

      {/* 🧭 Tabs */}
      <View style={styles.tabContainer}>
        {["jobs", "industries"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Ionicons
              name={tab === "jobs" ? "briefcase" : "grid"}
              size={18}
              color={activeTab === tab ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "jobs" ? "Công việc" : "Ngành nghề"}
            </Text>
          </TouchableOpacity>
        ))}

        {/* ⚙️ Nút bộ lọc */}
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() =>
            navigation.navigate("SearchFilter", {
              currentFilter: advanceFilter,
              onApply: (f: any) => setAdvanceFilter(f),
            })
          }
        >
          <LinearGradient
            colors={gradients.sunnyYellow as any}
            style={styles.filterGradient}
          >
            <Ionicons name="options" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 🧩 Nội dung */}
      {loading ? (
        <Loader />
      ) : activeTab === "jobs" ? (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => {
            return (
              <JobCard
                id={item.id}
                logo_path={item.author.avatarUrl}
                job_title={item.jobTitle}
                company_name={item.companyName}
                job_location={item.jobLocations[0]?.province?.name}
                salary_range={
                  item.salaryType === "RANGE"
                    ? `${item.minSalary} - ${item.maxSalary} ${item.salaryUnit}`
                    : item.salaryType === "NEGOTIABLE"
                      ? "Thỏa thuận"
                      : "Không rõ"
                }
                time_passed={item.expirationDate}
              />
            );
          }}
          onEndReached={loadMoreJobs}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={{ paddingVertical: 14, alignItems: "center" }}>
                <ActivityIndicator size="small" color={colors.primary.start} />
              </View>
            ) : null
          }
          contentContainerStyle={{ padding: spacing.md }}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          {categoryJobs.map((cat) => (
            <View key={cat.id} style={styles.category}>
              <Text style={styles.categoryTitle}>
                {cat.name} ({cat.industries.length})
              </Text>
              {cat.industries.map((ind) => (
                <TouchableOpacity
                  key={ind.id}
                  style={styles.industryCard}
                  onPress={() => {
                    const f = { ...advanceFilter, industryIds: [ind.id] };
                    setAdvanceFilter(f);
                    setActiveTab("jobs");
                  }}
                >
                  <Ionicons
                    name="briefcase-outline"
                    size={18}
                    color={colors.primary.start}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.industryName}>{ind.name}</Text>
                  <Text style={styles.jobCount}>{ind.jobCount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const Loader = () => (
  <View style={styles.loader}>
    <ActivityIndicator size="large" color={colors.primary.start} />
    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
  </View>
);

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f3f3f3",
    marginRight: 6,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.primary.start,
  },
  tabText: { fontSize: 14, fontWeight: "600", color: "#666" },
  activeTabText: { color: "#fff" },
  filterBtn: { marginLeft: 8 },
  filterGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: { marginTop: 8, color: "#777" },
  category: { marginBottom: spacing.md },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  industryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  industryName: { flex: 1, fontWeight: "600", color: "#333" },
  jobCount: { color: colors.primary.start, fontWeight: "700" },
});
