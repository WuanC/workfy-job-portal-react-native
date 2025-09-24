"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const CVScreen = () => {
  const [hasCV, setHasCV] = useState(true) // Set to true to see CV preview state

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCard}>
        <View style={styles.folderIconContainer}>
          <Ionicons name="folder" size={60} color="#4285F4" />
          <View style={styles.folderDots}>
            <View style={[styles.dot, { backgroundColor: "#4285F4" }]} />
            <View style={[styles.dot, { backgroundColor: "#34A853" }]} />
            <View style={[styles.dot, { backgroundColor: "#FBBC04" }]} />
          </View>
        </View>

        <Text style={styles.emptyTitle}>Bạn chưa có CV</Text>
        <Text style={styles.emptySubtitle}>Trải nghiệm tạo CV trên VietCV với nhiều mẫu CV đa dạng</Text>

        <TouchableOpacity style={styles.createButton} onPress={() => setHasCV(true)}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Tạo CV mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderCVPreview = () => (
    <View style={styles.cvContainer}>
      <View style={styles.cvCard}>
        <View style={styles.cvHeader}>
          <View style={styles.cvAvatar}>
            <Ionicons name="person" size={30} color="#666" />
          </View>
          <Text style={styles.cvName}>WUAN C</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.cvContent}>
          <View style={styles.cvSection}>
            <Text style={styles.cvSectionLabel}>Giới thiệu</Text>
            <View style={styles.cvSectionBar} />
          </View>

          <View style={styles.cvSection}>
            <Text style={styles.cvSectionLabel}>Kinh nghiệm làm việc</Text>
            <View style={styles.cvSectionBar} />
          </View>

          <View style={styles.cvSection}>
            <Text style={styles.cvSectionLabel}>Học vấn</Text>
            <View style={styles.cvSectionBar} />
          </View>

          <View style={styles.cvSection}>
            <Text style={styles.cvSectionLabel}>Kỹ năng</Text>
            <View style={styles.cvSectionBar} />
          </View>

          <View style={styles.cvSection}>
            <Text style={styles.cvSectionLabel}>Sở thích</Text>
            <View style={styles.cvSectionBar} />
          </View>

          <View style={styles.cvSection}>
            <Text style={styles.cvSectionLabel}>Thông tin liên lạc</Text>
            <View style={styles.cvSectionBar} />
          </View>
        </View>

        <View style={styles.cvFooter}>
          <Text style={styles.cvInfoTitle}>My CV</Text>
          <Text style={styles.cvInfoDate}>Cập nhật lần cuối: Th09 24, 2025</Text>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#666" />
          </View>
          <View>
            <Text style={styles.welcomeText}>Chào mừng tới VietCV</Text>
            <Text style={styles.userName}>Wuan C</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>CV của tôi ở VietCV</Text>

        {hasCV ? renderCVPreview() : renderEmptyState()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 20,
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  folderIconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  folderDots: {
    position: "absolute",
    top: -5,
    right: -10,
    flexDirection: "row",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: "#4285F4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // CV preview styles
  cvContainer: {
    flex: 1,
  },
  cvCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cvHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cvAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4a5568",
    justifyContent: "center",
    alignItems: "center",
  },
  cvName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  cvContent: {
    flex: 1,
    marginBottom: 20,
  },
  cvSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cvSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    backgroundColor: "#4a5568",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    width: 120,
    textAlign: "center",
  },
  cvSectionBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e2e8f0",
    marginLeft: 10,
    borderRadius: 4,
  },
  cvFooter: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cvInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cvInfoDate: {
    fontSize: 14,
    color: "#666",
  },
})

export default CVScreen
