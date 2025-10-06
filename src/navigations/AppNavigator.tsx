import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

// Screens
import JobSeekerLoginScreen from "../screens/Auth/JobSeekerLoginScreen";
import JobSeekerRegisterScreen from "../screens/Auth/JobSeekerRegisterScreen";
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
import MyOrganization from "../screens/Employer/MyOrganization";
import Setting from "../screens/Employer/EmployerSettingScreen";
import EmployerJobScreen from "../screens/Employer/EmployerJobScreen";
import MyCandidate from "../screens/Employer/MyCandidate";
import PostJobScreen from "../screens/Employer/PostJobScreen";
import EmployerSettingScreen from "../screens/Employer/EmployerSettingScreen";
import CandidateFilter from "../screens/Employer/CandidateFilter";

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ExploreStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const MessageStack = createNativeStackNavigator();
const MyJobStack = createNativeStackNavigator();
const CVStack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();

/** Stack riêng cho Explore */
const ExploreStackScreen = () => (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
        <ExploreStack.Screen name="ExploreMain" component={ExploreScreen} />
        <ExploreStack.Screen name="JobDetail" component={JobDetailScreen} />
        <ExploreStack.Screen name="JobSubmit" component={JobSubmitScreen} />
        <ExploreStack.Screen name="JobSubmitSuccess" component={JobSubmitSucessScreen} />
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
/** Stack riêng cho Message */
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

/** Tab Navigator */
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
                <TouchableOpacity
                    {...(props as TouchableOpacityProps)}
                    activeOpacity={1}
                />
            ),
            tabBarIcon: ({ color }) => {
                if (route.name === "ExploreStack") {
                    return <Ionicons name="compass-outline" size={24} color={color} />;
                } else if (route.name === "SearchStack") {
                    return <Ionicons name="search-outline" size={24} color={color} />;
                } else if (route.name === "MessageStack") {
                    return <Ionicons name="chatbubble-outline" size={24} color={color} />;
                } else if (route.name === "MyJobStack") {
                    return <MaterialIcons name="work-outline" size={24} color={color} />;
                } else if (route.name === "CVStack") {
                    return <Ionicons name="document-text-outline" size={24} color={color} />;
                } else if (route.name === "MenuStack") {
                    return <Ionicons name="menu-outline" size={24} color={color} />;
                }
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
                <TouchableOpacity
                    {...(props as TouchableOpacityProps)}
                    activeOpacity={1}
                />
            ),
            tabBarIcon: ({ color }) => {
                if (route.name === "EmployerMyJobStack") {
                    return <MaterialIcons name="work-outline" size={24} color={color} />;
                } else if (route.name === "MyCandidateStack") {
                    return <Ionicons name="document-text-outline" size={24} color={color} />;
                } else if (route.name === "EmployerSetting") {
                    return <Ionicons name="menu-outline" size={24} color={color} />;
                } 
            },
        })}
    >
        <Tab.Screen name="EmployerMyJobStack" component={EmployerJobStackScreen} options={{ title: "Công việc" }} />
        <Tab.Screen name="MyCandidateStack" component={EmployerCandidateStackScreen} options={{ title: "Ứng viên" }} />
        <Tab.Screen name="EmployerSetting" component={EmployerSettingScreen} options={{ title: "Cài đặt" }} />
    
    </Tab.Navigator>
);
/** Root Navigator */
const AppNavigator = () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#000000ff" }} edges={["top", "left", "right", "bottom"]}>
                <NavigationContainer>
                    <RootStack.Navigator screenOptions={{ headerShown: false }}>
                        {/* Auth screens (không có tab) */}
                        <RootStack.Screen name="Login" component={JobSeekerLoginScreen} />
                        <RootStack.Screen name="Register" component={JobSeekerRegisterScreen} />

                        {/* Main app với tab bar */}
                        <RootStack.Screen name="MainApp" component={MainAppEmployee} />
                        <RootStack.Screen name="MainAppEmployer" component={MainAppEmployer} />
                    </RootStack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    </GestureHandlerRootView>
);

export default AppNavigator;
