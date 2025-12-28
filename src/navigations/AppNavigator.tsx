import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, Alert, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import * as Linking from "expo-linking";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnreadCount } from "../services/notificationService";
import { getConversations } from "../services/messageService";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../hooks/useI18n";
import { useWebSocket } from "../hooks/useWebSocket";
import { ToastService } from "../services/toastService";
import { MessageResponse } from "../types/type";

// 🔗 Navigation Ref để điều hướng bên ngoài
import { navigationRef } from "./NavigationRef";

// 🧠 API

// 🧩 Screens
import JobSeekerLoginScreen from "../screens/Auth/JobSeekerLoginScreen";
import JobSeekerRegisterScreen from "../screens/Auth/JobSeekerRegisterScreen";
import ConfirmEmailScreen from "../screens/Auth/ConfirmEmailScreen";

import ExploreScreen from "../screens/JobSeeker/ExploreScreen";
import MessageScreen from "../screens/JobSeeker/MessageScreen";
import ConversationListScreen from "../screens/JobSeeker/ConversationListScreen";
import SearchScreen from "../screens/JobSeeker/SearchScreen";
import MyJobScreen from "../screens/JobSeeker/MyJobScreen";
import CVScreen from "../screens/JobSeeker/CVScreen";
import MenuScreen from "../screens/JobSeeker/Menu&Settings/MenuScreen";

import JobSubmitScreen from "../screens/JobSeeker/JobSubmitScreen";
import JobSubmitSucessScreen from "../screens/JobSeeker/JobSubmitSucessScreen";
import FilterScreen from "../screens/JobSeeker/FilterScreen";
import ChatScreen from "../screens/JobSeeker/ChatScreen";
import SettingScreen from "../screens/JobSeeker/Menu&Settings/SettingScreen";
import ChangePasswordScreen from "../screens/JobSeeker/Menu&Settings/ChangePasswordScreen";
import ChangeEmailScreen from "../screens/JobSeeker/Menu&Settings/ChangeEmailScreen";
import EmployerJobScreen from "../screens/Employer/EmployerJobScreen";
import MyCandidate from "../screens/Employer/MyCandidate";
import PostJobScreen from "../screens/Employer/PostJobScreen";
import EmployerSettingScreen from "../screens/Employer/EmployerSettingScreen";
import CandidateFilter from "../screens/Employer/CandidateFilter";
import CompanyDetailScreen from "../screens/JobSeeker/CompanyDetailScreen";
import BlogScreen from "../screens/BlogScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import EmployerLoginScreen from "../screens/Auth/EmployerLoginScreen";
import EmployerRegisterScreen from "../screens/Auth/EmployerRegisterScreen";
import MyCompany from "../screens/Employer/MyCompany";
import UpdateCompanyInfo from "../screens/Employer/UpdateCompanyInfo";
import UpdateCompanyMedia from "../screens/Employer/UpdateCompanyMedia";
import UpdateJobScreen from "../screens/Employer/UpdateJobScreen";
import JobDetailScreen from "../screens/JobSeeker/JobDetailScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/Auth/ResetPasswordScreen";
import EmployeeDetailApplication from "../screens/JobSeeker/EmployeeDetailApplication";
import NotificationScreen from "../screens/NotificationScreen";
import ApplicationsByJobScreen from "../screens/Employer/ApplicationsByJobScreen";
import EmployerDetailApplication from "../screens/Employer/EmployerDetailApplication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostJobScreen2 from "../screens/Employer/PostJobScreen2";
import EmployerConversationListScreen from "../screens/Employer/EmployerConversationListScreen";
import EmployerChatScreen from "../screens/Employer/EmployerChatScreen";
import UpdateProfileScreen from "../screens/JobSeeker/Menu&Settings/UpdateProfileScreen";
import EmployerPostScreen from "../screens/Employer/EmployerPostScreen";
import CreatePostScreen from "../screens/Employer/CreatePostScreen";
import UpdatePostScreen from "../screens/Employer/UpdatePostScreen";

// ✅ Tạo Stack và Tab
const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExploreStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const MessageStack = createNativeStackNavigator();
const NotificationStack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();

