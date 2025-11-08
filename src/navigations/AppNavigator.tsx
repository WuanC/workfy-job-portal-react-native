import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, Alert, View, ActivityIndicator, Text } from "react-native";
import * as Linking from "expo-linking";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

// 🔗 Navigation Ref để điều hướng bên ngoài
import { navigationRef } from "./NavigationRef";

// 🧠 API

// 🧩 Screens
import JobSeekerLoginScreen from "../screens/Auth/JobSeekerLoginScreen";
import JobSeekerRegisterScreen from "../screens/Auth/JobSeekerRegisterScreen";
import ConfirmEmailScreen from "../screens/Auth/ConfirmEmailScreen";

import ExploreScreen from "../screens/JobSeeker/ExploreScreen";
import MessageScreen from "../screens/JobSeeker/MessageScreen";
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
import { useAuth } from "../context/AuthContext";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/Auth/ResetPasswordScreen";
import EmployeeDetailApplication from "../screens/JobSeeker/EmployeeDetailApplication";

// ✅ Tạo Stack và Tab
const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExploreStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const MessageStack = createNativeStackNavigator();
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

  </SearchStack.Navigator>
)

const MessageStackScreen = () => (
  <MessageStack.Navigator screenOptions={{ headerShown: false }}>
    <MessageStack.Screen name="MessageMain" component={MessageScreen} />
    <MessageStack.Screen name="Chat" component={ChatScreen} />
  </MessageStack.Navigator>
);

const MenuStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="MenuMain" component={MenuScreen} />
    <MenuStack.Screen name="Setting" component={SettingScreen} />
    <MenuStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <MenuStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
  </MenuStack.Navigator>
);

// ========== Employer Tabs ==========
const EmployerJobStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="EmployerJob" component={EmployerJobScreen} />
    <MenuStack.Screen name="PostJob" component={PostJobScreen} />
    <MenuStack.Screen name="UpdateJob" component={UpdateJobScreen} />
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


// ========== Bottom Tabs ==========
const MainAppEmployee = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: colors.primary.start,
      tabBarInactiveTintColor: colors.text.tertiary,
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
        if (route.name === "MessageStack")
          return <Ionicons name="chatbubble-outline" size={24} color={color} />;
        if (route.name === "MyJobStack")
          return <MaterialIcons name="work-outline" size={24} color={color} />;
        if (route.name === "CVStack")
          return <Ionicons name="document-text-outline" size={24} color={color} />;
        if (route.name === "MenuStack")
          return <Ionicons name="menu-outline" size={24} color={color} />;
      },
    })}
  >
    <Tab.Screen name="ExploreStack" component={ExploreStackScreen} options={{ title: "Khám phá" }} />
    <Tab.Screen name="SearchStack" component={SearchStackScreen} options={{ title: "Tìm kiếm" }} />
    <Tab.Screen name="MyJobStack" component={EmployeeApplicationStackScreen} options={{ title: "Việc của tôi" }} />
    <Tab.Screen name="MessageStack" component={MessageStackScreen} options={{ title: "Tin nhắn" }} />
    <Tab.Screen name="CVStack" component={CVScreen} options={{ title: "Viết CV" }} />
    <Tab.Screen name="MenuStack" component={MenuStackScreen} options={{ title: "Menu" }} />
  </Tab.Navigator>
);

const MainAppEmployer = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: colors.primary.start,
      tabBarInactiveTintColor: colors.text.tertiary,
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
        if (route.name === "MyCandidateStack")
          return <Ionicons name="document-text-outline" size={24} color={color} />;
        if (route.name === "EmployerSetting")
          return <Ionicons name="menu-outline" size={24} color={color} />;
        if (route.name === "MyCompanStack")
          return <Ionicons name="menu-outline" size={24} color={color} />;
      },
    })}
  >
    <Tab.Screen name="EmployerMyJobStack" component={EmployerJobStackScreen} options={{ title: "Công việc" }} />
    <Tab.Screen name="MyCandidateStack" component={EmployerCandidateStackScreen} options={{ title: "Ứng viên" }} />
    <Tab.Screen name="EmployerSetting" component={EmployerSettingScreen} options={{ title: "Cài đặt" }} />
    <Tab.Screen name="MyCompanStack" component={EmployerMyCompanyStackScreen} options={{ title: "Công ty" }} />
  </Tab.Navigator>
);

// ========== Root Stack ==========
const AppNavigator = () => {
  const { user, isAuthenticated, loading } = useAuth();
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
          Đang tải dữ liệu người dùng...
        </Text>
      </View>
    );
  }
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }} edges={["top", "left", "right", "bottom"]}>
          <NavigationContainer>
            <RootStack.Navigator
              screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#000000" } }}
            >
              {/* Auth */}
              {/* Nếu chưa đăng nhập */}
              {!isAuthenticated ? (
                <>
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

export default AppNavigator;
