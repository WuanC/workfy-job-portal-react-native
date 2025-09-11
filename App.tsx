import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import JobSeekerRegisterScreen from './src/screens/JobSeekerRegisterScreen';
import JobSeekerLoginScreen from './src/screens/JobSeekerLoginScreen';

export default function App() {
  return (
    <JobSeekerLoginScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