// ========== Job Seeker Tabs ==========
const ExploreStackScreen = () => (
  <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
    <ExploreStack.Screen name="ExploreMain" component={ExploreScreen} />
    <ExploreStack.Screen name="JobDetail" component={JobDetailScreen} />
    <ExploreStack.Screen name="JobSubmit" component={JobSubmitScreen} />
    <ExploreStack.Screen name="JobSubmitSuccess" component={JobSubmitSucessScreen} />
    <RootStack.Screen name="Blog" component={BlogScreen} />
    <SearchStack.Screen name="SearchMain" component={SearchScreen} />
    <SearchStack.Screen name="SearchFilter" component={FilterScreen} />
    <RootStack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
    <RootStack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    <RootStack.Screen name="Notification" component={NotificationScreen} />
  </ExploreStack.Navigator>
);

const SearchStackScreen = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="SearchMain" component={SearchScreen} />
    <SearchStack.Screen name="JobDetail" component={JobDetailScreen} />
    <SearchStack.Screen name="JobSubmit" component={JobSubmitScreen} />
    <SearchStack.Screen name="JobSubmitSuccess" component={JobSubmitSucessScreen} />
    <SearchStack.Screen name="SearchFilter" component={FilterScreen} />
    <RootStack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
  </SearchStack.Navigator>
);

const EmployeeApplicationStackScreen = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="MyJob" component={MyJobScreen} />
    <SearchStack.Screen name="EmployeeDetailApplication" component={EmployeeDetailApplication} />
    <SearchStack.Screen name="JobDetail" component={JobDetailScreen} />
    <SearchStack.Screen name="JobSubmit" component={JobSubmitScreen} />
    <SearchStack.Screen name="JobSubmitSuccess" component={JobSubmitSucessScreen} />
    <RootStack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
  </SearchStack.Navigator>
)

const MessageStackScreen = () => (
  <MessageStack.Navigator screenOptions={{ headerShown: false }}>
    <MessageStack.Screen name="MessageMain" component={ConversationListScreen} />
    <MessageStack.Screen name="Chat" component={ChatScreen} />
  </MessageStack.Navigator>
);

const MenuStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="MenuMain" component={MenuScreen} />
    <MenuStack.Screen name="Setting" component={SettingScreen} />
    <MenuStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <MenuStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
    <MenuStack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
  </MenuStack.Navigator>
);

const NotificationStackScreen = () => (
  <NotificationStack.Navigator screenOptions={{ headerShown: false }}>
    <NotificationStack.Screen name="NotificationMain" component={NotificationScreen} />
  </NotificationStack.Navigator>
);

// ========== Employer Tabs ==========
const EmployerJobStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="EmployerJob" component={EmployerJobScreen} />
    <MenuStack.Screen name="PostJob" component={PostJobScreen} />
    <MenuStack.Screen name="PostJob2" component={PostJobScreen2} />
    <MenuStack.Screen name="UpdateJob" component={UpdateJobScreen} />
    <MenuStack.Screen name="ApplicationsByJob" component={ApplicationsByJobScreen} />
    <MenuStack.Screen name="EmployerDetailApplication" component={EmployerDetailApplication} />
    <MenuStack.Screen name="EmployerChat" component={EmployerChatScreen} />
  </MenuStack.Navigator>
);

const EmployerCandidateStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="MyCandidate" component={MyCandidate} />
    <MenuStack.Screen name="EmployerSearchFilter" component={CandidateFilter} />
  </MenuStack.Navigator>
);
const EmployerMyCompanyStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="MyCompany" component={MyCompany} />
    <MenuStack.Screen name="UpdateCompanyInfo" component={UpdateCompanyInfo} />
    <MenuStack.Screen name="UpdateCompanyMedia" component={UpdateCompanyMedia} />
  </MenuStack.Navigator>
);

const EmployerMessageStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="EmployerMessageMain" component={EmployerConversationListScreen} />
    <MenuStack.Screen name="EmployerChat" component={EmployerChatScreen} />
  </MenuStack.Navigator>
);

const EmployerPostStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="EmployerPost" component={EmployerPostScreen} />
    <MenuStack.Screen name="CreatePost" component={CreatePostScreen} />
    <MenuStack.Screen name="UpdatePost" component={UpdatePostScreen} />
  </MenuStack.Navigator>
);


