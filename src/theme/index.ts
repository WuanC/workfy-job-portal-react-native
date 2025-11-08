import { colors, gradients } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

// Export individual modules
export { colors, gradients } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, shadows } from './spacing';

// Export combined theme
export const theme = {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;