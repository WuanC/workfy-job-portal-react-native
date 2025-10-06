"use client"

import { useNavigation } from "@react-navigation/native"
import { useState, useRef, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet"
import Slider from "@react-native-community/slider"
import { GestureHandlerRootView } from "react-native-gesture-handler"


const FilterScreen = () => {
  const navigation = useNavigation()
  const toggleSelect = (
    id: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }
  // State chọn lọc
  const [selectedDate, setSelectedDate] = useState("1")
  const [selectedRank, setSelectedRank] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [selectedEducation, setSelectedEducation] = useState<string[]>([])
  const [selectedJobType, setSelectedJobType] = useState<string[]>([])
  const [selectedIndustry, setSelectedIndustry] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState(50)
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])

  const [query, setQuery] = useState<string>()
  // Data cho filter
  const dateFilter = [
    { id: "1", label: "Ngày cập nhật" },
    { id: "2", label: "Ngày đăng" },
    { id: "3", label: "Sắp hết hạn" },
  ]

  const location = [
    { id: "1", label: "Hồ Chí Minh" },
    { id: "2", label: "Hà Nội" },
    { id: "3", label: "Đà Nẵng" },
    { id: "4", label: "Hải Phòng" },
  ]
  const job = [
    { id: "1", label: "Bác sĩ" },
    { id: "2", label: "An ninh/ Bảo vệ" },
    { id: "3", label: "CNTT-Phần mềm" },
    { id: "4", label: "CNTT-phần cứng" },
  ]
  const rank = [
    { id: "1", label: "Sinh viên / Thực tập sinh" },
    { id: "2", label: "Mới đi làm" },
    { id: "3", label: "Nhân viên" },
    { id: "4", label: "Trưởng nhóm / Giám sát" },
    { id: "5", label: "Quản lý / Trưởng phòng" },
    { id: "6", label: "Giám đốc" },
    { id: "7", label: "Quản lý cấp cao" },
    { id: "8", label: "Điều hành cấp cao" },
  ]

  const experience = [
    { id: "1", label: "0 - 1 năm" },
    { id: "2", label: "1 - 2 năm" },
    { id: "3", label: "2 - 5 năm" },
    { id: "4", label: "5 - 10 năm" },
    { id: "5", label: "Hơn 10 năm" },
  ]

  const education = [
    { id: "1", label: "Trung học phổ thông" },
    { id: "2", label: "Trung cấp" },
    { id: "3", label: "Cử nhân" },
    { id: "4", label: "Thạc sĩ" },
    { id: "5", label: "Tiến sĩ" },
  ]

  const jobTypes = [
    { id: "1", label: "Nhân viên toàn thời gian" },
    { id: "2", label: "Nhân viên toàn thời gian tạm thời" },
    { id: "3", label: "Nhân viên bán thời gian" },
  ]

  const industries = [
    { id: "1", label: "Công nghệ thông tin" },
    { id: "2", label: "Tài chính - Ngân hàng" },
    { id: "3", label: "Kinh doanh - Bán hàng" },
    { id: "4", label: "Marketing - PR" },
    { id: "5", label: "Giáo dục - Đào tạo" },
  ]

  // Bottom sheet refs
  const locationSheetRef = useRef<BottomSheet>(null)
  const jobSheetRef = useRef<BottomSheet>(null)
  const snapPoints = ["98%"]


  // Hiển thị text
  const displayLocations =
    selectedLocations.length > 0
      ? location
        .filter((l) => selectedLocations.includes(l.id))
        .map((l) => l.label)
        .join(", ")
      : "Chọn địa điểm"

  const displayIndustry =
    selectedIndustry.length > 0
      ? industries
        .filter((i) => selectedIndustry.includes(i.id))
        .map((i) => i.label)
        .join(", ")
      : "Ngành nghề"

  // Reset filter
  const resetFilters = () => {
    setSelectedDate("1")
    setSelectedRank([])
    setSelectedExperience([])
    setSelectedEducation([])
    setSelectedJobType([])
    setSelectedIndustry([])
    setSelectedLocations([])
    setSalaryRange(50)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}   keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancel}>Hủy</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Bộ lọc tìm kiếm</Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.reset}>Đặt lại</Text>
          </TouchableOpacity>
        </View>

        {/* Ngày lọc */}
        <Text style={styles.sectionTitle}>Tìm kiếm theo</Text>
        <View style={styles.row}>
          {dateFilter.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                selectedDate === item.id && styles.chipSelected,
              ]}
              onPress={() => setSelectedDate(item.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedDate === item.id && styles.chipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>Nhập tỉnh, thành phố</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => locationSheetRef.current?.expand()}
        >
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.inputText} numberOfLines={1}>
            {displayLocations}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Industry */}
        <Text style={styles.sectionTitle}>Danh mục công việc</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => jobSheetRef.current?.expand()}
        >
          <Text style={styles.inputText} numberOfLines={1}>
            {displayIndustry}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Rank */}
        <Text style={styles.sectionTitle}>Cấp bậc</Text>
        <View style={styles.rowWrap}>
          {rank.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                selectedRank.includes(item.id) && styles.chipSelected,
              ]}
              onPress={() => toggleSelect(item.id, selectedRank, setSelectedRank)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedRank.includes(item.id) && styles.chipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Experience */}
        <Text style={styles.sectionTitle}>Kinh nghiệm</Text>
        <View style={styles.rowWrap}>
          {experience.map((item) => (
            <TouchableOpacity
              //key={`exp-${item.id}`}  
              key={item.id}
              style={[
                styles.chip,
                selectedExperience.includes(item.id) && styles.chipSelected,
              ]}
              onPress={() => toggleSelect(item.id, selectedExperience, setSelectedExperience)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedExperience.includes(item.id) &&
                  styles.chipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Salary */}
        <Text style={styles.sectionTitle}>Mức lương</Text>
        <View style={styles.salaryContainer}>
          <View style={styles.salaryLabels}>
            <Text style={styles.salaryLabel}>đ 0M</Text>
            <Text style={styles.salaryLabel}>đ 100M</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={salaryRange}
            onValueChange={setSalaryRange}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#E5E5E5"
          />
          <Text style={styles.salaryValue}>đ {Math.round(salaryRange)}M</Text>
        </View>

        {/* Education */}
        <Text style={styles.sectionTitle}>Học vấn</Text>
        <View style={styles.rowWrap}>
          {education.map((item) => (
            <TouchableOpacity
              key={`edu-${item.id}`}
              style={[
                styles.chip,
                selectedEducation.includes(item.id) && styles.chipSelected,
              ]}
              onPress={() => {
                console.log("Chọn học vấn:", item.label)
                toggleSelect(item.id, selectedEducation, setSelectedEducation)
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedEducation.includes(item.id) &&
                  styles.chipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Job type */}
        <Text style={styles.sectionTitle}>Loại công việc</Text>
        <View style={styles.rowWrap}>
          {jobTypes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                selectedJobType.includes(item.id) && styles.chipSelected,
              ]}
              onPress={() => toggleSelect(item.id, selectedJobType, setSelectedJobType)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedJobType.includes(item.id) && styles.chipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Apply button */}
      <TouchableOpacity style={styles.applyBtn}>
        <Text style={styles.applyText}>Áp dụng</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Location */}
      <BottomSheet
        ref={locationSheetRef}
        index={-1}
        snapPoints={["1%", "98%"]}
        enablePanDownToClose
        onChange={(index) => {
          console.log("Index:", index);

          if (index === -1) {
            console.log("Đang đóng");
          } else if (index === 0) {
            console.log("Đang mở: 98%");
          }
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Chọn danh mục</Text>
            <TouchableOpacity onPress={() => setSelectedLocations([])}>
              <Text style={{ color: "#007AFF" }}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#999" style={{ marginLeft: 8 }} />
            <TextInput
              placeholder="Tìm kiếm..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          <FlatList
            data={location}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedLocations.includes(item.id)
              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => toggleSelect(item.id, selectedLocations, setSelectedLocations)}
                >
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={22}
                    color={isSelected ? "#007AFF" : "#666"}
                    style={{ marginRight: 10 }}
                  />
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )
            }}
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => console.log("Đã chọn:", selectedLocations)}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Lưu</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>

      {/* Bottom Sheet Industry */}
      <BottomSheet
        ref={jobSheetRef}
        index={-1}
        snapPoints={["98%"]}
        enablePanDownToClose={true}
        enableOverDrag={true}// ❌ không cho kéo quá mức
        animateOnMount={false}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Chọn danh mục</Text>
            <TouchableOpacity onPress={() => setSelectedJobs([])}>
              <Text style={{ color: "#007AFF" }}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#999" style={{ marginLeft: 8 }} />
            <TextInput
              placeholder="Tìm kiếm..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          <FlatList
            data={job}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedJobs.includes(item.id)
              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => toggleSelect(item.id, selectedJobs, setSelectedJobs)}
                >
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={22}
                    color={isSelected ? "#007AFF" : "#666"}
                    style={{ marginRight: 10 }}
                  />
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )
            }}
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => console.log("Đã chọn:", setSelectedJobs)}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Lưu</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

export default FilterScreen

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16, paddingBottom: 80 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cancel: { color: "black", fontSize: 16 },
  title: { fontWeight: "bold", fontSize: 18 },
  reset: { color: "#007AFF", fontSize: 16 },
  sectionTitle: { marginVertical: 10, fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", marginBottom: 16 },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    //gap: 10,
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,

  },
  chipSelected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  chipText: { fontSize: 14, color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputText: { flex: 1, marginLeft: 8, fontSize: 14, color: "#333" },
  applyBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  applyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  modalItemText: { fontSize: 16, color: "#333" },
  salaryContainer: { marginBottom: 16, paddingHorizontal: 4 },
  salaryLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  salaryLabel: { fontSize: 14, color: "#666" },
  slider: { width: "100%", height: 40 },
  salaryValue: {
    textAlign: "center",
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  sheetContent: { flex: 1, paddingHorizontal: 16 },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 16, fontWeight: "600" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#333",
  },
})
