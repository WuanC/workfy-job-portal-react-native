import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import JobSeekerRegisterScreen from './src/screens/Auth/JobSeekerRegisterScreen';
import JobSeekerLoginScreen from './src/screens/Auth/JobSeekerLoginScreen';
import React, { useEffect } from 'react';
import AppNavigator from './src/navigations/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import CVScreen from './src/screens/JobSeeker/CVScreen';
import * as Linking from 'expo-linking';



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
}

