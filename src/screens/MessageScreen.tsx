import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ChatItem {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  unreadCount?: number
  isOnline?: boolean
  timeAgo?: string
}

const MessageScreen = () => {
  const chatData: ChatItem[] = [
    {
      id: "1",
      name: "Bê Nguyễn",
      lastMessage: "Bạn: Da không",
      timestamp: "13:56",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      timeAgo: "18 phút",
    },
    {
      id: "2",
      name: "PBL6",
      lastMessage: "Dung: có assignment gì trong...",
      timestamp: "12:31",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "3",
      name: "22T_DT2",
      lastMessage: "Hai: https://www.facebook...",
      timestamp: "12:19",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "4",
      name: "đánh giá rèn luyện",
      lastMessage: "Bạn đã gửi một ảnh.",
      timestamp: "12:09",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      unreadCount: 1,
    },
    {
      id: "5",
      name: "Đặng Xuân Khánh",
      lastMessage: "để đi hỏi a thắng",
      timestamp: "11:51",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "6",
      name: "Thắng Châu",
      lastMessage: "tham khảo thôi á m",
      timestamp: "8:15",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: "7",
      name: "Sáng 3, tối 5, sáng 7, chiều cn",
      lastMessage: "Bạn: Ok",
      timestamp: "7:47",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      timeAgo: "11 phút",
    },
    {
      id: "8",
      name: "Định Đức",
      lastMessage: "Bạn: ok Đức",
      timestamp: "Th 3",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
      timeAgo: "23 phút",
      unreadCount: 2,
    },
    {
      id: "9",
      name: "レーチュンフォン",
      lastMessage: "Đã bày tỏ cảm xúc 😢 về tin...",
      timestamp: "Th 3",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      unreadCount: 1,
    },
  ]

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.timeAgo && (
          <View style={styles.timeAgoContainer}>
            <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.rightSection}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            {item.unreadCount && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đoạn chat</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="create-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatData}
        renderItem={renderChatItem}
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
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
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
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
  timeAgoContainer: {
    position: "absolute",
    bottom: -8,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  timeAgoText: {
    fontSize: 10,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginRight: 8,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
})

export default MessageScreen
