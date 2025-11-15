import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SearchBar from "../../components/SearchBar";
import EmployeeCard from "../../components/Employer/EmployeeCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { useI18n } from "../../hooks/useI18n";
type MyCandidateNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmployerSearchFilter"
>;
const MyCandidate = () => {
  const navigation = useNavigation<MyCandidateNavigationProp>();
  const { t } = useI18n();
  const [employees, setEmployees] = useState([
    {
      id: "1",
      name: "Nguyễn Văn A",
      position: "Kỹ thuật viên điện",
      location: "Bắc Ninh",
      salary: "12,000,000 VND - 15,000,000 VND",
      experience: "0 năm (Kỹ thuật viên / Kỹ sư)",
      age: 24,
      resumeType: "Đính kèm",
      status: "Vừa cập nhật",
    },
    {
      id: "2",
      name: "Trần Thị B",
      position: "Nhân viên kinh doanh",
      location: "Hà Nội",
      salary: "10,000,000 VND - 18,000,000 VND",
      experience: "2 năm (Kinh doanh / Bán hàng)",
      age: 27,
      resumeType: "Đính kèm",
      status: "Mới cập nhật",
    },
    {
      id: "3",
      name: "Lê Văn C",
      position: "Lập trình viên React Native",
      location: "TP. Hồ Chí Minh",
      salary: "20,000,000 VND - 30,000,000 VND",
      experience: "3 năm (Software Engineer)",
      age: 25,
      resumeType: "Đính kèm",
      status: "Vừa cập nhật",
    },
  ]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <SearchBar
        placeholder={t('search.searchPlaceholder')}
        value=""
        onChangeText={() => {}}
        onSubmit={() => {}}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>{t('profile.profile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.inactiveTabText}>{t('job.industry')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('EmployerSearchFilter')}>
          <Ionicons name="filter" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.countText}>
          {t('search.showingResults', { count: employees.length })}
        </Text>
        <Text style={styles.notifyText}>{t('notification.notifications')}</Text>
      </View>

      {/* Danh sách ứng viên */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EmployeeCard
            name={item.name}
            position={item.position}
            location={item.location}
            salary={item.salary}
            experience={item.experience}
            age={item.age}
            resumeType={item.resumeType}
            status={item.status}
          />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyCandidate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
  tabContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  tabRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 12,
  },
  activeTab: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  inactiveTab: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  inactiveTabText: {
    color: "#444",
  },
  filterButton: {
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  countText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  notifyText: {
    fontSize: 14,
    color: "#000",
  },
});
