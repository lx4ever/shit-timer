import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    SESSIONS: '@shit_timer_sessions',
    PROGRESS: '@shit_timer_progress',
    SETTINGS: '@shit_timer_settings',
    BOOKMARKS: '@shit_timer_bookmarks',
};

// ── Sessions ──────────────────────────────────────────

export const saveSession = async (session) => {
    try {
        const existing = await getSessions();
        existing.push(session);
        await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(existing));
        return true;
    } catch (e) {
        console.error('Error saving session:', e);
        return false;
    }
};

export const getSessions = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.SESSIONS);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error getting sessions:', e);
        return [];
    }
};

export const getStats = async () => {
    const sessions = await getSessions();
    if (sessions.length === 0) {
        return {
            totalSessions: 0,
            avgTime: 0,
            fastestTime: 0,
            longestTime: 0,
            totalTime: 0,
            sessions: [],
        };
    }

    const durations = sessions.map((s) => s.duration);
    const totalTime = durations.reduce((a, b) => a + b, 0);

    return {
        totalSessions: sessions.length,
        avgTime: Math.round(totalTime / sessions.length),
        fastestTime: Math.min(...durations),
        longestTime: Math.max(...durations),
        totalTime,
        sessions,
    };
};

// ── User Progress ─────────────────────────────────────

const DEFAULT_PROGRESS = {
    level: 1,
    xp: 0,
    totalXP: 0,
    points: 0,
    streak: 0,
    lastSessionDate: null,
    badges: [],
    triviaCorrect: 0,
    learningViewed: 0,
    sassLevel: 1, // 1-3 for meta humor
};

export const getUserProgress = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.PROGRESS);
        return data ? { ...DEFAULT_PROGRESS, ...JSON.parse(data) } : { ...DEFAULT_PROGRESS };
    } catch (e) {
        console.error('Error getting progress:', e);
        return { ...DEFAULT_PROGRESS };
    }
};

export const saveUserProgress = async (progress) => {
    try {
        await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
        return true;
    } catch (e) {
        console.error('Error saving progress:', e);
        return false;
    }
};

// ── Settings ──────────────────────────────────────────

const DEFAULT_SETTINGS = {
    darkMode: true,
    soundEnabled: false,
    sassLevel: 1,
};

export const getSettings = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.SETTINGS);
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
        console.error('Error getting settings:', e);
        return { ...DEFAULT_SETTINGS };
    }
};

export const saveSettings = async (settings) => {
    try {
        await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('Error saving settings:', e);
        return false;
    }
};

// ── Bookmarks ─────────────────────────────────────────

export const getBookmarks = async () => {
    try {
        const data = await AsyncStorage.getItem(KEYS.BOOKMARKS);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

export const addBookmark = async (item) => {
    try {
        const bookmarks = await getBookmarks();
        bookmarks.push({ ...item, savedAt: new Date().toISOString() });
        await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
        return true;
    } catch (e) {
        return false;
    }
};

// ── Clear All ─────────────────────────────────────────

export const clearAllData = async () => {
    try {
        await AsyncStorage.multiRemove(Object.values(KEYS));
        return true;
    } catch (e) {
        console.error('Error clearing data:', e);
        return false;
    }
};

// ── Weekly Data ───────────────────────────────────────

export const getWeeklyData = async () => {
    const sessions = await getSessions();
    const now = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const daySessions = sessions.filter(
            (s) => s.date && s.date.startsWith(dateStr)
        );
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.push({
            label: dayNames[date.getDay()],
            count: daySessions.length,
            totalTime: daySessions.reduce((a, s) => a + (s.duration || 0), 0),
            date: dateStr,
        });
    }

    return days;
};
