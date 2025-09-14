import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import JobSeekerRegisterScreen from './src/screens/Auth/JobSeekerRegisterScreen';
import JobSeekerLoginScreen from './src/screens/Auth/JobSeekerLoginScreen';
import React from 'react';
import AppNavigator from './src/navigations/AppNavigator';

export default function App() {
  return (
    <AppNavigator />
  );
}

