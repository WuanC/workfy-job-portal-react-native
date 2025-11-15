import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { colors } from '../theme';

/**
 * Demo screen để test đa ngôn ngữ
 * Có thể thêm vào navigation để test
 */
const LanguageDemoScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('common.appName')}</Text>
        <Text style={styles.headerSubtitle}>{t('settings.language')}</Text>
      </View>

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Demo các translation keys */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('common.welcome')}</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('auth.login')}</Text>
          <Text style={styles.cardText}>{t('auth.email')}: example@email.com</Text>
          <Text style={styles.cardText}>{t('auth.password')}: ********</Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{t('auth.login')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('job.postJob')}</Text>
          <Text style={styles.cardText}>{t('job.jobTitle')}</Text>
          <Text style={styles.cardText}>{t('job.salary')}</Text>
          <Text style={styles.cardText}>{t('job.location')}</Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{t('common.submit')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('profile.myProfile')}</Text>
          <Text style={styles.cardText}>{t('profile.personalInfo')}</Text>
          <Text style={styles.cardText}>{t('profile.workExperience')}</Text>
          <Text style={styles.cardText}>{t('profile.education')}</Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.settings')}</Text>
          <View style={styles.settingItem}>
            <Ionicons name="language" size={20} color={colors.primary.start} />
            <Text style={styles.settingText}>{t('settings.language')}</Text>
          </View>
          <View style={styles.settingItem}>
            <Ionicons name="moon" size={20} color={colors.primary.start} />
            <Text style={styles.settingText}>{t('settings.theme')}</Text>
          </View>
          <View style={styles.settingItem}>
            <Ionicons name="notifications" size={20} color={colors.primary.start} />
            <Text style={styles.settingText}>{t('settings.notifications')}</Text>
          </View>
        </View>

        {/* Validation messages */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('validation.required', { field: 'Email' })}</Text>
          <Text style={styles.errorText}>{t('validation.invalidEmail')}</Text>
          <Text style={styles.errorText}>{t('validation.invalidPhone')}</Text>
          <Text style={styles.errorText}>{t('validation.passwordMismatch')}</Text>
        </View>

        {/* Toast messages */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Messages</Text>
          <Text style={styles.successText}>{t('messages.saveSuccess')}</Text>
          <Text style={styles.errorText}>{t('messages.saveError')}</Text>
          <Text style={styles.successText}>{t('messages.updateSuccess')}</Text>
          <Text style={styles.errorText}>{t('messages.deleteError')}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: colors.primary.start,
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary.start,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 8,
  },
});

export default LanguageDemoScreen;
