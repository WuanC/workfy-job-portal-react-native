import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, Alert, View, ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";

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
import JobDetailScreen from "../screens/JobSeeker/JobDetailScreen";
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
import { confirmEmail, confirmEmailEmployer } from "../services/authService";
import CompanyDetailScreen from "../screens/JobSeeker/CompanyDetailScreen";
import { useAuth } from "../context/AuthContext";
import BlogScreen from "../screens/BlogScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import EmployerLoginScreen from "../screens/Auth/EmployerLoginScreen";
import EmployerRegisterScreen from "../screens/Auth/EmployerRegisterScreen";
import MyCompany from "../screens/Employer/MyCompany";
import UpdateCompanyInfo from "../screens/Employer/UpdateCompanyInfo";
import UpdateCompanyMedia from "../screens/Employer/UpdateCompanyMedia";

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
  </ExploreStack.Navigator>
);

const SearchStackScreen = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name="SearchMain" component={SearchScreen} />
    <SearchStack.Screen name="JobDetail" component={JobDetailScreen} />
    <SearchStack.Screen name="JobSubmit" component={JobSubmitScreen} />
    <SearchStack.Screen name="JobSubmitSuccess" component={JobSubmitSucessScreen} />
    <SearchStack.Screen name="SearchFilter" component={FilterScreen} />
  </SearchStack.Navigator>
);

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
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "#555",
      tabBarStyle: {
        height: 60,
        paddingBottom: 5,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
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
    <Tab.Screen name="MyJobStack" component={MyJobScreen} options={{ title: "Việc của tôi" }} />
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
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "#555",
      tabBarStyle: {
        height: 60,
        paddingBottom: 5,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
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
  const { isAuthenticated, loading } = useAuth();
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      console.log("Handling deep link:", event.url);
      const parsed = Linking.parse(event.url);
      const token = parsed.queryParams?.token;

      if (token) {
        try {
          await confirmEmailEmployer(token as string);
          console.log("Deep Link URL");
          navigationRef.current?.navigate("ConfirmEmail");
        } catch (err: any) {
          Alert.alert("Xác nhận thất bại", err.message || "Token không hợp lệ hoặc đã hết hạn.");
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000000ff" }} edges={["top", "left", "right", "bottom"]}>
          <NavigationContainer
            ref={navigationRef}
            linking={{
              prefixes: ["workify://"],
              config: {
                screens: {
                  ConfirmEmail: "verify-email",
                },
              },
            }}
          >
            <RootStack.Navigator
              //key={isAuthenticated ? "user" : "guest"}
              screenOptions={{ headerShown: false }}
            //initialRouteName={isAuthenticated ? "MainApp" : "Login"}
            >
              {/* Auth */}
              <RootStack.Screen name="Login" component={JobSeekerLoginScreen} />

              <RootStack.Screen name="EmployerRegister" component={EmployerRegisterScreen} />

              <RootStack.Screen name="CompanyDetail" component={CompanyDetailScreen} />

              <RootStack.Screen name="Register" component={JobSeekerRegisterScreen} />
              <RootStack.Screen name="EmployerLogin" component={EmployerLoginScreen} />


              <RootStack.Screen name="ArticleDetail" component={ArticleDetailScreen} />


              <RootStack.Screen name="UpdateCompanyInfo" component={UpdateCompanyInfo} />
              <RootStack.Screen name="UpdateCompanyMedia" component={UpdateCompanyMedia} />





              {/* <RootStack.Screen name="Register" component={JobSeekerRegisterScreen} /> */}

              <RootStack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />

              {/* Main */}
              <RootStack.Screen name="MainApp" component={MainAppEmployee} />
              <RootStack.Screen name="MainAppEmployer" component={MainAppEmployer} />
            </RootStack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView >
  );
};

export default AppNavigator;
