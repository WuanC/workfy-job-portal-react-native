import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MessageCard from "../components/MessageCard"
import { use, useState } from "react"


const MessageScreen = () => {

  const [chatDatas, setChatDatas] = useState([
    {
      id: "1",
      name: "J97 Nguyễn",
      lastMessage: "Bạn: Da không ",
      timestamp: "13:56",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      timeAgo: "18 phút",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "J97 Nguyễn",
      lastMessage: "Bạn: Da không ",
      timestamp: "13:56",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      timeAgo: "18 phút",
      unreadCount: 2,
      isOnline: true,
    },

  ])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.side} />

        {/* Tiêu đề */}
        <Text style={styles.headerTitle}>Đoạn chat</Text>

        {/* Bên phải (có setting) */}
        <View style={styles.side}>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatDatas}
        renderItem={({ item }) => <MessageCard item={item} />}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  side: {
    width: 40, // 👈 giữ cho bên trái & phải bằng nhau
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 4,
    marginLeft: 12,
  },
  chatList: {
    flex: 1,
  },
})

export default MessageScreen
