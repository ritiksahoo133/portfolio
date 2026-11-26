import type { ResolvedTheme } from './theme';

export interface ThemeTokenSet {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentSecondary: string;
  border: string;
  themeColor: string;
  canvas: {
    primaryRgb: string;
    secondaryRgb: string;
    pulseRgb: string;
    nodeAlphaMin: number;
    nodeAlphaRange: number;
    lineMaxAlpha: number;
    pointerLineAlpha: number;
  };
}

export const THEME_TOKENS: Record<ResolvedTheme, ThemeTokenSet> = {
  dark: {
    background: '#080D18',
    backgroundSecondary: '#0D1524',
    surface: '#111B2C',
    surfaceElevated: '#152238',
    cardBackground: 'rgba(17, 27, 44, 0.78)',
    textPrimary: '#F8FAFC',
    textSecondary: '#A6B3C7',
    textMuted: '#718096',
    accentPrimary: '#10B981',
    accentSecondary: '#22D3EE',
    border: '#243247',
    themeColor: '#080D18',
    canvas: {
      primaryRgb: '16, 185, 129',
      secondaryRgb: '34, 211, 238',
      pulseRgb: '167, 243, 208',
      nodeAlphaMin: 0.22,
      nodeAlphaRange: 0.36,
      lineMaxAlpha: 0.13,
      pointerLineAlpha: 0.28,
    },
  },
  light: {
    background: '#F8FAFC',
    backgroundSecondary: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    cardBackground: 'rgba(255, 255, 255, 0.92)',
    textPrimary: '#111827',
    textSecondary: '#475569',
    textMuted: '#64748B',
    accentPrimary: '#059669',
    accentSecondary: '#0891B2',
    border: '#E2E8F0',
    themeColor: '#F8FAFC',
    canvas: {
      primaryRgb: '5, 150, 105',
      secondaryRgb: '8, 145, 178',
      pulseRgb: '16, 185, 129',
      nodeAlphaMin: 0.18,
      nodeAlphaRange: 0.26,
      lineMaxAlpha: 0.12,
      pointerLineAlpha: 0.24,
    },
  },
};
