import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, shadows } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'light' | 'medium' | 'strong';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style,
  intensity = 'medium' 
}) => {
  const opacityMap = {
    light: 0.7,
    medium: 0.85,
    strong: 0.95,
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.glass, { opacity: opacityMap[intensity] }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.soft,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});