import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Screens
import JobSeekerLoginScreen from "../screens/Auth/JobSeekerLoginScreen";
import JobSeekerRegisterScreen from "../screens/Auth/JobSeekerRegisterScreen";
import ExploreScreen from "../screens/ExploreScreen";
import MessageScreen from "../screens/MessageScreen";
import SearchScreen from "../screens/SearchScreen";
import MyJobScreen from "../screens/MyJobScreen";
import CVScreen from "../screens/CVScreen";
import MenuScreen from "../screens/MenuScreen";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import JobDetailScreen from "../screens/JobSeeker/JobDetailScreen";
import JobSubmitScreen from "../screens/JobSeeker/JobSubmitScreen";
import JobSubmitSucessScreen from "../screens/JobSeeker/JobSubmitSucessScreen";
import FilterScreen from "../screens/FilterScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
    return (
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
                            {...(props as TouchableOpacityProps)} // ép kiểu cho an toàn
                            activeOpacity={1} // tắt hiệu ứng mờ
                        />
                    ),

                    tabBarIcon: ({ color }) => {
                        if (route.name === "Explore") {
                            return <Ionicons name="compass-outline" size={24} color={color} />;
                        } else if (route.name === "Search") {
                            return <Ionicons name="search-outline" size={24} color={color} />;
                        } else if (route.name === "Message") {
                            return <Ionicons name="chatbubble-outline" size={24} color={color} />;
                        } else if (route.name === "MyJob") {
                            return <MaterialIcons name="work-outline" size={24} color={color} />;
                        } else if (route.name === "CV") {
                            return <Ionicons name="document-text-outline" size={24} color={color} />;
                        } else if (route.name === "Menu") {
                            return <Ionicons name="menu-outline" size={24} color={color} />;
                        }
                    },
                })}
            >
                <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: "Khám phá" }} />
                <Tab.Screen name="Search" component={SearchScreen} options={{ title: "Tìm kiếm" }} />
                <Tab.Screen name="MyJob" component={MyJobScreen} options={{ title: "Việc của tôi" }} />
                <Tab.Screen name="Message" component={MessageScreen} options={{ title: "Tin nhắn" }} />
                <Tab.Screen name="CV" component={CVScreen} options={{ title: "Viết CV" }} />
                <Tab.Screen name="Menu" component={MenuScreen} options={{ title: "Menu" }} />
            </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <SafeAreaView
                    style={{ flex: 1, backgroundColor: "#000000ff" }}
                    edges={["top", "left", "right", "bottom"]}
                >
                    <NavigationContainer>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="Login" component={JobSeekerLoginScreen} />
                            <Stack.Screen name="MainApp" component={MainApp} />
                            <Stack.Screen name="JobSeekerLogin" component={JobSeekerLoginScreen} />
                            <Stack.Screen name="JobSeekerRegister" component={JobSeekerRegisterScreen} />
                            <Stack.Screen name="JobDetail" component={JobDetailScreen} />
                            <Stack.Screen name="JobSubmit" component={JobSubmitScreen} />
                            <Stack.Screen name="JobSubmitSuccess" component={JobSubmitSucessScreen}/>
                            <Stack.Screen name="SearchFilter" component={FilterScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </SafeAreaView>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default AppNavigator;
