// import React, { useRef } from 'react';
// import {
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Animated,
//   ViewStyle,
//   TextStyle,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { borderRadius, shadows, typography } from '../theme';
// import { gradients } from '../theme/colors';

// interface AnimatedButtonProps {
//   title: string;
//   onPress: () => void;
//   variant?: 'primary' | 'secondary' | 'outline';
//   size?: 'small' | 'medium' | 'large';
//   style?: ViewStyle;
//   textStyle?: TextStyle;
//   disabled?: boolean;
// }

// export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
//   title,
//   onPress,
//   variant = 'primary',
//   size = 'medium',
//   style,
//   textStyle,
//   disabled = false,
// }) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   const handlePressIn = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 0.95,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       friction: 4,
//       useNativeDriver: true,
//     }).start();
//   };

//   const sizeStyles = {
//     small: { paddingVertical: 8, paddingHorizontal: 16 },
//     medium: { paddingVertical: 12, paddingHorizontal: 24 },
//     large: { paddingVertical: 16, paddingHorizontal: 32 },
//   };

//   const textSizes = {
//     small: typography.sizes.sm,
//     medium: typography.sizes.md,
//     large: typography.sizes.lg,
//   };

//   if (variant === 'outline') {
//     return (
//       <TouchableOpacity
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         onPress={onPress}
//         disabled={disabled}
//         activeOpacity={0.8}
//       >
//         <Animated.View
//           style={[
//             styles.button,
//             styles.outlineButton,
//             sizeStyles[size],
//             { transform: [{ scale: scaleAnim }] },
//             disabled && styles.disabled,
//             style,
//           ]}
//         >
//           <Text style={[styles.outlineText, { fontSize: textSizes[size] }, textStyle]}>
//             {title}
//           </Text>
//         </Animated.View>
//       </TouchableOpacity>
//     );
//   }

//   const gradientColors = variant === 'primary' ? gradients.purpleDream : gradients.pinkSunset;

//   return (
//     <TouchableOpacity
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//       onPress={onPress}
//       disabled={disabled}
//       activeOpacity={0.8}
//     >
//       <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//         <LinearGradient
//           colors={gradientColors as any}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={[
//             styles.button,
//             sizeStyles[size],
//             disabled && styles.disabled,
//             style,
//           ]}
//         >
//           <Text style={[styles.text, { fontSize: textSizes[size] }, textStyle]}>
//             {title}
//           </Text>
//         </LinearGradient>
//       </Animated.View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     borderRadius: borderRadius.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//     ...shadows.soft,
//   },
//   outlineButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 2,
//     borderColor: '#667eea',
//   },
//   text: {
//     color: '#ffffff',
//     fontWeight: typography.weights.semibold,
//   },
//   outlineText: {
//     color: '#667eea',
//     fontWeight: typography.weights.semibold,
//   },
//   disabled: {
//     opacity: 0.5,
//   },
// });