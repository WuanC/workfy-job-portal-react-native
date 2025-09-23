"use client"

import React, { useRef, useCallback } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"

const JOBS = [
    { id: "1", name: "Công nghệ thông tin" },
    { id: "2", name: "Kinh doanh" },
    { id: "3", name: "Y tế" },
    { id: "4", name: "Xây dựng" },
    { id: "5", name: "Giáo dục" },
]

const JobListScreen = () => {
    // ref cho bottom sheet
    const bottomSheetRef = useRef<BottomSheet>(null)

    // snapPoints (chiều cao khi mở)
    const snapPoints = ["99%", "50%"]

    // mở bottom sheet khi click
    const handleOpenSheet = useCallback(() => {
        bottomSheetRef.current?.expand()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Danh sách ngành nghề</Text>

            <FlatList
                data={JOBS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={handleOpenSheet}>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Bottom Sheet */}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1} // -1 = đóng
                snapPoints={snapPoints} // thêm ít nhất 1 snapPoint khác
                enablePanDownToClose={true} // cho phép kéo xuống để đóng
            >
                <BottomSheetView style={styles.sheetContent}>
                    <Text style={styles.sheetTitle}>Chi tiết ngành nghề</Text>
                    <Text>Đây là nội dung popup khi bạn bấm vào ngành nghề.</Text>
                </BottomSheetView>
            </BottomSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    item: {
        padding: 16,
        backgroundColor: "#f2f2f2",
        marginBottom: 10,
        borderRadius: 8,
    },
    itemText: {
        fontSize: 16,
    },
    sheetContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
})

export default JobListScreen
