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
import { closeJob, deleteJob, getMyJobs } from "../../services/jobService";
import { EmployerJobCard } from "../../components/Employer/EmployerJobCard";
import { colors, gradients } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type EmployerJobNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostJob" | "UpdateJob"
>;

 const EmployerJobScreen = () =>  {
  const navigation = useNavigation<EmployerJobNavigationProp>();

  const [selectedId, setSelectedId] = useState<number>(-1);
  const [isSelectedClosed, setIsSelectedClosed] = useState<boolean>(false)
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setPageNumber(1);
      const res = await getMyJobs(1, pageSize);
      const items = res.data?.items ?? res.items ?? [];
      setJobs(items);
      // determine if more pages exist
      if (Array.isArray(items) && items.length < pageSize) setHasMore(false);
      else setHasMore(true);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách công việc:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreJobs = async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = pageNumber + 1;
      const res = await getMyJobs(nextPage, pageSize);
      const items = res.data?.items ?? res.items ?? [];
      if (!items || items.length === 0) {
        setHasMore(false);
        return;
      }
      setJobs((prev) => [...prev, ...items]);
      setPageNumber(nextPage);
      if (items.length < pageSize) setHasMore(false);
    } catch (err) {
      console.error("Lỗi khi load thêm công việc:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );

  const handleDeleteJob = async (id: number) => {
    try {
      const res = await deleteJob(id);
      if (res.status === 200) {
        const { ToastService } = require("../../services/toastService");
        ToastService.success("✅ Thành công", res.message);
        fetchJobs();
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Không thể xóa công việc. Vui lòng thử lại.";
      const { ToastService } = require("../../services/toastService");
      ToastService.error("❌ Lỗi", msg);
    }
  };

  const handleCloseJob = async (id: number, isClosed: boolean) => {
    if(isClosed) return;
    try {
      const res = await closeJob(id);
      if (res.status === 200) {
        const { ToastService } = require("../../services/toastService");
        ToastService.success("✅ Thành công", res.message);
        await fetchJobs();
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Không thể đóng tin tuyển dụng. Vui lòng thử lại.";
      const { ToastService } = require("../../services/toastService");
      ToastService.error("❌ Lỗi", msg);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary.start} />
        <Text style={{ color: "#777", marginTop: 8 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Công việc của tôi</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("PostJob")}
        >
          <LinearGradient
            colors={gradients.purpleDream as any}
            style={styles.addBtnGradient}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Danh sách công việc */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EmployerJobCard
            status={item.status}
            title={item.jobTitle}
            expireationDate={item.expirationDate}
            applications={item.numberOfApplications}
            salaryRange={
              item.salaryType === "RANGE"
                ? `${item.minSalary} - ${item.maxSalary} ${item.salaryUnit}`
                : item.salaryType === "NEGOTIABLE"
                ? "Thỏa thuận"
                : item.salaryType === "GREATER_THAN"
                ? ` Trên ${item.minSalary} ${item.salaryUnit}`
                : "Không rõ"
            }
            onOptionsPress={() => {
              setIsSelectedClosed(item.status == "CLOSED")
              console.log(item.status == "ACLOSED")
              setSelectedId(item.id);
              setShowActionMenu(true);
            }}
          />
        )}
        onEndReached={loadMoreJobs}
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
            <Text style={styles.menuTitle}>Thao tác</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowActionMenu(false);
                navigation.navigate("ApplicationsByJob", { jobId: selectedId });
              }}
            >
              <Ionicons
                name="people-outline"
                size={18}
                color={colors.primary.start}
              />
              <Text style={styles.menuText}>Xem ứng viên</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowActionMenu(false);
                navigation.navigate("UpdateJob", { id: selectedId });
              }}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.primary.start}
              />
              <Text style={styles.menuText}>Sửa thông tin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowActionMenu(false);
                handleCloseJob(selectedId, isSelectedClosed);
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#ff8800"
              />
              <Text style={[styles.menuText, { color: "#ff8800" }]}>
                Đóng công việc
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowActionMenu(false);
                handleDeleteJob(selectedId);
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#ff3b30" />
              <Text style={[styles.menuText, { color: "#ff3b30" }]}>
                Xóa công việc
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
export default EmployerJobScreen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "85%",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  menuText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
