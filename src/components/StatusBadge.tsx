import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, typography } from '../theme';
import { gradients } from '../theme/colors';

interface StatusBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'default',
  style,
}) => {
  const gradientMap = {
    success: gradients.greenMint,
    warning: gradients.warmGlow,
    error: ['#eb3349', '#f45c43'],
    info: gradients.aquaFresh,
    default: ['#e5e7eb', '#d1d5db'],
  };

  const textColorMap = {
    success: '#ffffff',
    warning: '#ffffff',
    error: '#ffffff',
    info: '#ffffff',
    default: '#666666',
  };

  return (
    <LinearGradient
      colors={gradientMap[variant] as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.badge, style]}
    >
      <Text style={[styles.text, { color: textColorMap[variant] }]}>
        {label}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
});