// ========== Component để hiển thị icon với badge ==========
const TabBarIconWithBadge = ({
  iconName,
  color,
  badgeCount
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  badgeCount?: number;
}) => {
  const showBadge = badgeCount !== undefined && badgeCount > 0;

  return (
    <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name={iconName} size={24} color={color} />
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount! > 99 ? '99+' : badgeCount!.toString()}
          </Text>
        </View>
      )}
    </View>
  );
};

// ========== Bottom Tabs ==========
const MainAppEmployee = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  // Lấy số thông báo chưa đọc
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch mỗi 30 giây
  });

  // Lấy số conversation chưa đọc (hasUnread = true)
  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ["messages", "unread-count"],
    queryFn: async () => {
      const conversations = await getConversations();
      // Đếm số conversation có hasUnread = true
      return conversations.filter(conv => conv.hasUnread === true).length;
    },
    enabled: isAuthenticated,
    refetchInterval: 10000, // Refetch mỗi 10 giây
    staleTime: 0, // Luôn coi dữ liệu là cũ để refetch
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary.start,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          backgroundColor: colors.surface,
        },
        tabBarButton: (props) => (
          <TouchableOpacity {...(props as TouchableOpacityProps)} activeOpacity={1} />
        ),
        tabBarIcon: ({ color }) => {
          if (route.name === "ExploreStack")
            return <Ionicons name="compass-outline" size={24} color={color} />;
          if (route.name === "SearchStack")
            return <Ionicons name="search-outline" size={24} color={color} />;
          if (route.name === "MyJobStack")
            return <MaterialIcons name="work-outline" size={24} color={color} />;
          if (route.name === "MessageStack")
            return <TabBarIconWithBadge iconName="chatbubbles-outline" color={color} badgeCount={unreadMessagesCount} />;
          if (route.name === "NotificationStack")
            return <TabBarIconWithBadge iconName="notifications-outline" color={color} badgeCount={unreadCount} />;
          if (route.name === "MenuStack")
            return <Ionicons name="menu-outline" size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ExploreStack" component={ExploreStackScreen} options={{ title: t('navigation.explore') }} />
      <Tab.Screen name="SearchStack" component={SearchStackScreen} options={{ title: t('navigation.search') }} />
      <Tab.Screen name="MyJobStack" component={EmployeeApplicationStackScreen} options={{ title: t('navigation.myJobs') }} />
      <Tab.Screen name="MessageStack" component={MessageStackScreen} options={{ title: t('navigation.messages') }} />
      <Tab.Screen name="NotificationStack" component={NotificationStackScreen} options={{ title: t('navigation.notifications') }} />
      <Tab.Screen name="MenuStack" component={MenuStackScreen} options={{ title: t('navigation.menu') }} />
    </Tab.Navigator>
  );
};

const MainAppEmployer = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  // Lấy số thông báo chưa đọc
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch mỗi 30 giây
  });

  // Lấy số conversation chưa đọc (hasUnread = true)
  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ["messages", "unread-count"],
    queryFn: async () => {
      const conversations = await getConversations();
      // Đếm số conversation có hasUnread = true
      const count = conversations.filter(conv => conv.hasUnread === true).length;
    
      return count;
    },
    enabled: isAuthenticated,
    refetchInterval: 10000, // Refetch mỗi 10 giây
    staleTime: 0, // Luôn coi dữ liệu là cũ để refetch
  });

  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary.start,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          backgroundColor: colors.surface,
        },
        tabBarButton: (props) => (
          <TouchableOpacity {...(props as TouchableOpacityProps)} activeOpacity={1} />
        ),
        tabBarIcon: ({ color }) => {
          if (route.name === "EmployerMyJobStack")
            return <MaterialIcons name="work-outline" size={24} color={color} />;
          if (route.name === "EmployerPostStack")
            return <Ionicons name="newspaper-outline" size={24} color={color} />;
          if (route.name === "EmployerMessageStack")
            return <TabBarIconWithBadge iconName="chatbubbles-outline" color={color} badgeCount={unreadMessagesCount} />;
          if (route.name === "NotificationStack")
            return <TabBarIconWithBadge iconName="notifications-outline" color={color} badgeCount={unreadCount} />;
          if (route.name === "MyCompanStack")
            return <Ionicons name="business-outline" size={24} color={color} />;
          if (route.name === "EmployerSetting")
            return <Ionicons name="settings-outline" size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="EmployerMyJobStack" component={EmployerJobStackScreen} options={{
        title: t('navigation.jobs'),
        tabBarAccessibilityLabel: 'jobTab',
        tabBarLabel: 'Jobs',
      }} />
      <Tab.Screen name="EmployerPostStack" component={EmployerPostStackScreen} options={{
        title: 'Posts',
        tabBarAccessibilityLabel: 'postTab',
        tabBarLabel: 'Posts',
      }} />
      <Tab.Screen name="EmployerMessageStack" component={EmployerMessageStackScreen} options={{ title: t('navigation.messages') }} />
      <Tab.Screen name="NotificationStack" component={NotificationStackScreen} options={{ title: t('navigation.notifications') }} />
      <Tab.Screen name="MyCompanStack" component={EmployerMyCompanyStackScreen} options={{ title: t('navigation.company') }} />
      <Tab.Screen name="EmployerSetting" component={EmployerSettingScreen} options={{
        title: t('navigation.settings'), tabBarAccessibilityLabel: 'settingsTab',
        tabBarLabel: 'Settings',
      }
      } />

    </Tab.Navigator>
  );
};

