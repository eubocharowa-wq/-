import { Platform, type ViewStyle } from 'react-native';

/**
 * Палитра взята из сайта (src/styles.css, :root-переменные).
 * Ориентир: тёмный фон, тёплый текст, акцентный тёмно-зелёный и золотой.
 * Значения адаптированы под React Native (hex/rgba, без CSS-переменных).
 */
export const colors = {
  background: '#05070B',
  surface: '#0D1218',
  surfaceRaised: '#101722',
  card: '#0D1218',

  primary: '#2F5B4B',
  primaryDark: '#20372F',
  primarySoft: '#162821',

  gold: '#D7B15F',
  goldBright: '#ECD08D',
  goldSoft: '#2A2111',

  text: '#F4EFE6',
  textStrong: '#FBF6ED',
  muted: '#C9BDAA',
  mutedStrong: '#9E9384',

  border: '#2C3644',
  borderStrong: '#3A4656',
  borderAccent: 'rgba(215, 177, 95, 0.28)',

  danger: '#C46E6E',
  warning: '#D7B15F',
  success: '#5FA487',

  softGreen: '#16251F',
  softDanger: '#2A1514',
  softWarning: '#2A2313',
  softNeutral: '#101722',
  overlay: 'rgba(255, 255, 255, 0.04)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
} as const;

export const typography = {
  display: 30,
  title: 24,
  subtitle: 18,
  body: 15,
  caption: 13,
  small: 12,
  tiny: 11,
} as const;

/**
 * Тени, близкие к --shadow сайта: 0 18px 60px rgba(0,0,0,0.42).
 * Для карточек используем более деликатный уровень, для hero — полный.
 */
export const elevation: Record<'card' | 'floating' | 'hero', ViewStyle> = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
    },
    android: { elevation: 2 },
    web: {
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
    },
    default: {},
  })!,
  floating: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 24,
    },
    android: { elevation: 5 },
    web: {
      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.35)',
    },
    default: {},
  })!,
  hero: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOpacity: 0.42,
      shadowOffset: { width: 0, height: 18 },
      shadowRadius: 30,
    },
    android: { elevation: 8 },
    web: {
      boxShadow: '0 18px 60px rgba(0, 0, 0, 0.42)',
    },
    default: {},
  })!,
};

/** Предельная ширина рабочего контента (для web/планшетов). */
export const layout = {
  maxContentWidth: 1180,
} as const;
