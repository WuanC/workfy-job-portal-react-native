import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { saveLanguage, supportedLanguages, getCurrentLanguage } from '../i18n';
import { colors } from '../theme';

interface LanguagePickerProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Modal picker để chọn ngôn ngữ
 * Sử dụng khi muốn hiện modal thay vì inline component
 */
const LanguagePicker: React.FC<LanguagePickerProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();

  const handleSelectLanguage = async (languageCode: string) => {
    await saveLanguage(languageCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.language')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={supportedLanguages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.languageItem,
                  currentLang === item.code && styles.activeLanguageItem,
                ]}
                onPress={() => handleSelectLanguage(item.code)}
              >
                <Text style={styles.languageFlag}>{item.flag}</Text>
                <Text
                  style={[
                    styles.languageName,
                    currentLang === item.code && styles.activeLanguageName,
                  ]}
                >
                  {item.name}
                </Text>
                {currentLang === item.code && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary.start}
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activeLanguageItem: {
    backgroundColor: '#eff6ff',
  },
  languageFlag: {
    fontSize: 28,
    marginRight: 12,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  activeLanguageName: {
    fontWeight: '600',
    color: colors.primary.start,
  },
});

export default LanguagePicker;
