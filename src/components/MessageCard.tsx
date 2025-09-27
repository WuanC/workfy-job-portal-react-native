import React from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { RootStackParamList } from "../types/navigation"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"

export interface ChatItem {
    id: string
    name: string
    lastMessage: string
    timestamp: string
    avatar: string
    unreadCount?: number
    isOnline?: boolean
    timeAgo?: string
}

interface ChatProps {
    item: ChatItem
    onPress?: (item: ChatItem) => void
}
type ChatNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Chat"
>;
const MessageCard = ({ item, onPress }: ChatProps) => {
    const navigation = useNavigation<ChatNavigationProp>();
    return (
        <TouchableOpacity style={styles.chatItem} onPress={() => {
            onPress?.(item)
            navigation.navigate("Chat");
        }}>
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
}

const styles = StyleSheet.create({
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
        justifyContent: "center",
        alignItems: "flex-end",
        width: 50, // giữ cố định để không đẩy layout
        position: "relative",
    },
    timestamp: {
        fontSize: 12,
        color: "#666",
    },
    unreadBadge: {
        position: "absolute",
        top: 25,     // 👈 đặt badge ngay dưới timestamp
        right: 0,
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

export default MessageCard
