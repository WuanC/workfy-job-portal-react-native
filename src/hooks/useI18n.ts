import { useTranslation } from 'react-i18next';
import { saveLanguage, getCurrentLanguage } from '../i18n';

/**
 * Custom hook để sử dụng i18n dễ dàng hơn
 * Bao gồm các utilities thường dùng
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  /**
   * Đổi ngôn ngữ
   */
  const changeLanguage = async (languageCode: string) => {
    await saveLanguage(languageCode);
  };

  /**
   * Lấy ngôn ngữ hiện tại
   */
  const currentLanguage = getCurrentLanguage();

  /**
   * Kiểm tra có phải tiếng Việt không
   */
  const isVietnamese = currentLanguage === 'vi';

  /**
   * Kiểm tra có phải tiếng Anh không
   */
  const isEnglish = currentLanguage === 'en';

  /**
   * Format date theo ngôn ngữ hiện tại
   */
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isVietnamese) {
      return dateObj.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Format number theo ngôn ngữ hiện tại
   */
  const formatNumber = (num: number) => {
    if (isVietnamese) {
      return num.toLocaleString('vi-VN');
    }
    return num.toLocaleString('en-US');
  };

  /**
   * Format currency theo ngôn ngữ hiện tại
   */
  const formatCurrency = (amount: number, currency: string = 'VND') => {
    if (isVietnamese) {
      if (currency === 'VND') {
        return `${formatNumber(amount)} đ`;
      }
      return `${formatNumber(amount)} ${currency}`;
    }
    
    if (currency === 'VND') {
      return `${formatNumber(amount)} VND`;
    }
    return `${currency} ${formatNumber(amount)}`;
  };

  /**
   * Get pluralized text (đơn giản)
   */
  const plural = (count: number, singular: string, plural: string) => {
    return count === 1 ? singular : plural;
  };

  /**
   * Translate với fallback
   */
  const translate = (key: string, fallback?: string) => {
    const translated = t(key);
    if (translated === key && fallback) {
      return fallback;
    }
    return translated;
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage,
    isVietnamese,
    isEnglish,
    formatDate,
    formatNumber,
    formatCurrency,
    plural,
    translate,
  };
};

export default useI18n;
