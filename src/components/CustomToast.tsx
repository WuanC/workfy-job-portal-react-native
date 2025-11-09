import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

// Custom Toast Config
export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={styles.successContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.successTitle}>{text1}</Text>
        {text2 && <Text style={styles.successMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  
  error: ({ text1, text2 }: any) => (
    <View style={styles.errorContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="close-circle" size={24} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.errorTitle}>{text1}</Text>
        {text2 && <Text style={styles.errorMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  
  warning: ({ text1, text2 }: any) => (
    <View style={styles.warningContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="warning" size={24} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.warningTitle}>{text1}</Text>
        {text2 && <Text style={styles.warningMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  
  info: ({ text1, text2 }: any) => (
    <View style={styles.infoContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="information-circle" size={24} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.infoTitle}>{text1}</Text>
        {text2 && <Text style={styles.infoMessage}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  // Success Toast
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success.start,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    minHeight: 60,
    shadowColor: colors.success.start,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.success.end,
  },
  
  // Error Toast
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error.start,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    minHeight: 60,
    shadowColor: colors.error.start,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.error.end,
  },
  
  // Warning Toast
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning.start,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    minHeight: 60,
    shadowColor: colors.warning.start,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning.end,
  },
  
  // Info Toast
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.start,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    minHeight: 60,
    shadowColor: colors.primary.start,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.end,
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  
  textContainer: {
    flex: 1,
  },
  
  // Success Text Styles
  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  successMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  
  // Error Text Styles
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  errorMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  
  // Warning Text Styles
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  warningMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  
  // Info Text Styles
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  infoMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});

