"use client";

import { useNavigation } from "@react-navigation/native";
import { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  EducationLevel,
  ExperienceLevel,
  getEnumOptions,
  JobLevel,
  JobType,
  SalaryUnit,
  Sort,
} from "../../utilities/constant";
import { getAllProvince, Province } from "../../services/provinceService";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getAllIndustries, Industry } from "../../services/industryService";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { AdvancedJobQuery, getAdvancedJobs, getAllJobsAdmin, updateJobStatus } from "../../services/jobService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Dropdown } from "react-native-element-dropdown";
type FilterNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SearchMain"
>;
const FilterScreen = ({ route }: any) => {
  const navigation = useNavigation<FilterNavigationProp>()
  const { currentFilter, onApply } = route.params;
  useEffect(() => {
    if (currentFilter) {
      setSelectedSort(currentFilter.sort || "");
      setSelectedIndustry(currentFilter.industryIds || []);
      setSelectedLocations(currentFilter.provinceIds || []);
      setSelectedJobLevels(currentFilter.jobLevels || []);
      setSelectedJobType(currentFilter.jobTypes || []);
      setSelectedExperienceLevels(currentFilter.experienceLevels || []);
      setSelectedEducationLevels(currentFilter.educationLevels || []);
      if (currentFilter.minSalary !== null && currentFilter.minSalary !== undefined
        && currentFilter.maxSalary !== null && currentFilter.maxSalary !== undefined) {
        setSalaryOption("custom");
        setMaxSalary(currentFilter.maxSalary);
        setMinSalary(currentFilter.minSalary);
        setSalaryUnit(currentFilter.salaryUnit);
        
      }
      else{
        setSalaryOption("none");
      }
    }
  }, [currentFilter]);
  const toggleSelect = (
    id: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleSelectNumber = (
    id: number,
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSearch = async () => {
    try {
      // console.log("🧩 [DEBUG] Giá trị filter hiện tại:");
      // console.log("selectedSort:", selectedSort);
      // console.log("selectedIndustry:", selectedIndustry);
      // console.log("selectedLocations:", selectedLocations);
      // console.log("selectedJobLevels:", selectedJobLevels);
      //console.log("selectedJobType:", selectedJobType);
      // console.log("selectedExperienceLevels:", selectedExperienceLevels);
      // console.log("selectedEducationLevels:", selectedEducationLevels);
      // console.log("salaryRange:", salaryRange);
      const filter: AdvancedJobQuery = {
        keyword: currentFilter?.keyword ?? "",
        industryIds: selectedIndustry,
        provinceIds: selectedLocations,
        jobLevels: selectedJobLevels,
        jobTypes: selectedJobType,
        experienceLevels: selectedExperienceLevels,
        educationLevels: selectedEducationLevels,
        salaryUnit: selectSalaryUnity,
        minSalary: minSalary !== null && minSalary !== undefined ? minSalary : null,
        maxSalary: maxSalary ? maxSalary : null,
        sort: selectedSort,
        pageNumber: 1,
        pageSize: 10,
      }
      //await updateJobStatus(1, "APPROVED");
      //const res = await getAdvancedJobs(filter);

      console.log(filter.minSalary, filter.maxSalary, filter.salaryUnit);
      if (onApply) {
        onApply(filter); // ✅ Gọi callback để gửi dữ liệu ngược về
      }
      navigation.goBack();


    } catch (error) {
      console.error("Lỗi tìm kiếm nâng cao:", error);
    }
  };
  const [listProvinces, setListProvinces] = useState<Province[]>([]);
  const [listIndustries, setListIndustries] = useState<Industry[]>([]);

  const [selectedSort, setSelectedSort] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [selectedJobLevels, setSelectedJobLevels] = useState<string[]>([]);
  const [selectedJobType, setSelectedJobType] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([]);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<string[]>([]);

  const [salaryOption, setSalaryOption] = useState<"none" | "custom">("none");
  const [selectSalaryUnity, setSalaryUnit] = useState<string | null>(null);
  const [minSalary, setMinSalary] = useState<number | null>(null);
  const [maxSalary, setMaxSalary] = useState<number | null>(null);

  const [query, setQuery] = useState<string>("");

  const handleSelectSalaryOptions = (option: "none" | "custom") => {
    if (option === "none") {
      setMinSalary(null);
      setMaxSalary(null);
      setSalaryUnit(null);
    }
    else if (option === "custom") {
      setMinSalary(1);
      setMaxSalary(10000000)
      setSalaryUnit("VND");
    }
  }



  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const listIndustries = await getAllIndustries();
        const listProvinces = await getAllProvince();
        if (cancelled) return
        setListProvinces(listProvinces);
        setListIndustries(listIndustries);
      } catch (err: any) {
        console.error("Lỗi load:", err);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const locationSheetRef = useRef<BottomSheetModal>(null);
  const industrySheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["100%"], []);



  const displayLocations =
    selectedLocations.length > 0
      ? listProvinces
        .filter((l) => selectedLocations.includes(l.id))
        .map((l) => l.name)
        .join(", ")
      : "Chọn địa điểm";

  const displayIndustry =
    selectedIndustry.length > 0
      ? listIndustries
        .filter((i) => selectedIndustry.includes(i.id))
        .map((i) => i.name)
        .join(", ")
      : "Danh mục công việc";

  const resetFilters = () => {
    setSelectedSort("");
    setSelectedJobLevels([]);
    setSelectedExperienceLevels([]);
    setSelectedEducationLevels([]);
    setSelectedJobType([]);
    setSelectedIndustry([]);
    setSelectedLocations([]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
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

            {/* Sort */}
            <Text style={styles.sectionTitle}>Tìm kiếm theo</Text>
            <View style={styles.row}>
              {getEnumOptions(Sort).map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.chip,
                    selectedSort === item.value && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedSort(item.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedSort === item.value && styles.chipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Location */}
            <Text style={styles.sectionTitle}>Tỉnh/Thành phố</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => {
                setQuery("")
                locationSheetRef.current?.present()
              }}
            >
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.inputText} numberOfLines={1}>
                {displayLocations}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Industry */}
            <Text style={styles.sectionTitle}>Ngành nghề</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => {
                setQuery("")
                industrySheetRef.current?.present()
              }}
            >
              <Text style={styles.inputText} numberOfLines={1}>
                {displayIndustry}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Rank */}
            <Text style={styles.sectionTitle}>Cấp bậc</Text>
            <View style={styles.rowWrap}>
              {getEnumOptions(JobLevel).map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.chip,
                    selectedJobLevels.includes(item.value) && styles.chipSelected,
                  ]}
                  onPress={() =>
                    toggleSelect(item.value, selectedJobLevels, setSelectedJobLevels)
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedJobLevels.includes(item.value) &&
                      styles.chipTextSelected,
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
              {getEnumOptions(ExperienceLevel).map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.chip,
                    selectedExperienceLevels.includes(item.value) &&
                    styles.chipSelected,
                  ]}
                  onPress={() =>
                    toggleSelect(
                      item.value,
                      selectedExperienceLevels,
                      setSelectedExperienceLevels
                    )
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedExperienceLevels.includes(item.value) &&
                      styles.chipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Experience */}
            <Text style={styles.sectionTitle}>Loại công việc</Text>
            <View style={styles.rowWrap}>
              {getEnumOptions(JobType).map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.chip,
                    selectedJobType.includes(item.value) &&
                    styles.chipSelected,
                  ]}
                  onPress={() =>
                    toggleSelect(
                      item.value,
                      selectedJobType,
                      setSelectedJobType
                    )
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedJobType.includes(item.value) &&
                      styles.chipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Experience */}
            <Text style={styles.sectionTitle}>Học vấn</Text>
            <View style={styles.rowWrap}>
              {getEnumOptions(EducationLevel).map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.chip,
                    selectedEducationLevels.includes(item.value) &&
                    styles.chipSelected,
                  ]}
                  onPress={() =>
                    toggleSelect(
                      item.value,
                      selectedEducationLevels,
                      setSelectedEducationLevels
                    )
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedEducationLevels.includes(item.value) &&
                      styles.chipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Salary */}
            {/* <Text style={styles.sectionTitle}>Mức lương mong muốn</Text>
            <View style={styles.salaryBox}>
              <View style={styles.salaryRangeBox}>
                <View style={styles.salaryValueBox}>
                  <Text style={styles.salaryValueText}>₫{salaryRange[0]}M</Text>
                </View>
                <View style={styles.salaryValueBox}>
                  <Text style={styles.salaryValueText}>₫{salaryRange[1]}M</Text>
                </View>
              </View>

              <MultiSlider
                values={[salaryRange[0], salaryRange[1]]}
                onValuesChange={(values) => setSalaryRange(values as [number, number])}
                min={1}
                max={10000}
                step={1}
                sliderLength={300}
                selectedStyle={{ backgroundColor: "#007AFF" }}
                unselectedStyle={{ backgroundColor: "#D6E4FF" }}
                trackStyle={{ height: 6, borderRadius: 8 }}
                markerStyle={{
                  backgroundColor: "#007AFF",
                  height: 22,
                  width: 22,
                  borderRadius: 11,
                  borderWidth: 3,
                  borderColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                }}
                containerStyle={{ alignSelf: "center", marginTop: 10 }}
              />
            </View> */}
            <View>
              <Text style={styles.sectionTitle}>Mức lương mong muốn</Text>

              {/* Chọn kiểu nhập */}
              <View style={styles.optionContainer}>
                <TouchableOpacity
                  style={[styles.optionButton, salaryOption === "none" && styles.optionButtonActive]}
                  onPress={() => {
                    setSalaryOption("none")
                    handleSelectSalaryOptions("none");  
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      salaryOption === "none" && styles.optionTextActive,
                    ]}
                  >
                    Không nhập lương
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionButton, salaryOption === "custom" && styles.optionButtonActive]}
                  onPress={() => {
                    setSalaryOption("custom")
                    handleSelectSalaryOptions("custom");
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      salaryOption === "custom" && styles.optionTextActive,
                    ]}
                  >
                    Nhập lương
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Khi chọn nhập lương */}
              {salaryOption === "custom" && (
                <View style={styles.salaryBox}>
                  <Text style={styles.inputLabel}>Mức lương tối thiểu</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mức lương tối thiểu"
                    keyboardType="numeric"
                    value={minSalary?.toString() || ""}
                    onChangeText={(text) => setMinSalary(text ? Number(text) : null)}
                  />

                  <Text style={[styles.inputLabel, { marginTop: 10 }]}>
                    Mức lương tối đa
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mức lương tối đa"
                    keyboardType="numeric"
                    value={maxSalary?.toString() || ""}
                    onChangeText={(text) => setMaxSalary(text ? Number(text) : null)}
                  />

                  {/* Dropdown chọn đơn vị */}
                  <Dropdown
                    data={getEnumOptions(SalaryUnit)}
                    labelField="value"
                    valueField="value"
                    placeholder="Chọn đơn vị"
                    value={selectSalaryUnity}
                    onChange={(item) => setSalaryUnit(item.value)}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                  />
                </View>
              )}
            </View>
          </ScrollView>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyBtn} onPress={() => handleSearch()}>
            <Text style={styles.applyText}>Áp dụng</Text>
          </TouchableOpacity>

          {/* ✅ Location Sheet */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <BottomSheetModal
              ref={locationSheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose
              // keyboardBehavior="extend"
              // keyboardBlurBehavior="restore"
              style={{ paddingHorizontal: 10 }}
              keyboardBehavior="interactive"      // 👈 giữ nguyên full height khi gõ
              keyboardBlurBehavior="none"
              enableDynamicSizing={false}
            >
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Chọn địa điểm</Text>
                <TouchableOpacity onPress={() => {
                  setQuery("")
                  setSelectedLocations([])
                }}>
                  <Text style={{ color: "#007AFF", fontSize: 18 }}>Xóa tất cả</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color="#999" style={{ marginLeft: 10 }} />
                <TextInput
                  placeholder="Tìm kiếm..."
                  placeholderTextColor="#999"
                  value={query}
                  onChangeText={setQuery}
                  style={styles.searchInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <BottomSheetFlatList
                data={listProvinces.filter((p) =>
                  p.name.toLowerCase().includes(query.toLowerCase())
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = selectedLocations.includes(item.id);
                  return (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() =>
                        toggleSelectNumber(
                          item.id,
                          selectedLocations,
                          setSelectedLocations
                        )
                      }
                    >
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={22}
                        color={isSelected ? "#007AFF" : "#666"}
                        style={{ marginRight: 10 }}
                      />
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={() => (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
                  </View>
                )}
                contentContainerStyle={{ flexGrow: 100, paddingBottom: 80 }}
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => locationSheetRef.current?.dismiss()} // ✅ dismiss() để đóng
              >
                <Text style={{ color: "white", fontWeight: "600" }}>Lưu</Text>
              </TouchableOpacity>
            </BottomSheetModal>
          </KeyboardAvoidingView>

          {/* ✅ Industry Sheet */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <BottomSheetModal
              ref={industrySheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose
              keyboardBehavior="extend"
              keyboardBlurBehavior="restore"
              style={{ paddingHorizontal: 10 }}
              enableDynamicSizing={false}
            >
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Chọn danh mục</Text>
                <TouchableOpacity onPress={() => {
                  setQuery("")
                  setSelectedIndustry([])
                }}>
                  <Text style={{ color: "#007AFF", fontSize: 18 }}>Xóa tất cả</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color="#999" style={{ marginLeft: 10 }} />
                <TextInput
                  placeholder="Tìm kiếm..."
                  placeholderTextColor="#999"
                  value={query}
                  onChangeText={setQuery}
                  style={styles.searchInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <BottomSheetFlatList
                data={listIndustries.filter((p) =>
                  p.name.toLowerCase().includes(query.toLowerCase())
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = selectedIndustry.includes(item.id);
                  return (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() =>
                        toggleSelectNumber(
                          item.id,
                          selectedIndustry,
                          setSelectedIndustry
                        )
                      }
                    >
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={22}
                        color={isSelected ? "#007AFF" : "#666"}
                        style={{ marginRight: 10 }}
                      />
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={() => (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
                  </View>
                )}
                contentContainerStyle={{ flexGrow: 100, paddingBottom: 80 }}
                style={{ flex: 1 }}
              />

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  setQuery("")
                  industrySheetRef.current?.dismiss()
                }} // ✅ dismiss() để đóng
              >
                <Text style={{ color: "white", fontWeight: "600" }}>Lưu</Text>
              </TouchableOpacity>
            </BottomSheetModal>
          </KeyboardAvoidingView>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default FilterScreen;


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
    borderRadius: 10,
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
  salaryBox: {
    marginTop: 20,
    paddingVertical: 18,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: 20,
  },
  salaryRangeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  salaryValueBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 90,
    alignItems: "center",
  },
  salaryValueLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  salaryValueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  salaryLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  salaryLabel: {
    fontSize: 13,
    color: "#666",
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
    marginBottom: 10
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
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#333",
  },

  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    fontStyle: "italic",
  },

  ////
  optionContainer: { flexDirection: "row", marginTop: 10, marginBottom: 20 },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  optionButtonActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  optionText: { color: "#333" },
  optionTextActive: { color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  inputLabel: { fontWeight: "500", marginBottom: 5 },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  placeholderStyle: { color: "#999" },
  selectedTextStyle: { color: "#000" },

})
