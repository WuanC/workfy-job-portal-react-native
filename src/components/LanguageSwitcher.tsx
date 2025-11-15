import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { saveLanguage, supportedLanguages, getCurrentLanguage } from '../i18n';
import { colors } from '../theme';

/**
 * Component chuyển đổi ngôn ngữ
 * Sử dụng trong Settings hoặc bất kỳ đâu cần đổi ngôn ngữ
 */
const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  const handleChangeLanguage = async (languageCode: string) => {
    await saveLanguage(languageCode);
    setCurrentLang(languageCode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.language')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {supportedLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              currentLang === language.code && styles.activeLanguageButton,
            ]}
            onPress={() => handleChangeLanguage(language.code)}
          >
            <Text style={styles.flag}>{language.flag}</Text>
            <Text
              style={[
                styles.languageName,
                currentLang === language.code && styles.activeLanguageName,
              ]}
            >
              {language.name}
            </Text>
            {currentLang === language.code && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary.start} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 12,
    backgroundColor: '#ffffff',
  },
  activeLanguageButton: {
    borderColor: colors.primary.start,
    backgroundColor: '#eff6ff',
  },
  flag: {
    fontSize: 24,
    marginRight: 8,
  },
  languageName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginRight: 8,
  },
  activeLanguageName: {
    color: colors.primary.start,
  },
});

export default LanguageSwitcher;
