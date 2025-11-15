import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ToastService } from "../../services/toastService";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LOGO_IMG } from "../../utilities/constant";
import { useI18n } from "../../hooks/useI18n";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { loginEmployer } from "../../services/authService";

type MainNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login" |
  "Register" | "ForgotPassword"
>;

const JobSeekerLoginScreen = () => {
  const { t } = useI18n();
  const { loginEmployeeAuth } = useAuth();
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<MainNavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      ToastService.warning(t('auth.missingInfo'), t('auth.enterEmailPassword'));
      return;
    }

    try {
      setLoading(true);
      await loginEmployeeAuth(email, password);
      // await loginEmployee(email, password);
      console.log("Login successful");
      ToastService.success(t('auth.loginSuccess'), t('auth.welcomeBack'));
      navigation.replace("MainApp");
    } catch (error: any) {
      ToastService.error(t('auth.loginFailed'), error.message || t('auth.invalidCredentials'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={LOGO_IMG} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>{t('auth.login')}</Text>

      {/* Email input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={22} color="#888" style={styles.icon} />
        <TextInput
          placeholder={t('auth.enterEmail')}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
        <TextInput
          placeholder={t('auth.enterPassword')}
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <MaterialIcons name="visibility" size={22} color="#888" style={styles.iconRight} />
      </View>

      {/* Remember & Forgot */}
      <View style={styles.row}>
        <View style={styles.rememberContainer}>
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#2563EB" : undefined}
            style={styles.checkbox}
          />
          <Text style={styles.remember}>{t('auth.rememberMe')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword", { isEmployee: true })}>
          <Text style={styles.forgot}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>
      </View>

      {/* Sign in button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? t('auth.loggingIn') : t('auth.login')}
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>{t('auth.or')}</Text>
        <View style={styles.line} />
      </View>

      {/* Social Login */}
      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-google" size={24} color="#DB4437" />
        <Text style={styles.socialText}>{t('auth.loginWithGoogle')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
        <Text style={styles.socialText}>{t('auth.loginWithLinkedIn')}</Text>
      </TouchableOpacity>

      {/* 🆕 Signup and Employer login */}
      <View style={styles.bottomLinks}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>
            {t('auth.noAccount')} <Text style={styles.linkHighlight}>{t('auth.registerNow')}</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("EmployerLogin")}>
          <Text style={styles.linkText}>
            {t('auth.areEmployer')} <Text style={styles.linkHighlight}>{t('auth.loginHere')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: "100%",
    backgroundColor: "#fff",
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: "auto",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 6,
  },
  remember: {
    color: "#555",
  },
  forgot: {
    color: "#007bff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#CBD5E1",
  },
  or: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#475569",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 48,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  socialText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
    color: "#1E293B",
  },
  bottomLinks: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#475569",
    fontSize: 14,
    marginVertical: 4,
  },
  linkHighlight: {
    color: "#2563EB",
    fontWeight: "600",
  },
});

export default JobSeekerLoginScreen;
