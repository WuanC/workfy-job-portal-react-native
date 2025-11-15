import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en.json';
import vi from './locales/vi.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

// Ngôn ngữ hệ thống
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    const languageCode = locales[0].languageCode;
    // Nếu là tiếng Việt, trả về 'vi', còn lại mặc định 'en'
    return languageCode === 'vi' ? 'vi' : 'en';
  }
  return 'vi'; // Mặc định tiếng Việt
};

// Lấy ngôn ngữ đã lưu hoặc ngôn ngữ hệ thống
const getStoredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage || getDeviceLanguage();
  } catch (error) {
    console.error('Error getting stored language:', error);
    return getDeviceLanguage();
  }
};

// Resources
const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

// Khởi tạo i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Ngôn ngữ mặc định ban đầu
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Load ngôn ngữ đã lưu khi app khởi động
getStoredLanguage().then((language) => {
  i18n.changeLanguage(language);
});

// Lưu ngôn ngữ vào AsyncStorage
export const saveLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Lấy ngôn ngữ hiện tại
export const getCurrentLanguage = () => {
  return i18n.language;
};

// Các ngôn ngữ hỗ trợ
export const supportedLanguages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default i18n;
