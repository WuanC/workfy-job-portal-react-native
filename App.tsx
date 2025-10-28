import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import JobSeekerRegisterScreen from './src/screens/Auth/JobSeekerRegisterScreen';
import JobSeekerLoginScreen from './src/screens/Auth/JobSeekerLoginScreen';
import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigations/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import CVScreen from './src/screens/JobSeeker/CVScreen';
import * as Linking from 'expo-linking';
import { authorize } from 'react-native-app-auth';
import * as WebBrowser from "expo-web-browser";
//import * as AuthSession from "expo-auth-session";
//import * as Google from "expo-auth-session/providers/google";
WebBrowser.maybeCompleteAuthSession();
const CLIENT_ID = "950816482683-ahfnuqa0h3o8b5nps7s5eg558pt5639e.apps.googleusercontent.com";
const REDIRECT_URI = Linking.createURL("/oauth2redirect/google");



export default function App() {
  const showSuccess = () => {
    Toast.show({
      type: "success",
      text1: "Đăng nhập thành công!",
      text2: "Chào mừng bạn quay lại 🎉",
    });
  };

  const showError = () => {
    Toast.show({
      type: "error",
      text1: "Lỗi đăng nhập!",
      text2: "Sai email hoặc mật khẩu.",
    });
  };


  return (
    <AuthProvider>
      <AppNavigator />
      <Toast />
    </AuthProvider>
  );
//    const [userInfo, setUserInfo] = useState<any>(null);
// console.log(REDIRECT_URI)
//   const signInWithGoogle = async () => {
//     const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
//       `client_id=${CLIENT_ID}` +
//       `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
//       `&response_type=token` +
//       `&scope=openid%20profile%20email`;
//     console.log(REDIRECT_URI)
//     try {
//       const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

//       if (result.type === "success" && result.url) {
//         const url = new URL(result.url);
//         const accessToken = url.hash
//           .substring(1)
//           .split("&")
//           .find(param => param.startsWith("access_token="))
//           ?.split("=")[1];

//         setUserInfo({ accessToken });
//         console.log("✅ Access Token:", accessToken);
//       }
//     } catch (error) {
//       console.error("❌ Login error:", error);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Button title="Sign in with Google" onPress={signInWithGoogle} />
//       {userInfo && <Text>Access Token: {userInfo.accessToken}</Text>}
//     </View>
//   );
}

