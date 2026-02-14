import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
    // Light mode
    light: {
        background: '#FFF5F7',
        card: '#FFFFFF',
        cardBorder: '#F0E0E5',
        primary: '#FF6B8A',
        primaryDark: '#E5527A',
        secondary: '#B388FF',
        accent: '#64FFDA',
        accentWarm: '#FFD54F',
        text: '#2D2D3A',
        textSecondary: '#7A7A8E',
        textMuted: '#B0B0BE',
        success: '#69F0AE',
        warning: '#FFD54F',
        danger: '#FF5252',
        tabBar: '#FFFFFF',
        tabBarBorder: '#F0E0E5',
        tabActive: '#FF6B8A',
        tabInactive: '#B0B0BE',
        overlay: 'rgba(0,0,0,0.3)',
        gradient1: '#FF6B8A',
        gradient2: '#B388FF',
        streak: '#FF9800',
        xpBar: '#E0E0EE',
        xpFill: '#B388FF',
        badge: '#FFF3E0',
        badgeLocked: '#F5F5F5',
    },
    // Dark mode
    dark: {
        background: '#1A1A2E',
        card: '#252540',
        cardBorder: '#3A3A55',
        primary: '#FF6B8A',
        primaryDark: '#E5527A',
        secondary: '#B388FF',
        accent: '#64FFDA',
        accentWarm: '#FFD54F',
        text: '#EEEEF5',
        textSecondary: '#A0A0B5',
        textMuted: '#6A6A80',
        success: '#69F0AE',
        warning: '#FFD54F',
        danger: '#FF5252',
        tabBar: '#252540',
        tabBarBorder: '#3A3A55',
        tabActive: '#FF6B8A',
        tabInactive: '#6A6A80',
        overlay: 'rgba(0,0,0,0.6)',
        gradient1: '#FF6B8A',
        gradient2: '#B388FF',
        streak: '#FF9800',
        xpBar: '#3A3A55',
        xpFill: '#B388FF',
        badge: '#3A3A55',
        badgeLocked: '#2A2A40',
    },
};

export const FONTS = {
    timer: {
        fontFamily: undefined, // Will use system monospace
        fontSize: width > 380 ? 72 : 56,
        fontWeight: '200',
        fontVariant: ['tabular-nums'],
    },
    h1: {
        fontSize: 28,
        fontWeight: '700',
    },
    h2: {
        fontSize: 22,
        fontWeight: '600',
    },
    h3: {
        fontSize: 18,
        fontWeight: '600',
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
    },
    bodyBold: {
        fontSize: 16,
        fontWeight: '600',
    },
    caption: {
        fontSize: 13,
        fontWeight: '400',
    },
    small: {
        fontSize: 11,
        fontWeight: '500',
    },
    button: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1,
    },
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
    round: 999,
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 8,
    },
    glow: (color) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 8,
    }),
};

// Fun titles for leveling system
export const LEVEL_TITLES = [
    { level: 1, title: 'Bathroom Newbie', emoji: '🚽' },
    { level: 2, title: 'Seat Warmer', emoji: '🪑' },
    { level: 3, title: 'Scroll Apprentice', emoji: '📱' },
    { level: 5, title: 'Porcelain Scholar', emoji: '📚' },
    { level: 7, title: 'Throne Sitter', emoji: '👑' },
    { level: 10, title: 'Speed Runner', emoji: '⚡' },
    { level: 13, title: 'Zen Pooper', emoji: '🧘' },
    { level: 15, title: 'Trivia King', emoji: '🧠' },
    { level: 18, title: 'Flush Royale', emoji: '🃏' },
    { level: 20, title: 'Throne Master', emoji: '🏆' },
    { level: 25, title: 'Poop Philosopher', emoji: '🤔' },
    { level: 30, title: 'Lavatory Legend', emoji: '🌟' },
    { level: 35, title: 'Porcelain Titan', emoji: '⚔️' },
    { level: 40, title: 'Toilet Transcendent', emoji: '🌀' },
    { level: 45, title: 'The Anointed One', emoji: '✨' },
    { level: 50, title: 'Eternal Throne God', emoji: '💎' },
];

export const getTitleForLevel = (level) => {
    let current = LEVEL_TITLES[0];
    for (const t of LEVEL_TITLES) {
        if (level >= t.level) current = t;
        else break;
    }
    return current;
};

// XP required per level (increases each level)
export const getXPForLevel = (level) => {
    return Math.floor(50 * Math.pow(1.15, level - 1));
};