// ========== Root Stack ==========
const AppNavigator = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useI18n();
  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);
  const queryClient = useQueryClient();
  
  // WebSocket global listener cho toast notifications
  const { onNewMessage, isConnected: isWebSocketConnected } = useWebSocket();
  const [showConnectionStatus, setShowConnectionStatus] = useState(true);

  // Auto-hide connection status sau khi connected
  useEffect(() => {
    if (isWebSocketConnected) {
      const timer = setTimeout(() => {
        setShowConnectionStatus(false);
      }, 3000); // Ẩn sau 3 giây
      
      return () => clearTimeout(timer);
    } else {
      setShowConnectionStatus(true); // Hiện lại khi disconnect
    }
  }, [isWebSocketConnected]);

  // Auto-hide connection status sau khi connected
  useEffect(() => {
    if (isWebSocketConnected) {
      const timer = setTimeout(() => {
        setShowConnectionStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowConnectionStatus(true);
    }
  }, [isWebSocketConnected]);

  // Đăng ký global WebSocket listener cho toast notifications
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    console.log("🌐 [AppNavigator] Setting up global WebSocket message listener");
    console.log("🌐 [AppNavigator] User:", user.id, "Role:", user.role);
    
    const handleNewMessage = (message: MessageResponse, unreadInfo?: any) => {
      console.log("📩 [AppNavigator] New message received:", {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderType: message.senderType,
        senderName: message.senderName,
        content: message.content.substring(0, 50)
      });
      
      // Normalize roles để so sánh
      const userRole = user.role?.toUpperCase() || '';
      const messageSenderType = message.senderType?.toUpperCase() || '';
      
      // Kiểm tra xem có phải tin nhắn của mình không
      // User EMPLOYER gửi message EMPLOYER -> own message
      // User EMPLOYEE/USER gửi message EMPLOYEE/USER -> own message  
      const isOwnMessage = userRole === 'EMPLOYER' 
        ? messageSenderType === 'EMPLOYER'
        : (messageSenderType === 'EMPLOYEE' || messageSenderType === 'USER');
      
      console.log("🔍 [AppNavigator] Check:", {
        userRole,
        messageSenderType,
        isOwnMessage
      });
      
      // LUÔN invalidate unread count để cập nhật badge
      console.log("🔄 [AppNavigator] Invalidating unread count query");
      queryClient.invalidateQueries({ queryKey: ["messages", "unread-count"] });
      
      // Hiển thị toast chỉ khi KHÔNG phải tin nhắn của mình
      if (!isOwnMessage) {
        console.log("🔔 [AppNavigator] Showing toast for message from:", message.senderName);
        ToastService.info(
          message.senderName || "Tin nhắn mới",
          message.content.length > 50 
            ? message.content.substring(0, 50) + "..." 
            : message.content
        );
      } else {
        console.log("⏩ [AppNavigator] Skipping toast - own message");
      }
    };

    // Đăng ký listener
    onNewMessage(handleNewMessage);

    // Cleanup
    return () => {
      console.log("🧹 [AppNavigator] Cleaning up WebSocket listener");
    };
  }, [isAuthenticated, user, onNewMessage, queryClient]);

  // Chỉ chạy 1 lần, không phụ thuộc loading
  useEffect(() => {
    AsyncStorage.getItem("isEmployer").then((value) => {
      if (value === "true") setIsEmployer(true);
      else setIsEmployer(false);
    });
  }, []);
  useEffect(() => {
    if (loading) {
      AsyncStorage.getItem("isEmployer").then((value) => {
        if (value === "true") setIsEmployer(true);
        else setIsEmployer(false);
      });
    }

  }, [loading]);

  if (loading) {

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary.start} />
        <Text style={{ color: colors.text.secondary, marginTop: 12, fontSize: 16 }}>
          {t('navigation.loadingUser')}
        </Text>
      </View>
    );
  }
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }} edges={["top", "left", "right", "bottom"]}>
          {/* WebSocket Connection Status Banner */}
          {isAuthenticated && showConnectionStatus && (
            <View style={styles.connectionBanner}>
              <View style={styles.connectionContent}>
                {isWebSocketConnected ? (
                  <>
                    <View style={styles.connectedDot} />
                    <Text style={styles.connectionText}>Chat WebSocket Connected</Text>
                  </>
                ) : (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.connectionText}>Connecting to Chat...</Text>
                  </>
                )}
              </View>
            </View>
          )}
          <NavigationContainer>
            <RootStack.Navigator
              screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#000000" } }}
            >
              {/* Auth */}
              {/* Nếu chưa đăng nhập */}
              {!isAuthenticated ? (
                isEmployer === true ? (
                  <>
                    <RootStack.Screen name="EmployerLogin" component={EmployerLoginScreen} />
                    <RootStack.Screen name="Login" component={JobSeekerLoginScreen} />
                    <RootStack.Screen name="EmployerRegister" component={EmployerRegisterScreen} />
                    <RootStack.Screen name="Register" component={JobSeekerRegisterScreen} />

                    <RootStack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                    <RootStack.Screen name="MainAppEmployer" component={MainAppEmployer} />
                    <RootStack.Screen name="MainApp" component={MainAppEmployee} />
                    <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <RootStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                  </>

                ) : (
                  <>
                    {/* Giữ nguyên khi false hoặc null */}
                    <RootStack.Screen name="Login" component={JobSeekerLoginScreen} />
                    <RootStack.Screen name="EmployerRegister" component={EmployerRegisterScreen} />
                    <RootStack.Screen name="Register" component={JobSeekerRegisterScreen} />
                    <RootStack.Screen name="EmployerLogin" component={EmployerLoginScreen} />
                    <RootStack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                    <RootStack.Screen name="MainAppEmployer" component={MainAppEmployer} />
                    <RootStack.Screen name="MainApp" component={MainAppEmployee} />
                    <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <RootStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                  </>
                )
              ) : user?.role === "employer" ? (
                // Nếu là nhà tuyển dụng
                <>
                  <RootStack.Screen name="MainAppEmployer" component={MainAppEmployer} />
                  <RootStack.Screen name="Login" component={JobSeekerLoginScreen} />
                  <RootStack.Screen name="EmployerRegister" component={EmployerRegisterScreen} />
                  <RootStack.Screen name="Register" component={JobSeekerRegisterScreen} />
                  <RootStack.Screen name="EmployerLogin" component={EmployerLoginScreen} />
                  <RootStack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                  <RootStack.Screen name="MainApp" component={MainAppEmployee} />
                </>
              ) : (
                // Nếu là ứng viên
                <>
                  <RootStack.Screen name="MainApp" component={MainAppEmployee} />
                  <RootStack.Screen name="MainAppEmployer" component={MainAppEmployer} />
                  <RootStack.Screen name="Login" component={JobSeekerLoginScreen} />
                  <RootStack.Screen name="EmployerRegister" component={EmployerRegisterScreen} />
                  <RootStack.Screen name="Register" component={JobSeekerRegisterScreen} />
                  <RootStack.Screen name="EmployerLogin" component={EmployerLoginScreen} />
                  <RootStack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                </>
              )}
              {/* Main */}


            </RootStack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView >
  );
};

// ========== Styles ==========
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -12,
    top: -8,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: colors.surface || '#ffffff',
    shadowColor: '#ff3b30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 13,
    textAlign: 'center',
  },
  connectionBanner: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 9999,
  },
  connectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  connectionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default AppNavigator;
