"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

interface Message {
  id: number
  text: string
  isSent: boolean
  isSystemMessage?: boolean
}

const ChatScreen = () => {
  const navigation = useNavigation()
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "hay cả nhóm", isSent: true },
    { id: 2, text: "TH 3 LÚC 19:11", isSent: false, isSystemMessage: true },
    { id: 3, text: "cái đây test report", isSent: false },
    { id: 4, text: "mỗi người 5 feature", isSent: false },
    { id: 5, text: "1 feature bao nhiều test case tùy", isSent: false },
    { id: 6, text: "mà 5 người chung 1 nhóm giống nhau hết là k dc pkh", isSent: true },
    { id: 7, text: "riêng chứ", isSent: false },
    { id: 8, text: "Ban đã trả lời chính mình", isSent: false, isSystemMessage: true },
    { id: 9, text: "taiif liều kiểm thử v2 là j ấy nhỉ", isSent: false },
    { id: 10, text: "ê cái này thấy k sửa j là khỏi làm j pkh", isSent: true },
    { id: 11, text: "có cần thêm 4 với 5 k nhỉ", isSent: true },
    { id: 12, text: "chả biết :)))", isSent: false },
    { id: 13, text: "bữa đi trễ", isSent: false },
    { id: 14, text: "oh no 😰", isSent: true },
  ])

  const [message, setMessage] = useState("")

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        isSent: true,
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      )
    }

    if (item.isSent) {
      return (
        <View style={[styles.messageRow, { justifyContent: "flex-end" }]}>
          <View style={[styles.messageBubble, styles.sentBubble]}>
            <Text style={[styles.messageText, styles.sentText]}>{item.text}</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.messageRow}>
        <Image
          source={require("../../assets/App/logoJob.png")}
          style={styles.avatar}
        />
        <View style={[styles.messageBubble, styles.receivedBubble]}>
          <Text style={[styles.messageText, styles.receivedText]}>{item.text}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/App/logoJob.png")}
          style={styles.logo}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.companyName}>Beetechsoft</Text>
          <Text style={styles.jobTitle}>Middle/Senior Unity Game Developer (C#)</Text>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Footer */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Aa"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { marginRight: 6 },
  logo: { width: 36, height: 36, borderRadius: 8 },
  headerTextContainer: { flex: 1, marginLeft: 8 },
  companyName: { fontWeight: "bold", fontSize: 16, color: "#000" },
  jobTitle: { fontSize: 13, color: "#666" },
  infoButton: { marginLeft: 8 },

  // Messages
  messagesContainer: { padding: 12 },
  messageRow: { flexDirection: "row", alignItems: "flex-end", marginVertical: 4 },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },

  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  sentBubble: { backgroundColor: "#007AFF", borderTopRightRadius: 0 },
  receivedBubble: { backgroundColor: "#E5E5E5", borderTopLeftRadius: 0 },
  messageText: { fontSize: 15 },
  sentText: { color: "#fff" },
  receivedText: { color: "#000" },

  // System message
  systemMessageContainer: { alignItems: "center", marginVertical: 6 },
  systemMessageText: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: { marginLeft: 8, padding: 6 },
})

export default ChatScreen
