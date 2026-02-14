import { getXPForLevel, getTitleForLevel } from './theme';

// ── Badge Definitions ─────────────────────────────────

export const BADGES = [
    { id: 'first_flush', name: 'First Flush', emoji: '🚽', desc: 'Complete your first session', condition: (stats, progress) => stats.totalSessions >= 1 },
    { id: 'speed_demon', name: 'Speed Demon', emoji: '⚡', desc: 'Finish under 1 minute', condition: (stats) => stats.fastestTime > 0 && stats.fastestTime < 60 },
    { id: 'speed_runner', name: 'Speed Runner', emoji: '🏃', desc: 'Finish under 2 minutes', condition: (stats) => stats.fastestTime > 0 && stats.fastestTime < 120 },
    { id: 'marathon', name: 'Marathon Sitter', emoji: '🪑', desc: 'Sit for over 10 minutes', condition: (stats) => stats.longestTime > 600 },
    { id: 'endurance', name: 'Iron Throne', emoji: '⚔️', desc: 'Sit for over 20 minutes', condition: (stats) => stats.longestTime > 1200 },
    { id: 'regular', name: 'Regular', emoji: '📅', desc: 'Complete 10 sessions', condition: (stats) => stats.totalSessions >= 10 },
    { id: 'dedicated', name: 'Dedicated', emoji: '💪', desc: 'Complete 50 sessions', condition: (stats) => stats.totalSessions >= 50 },
    { id: 'centurion', name: 'Centurion', emoji: '💯', desc: 'Complete 100 sessions', condition: (stats) => stats.totalSessions >= 100 },
    { id: 'streak_3', name: 'Hot Streak', emoji: '🔥', desc: '3-day streak', condition: (stats, progress) => progress.streak >= 3 },
    { id: 'streak_7', name: 'Week Warrior', emoji: '⚔️', desc: '7-day streak', condition: (stats, progress) => progress.streak >= 7 },
    { id: 'streak_30', name: 'Monthly Master', emoji: '🌙', desc: '30-day streak', condition: (stats, progress) => progress.streak >= 30 },
    { id: 'trivia_5', name: 'Trivia Novice', emoji: '🧠', desc: 'Answer 5 trivia correctly', condition: (stats, progress) => (progress.triviaCorrect || 0) >= 5 },
    { id: 'trivia_25', name: 'Trivia King', emoji: '👑', desc: 'Answer 25 trivia correctly', condition: (stats, progress) => (progress.triviaCorrect || 0) >= 25 },
    { id: 'learner', name: 'Curious Mind', emoji: '📖', desc: 'View 20 learning cards', condition: (stats, progress) => (progress.learningViewed || 0) >= 20 },
    { id: 'scholar', name: 'Porcelain Scholar', emoji: '🎓', desc: 'View 100 learning cards', condition: (stats, progress) => (progress.learningViewed || 0) >= 100 },
];

// ── Points Calculation ────────────────────────────────

export const calculateSessionPoints = (durationSec, extras = {}) => {
    let points = 10; // Base points

    // Speed bonus
    if (durationSec < 60) points += 15;
    else if (durationSec < 120) points += 10;
    else if (durationSec < 300) points += 5;

    // Trivia bonus
    if (extras.triviaCorrect) points += extras.triviaCorrect * 5;

    // Consistency bonus
    if (extras.isStreak) points += 5;

    return points;
};

// ── Level Up Logic ────────────────────────────────────

export const processXPGain = (progress, xpGained) => {
    let newProgress = { ...progress };
    newProgress.xp += xpGained;
    newProgress.totalXP += xpGained;

    let leveledUp = false;
    let newLevel = newProgress.level;

    // Process potential multi-level ups
    while (newProgress.xp >= getXPForLevel(newProgress.level)) {
        newProgress.xp -= getXPForLevel(newProgress.level);
        newProgress.level += 1;
        leveledUp = true;
        newLevel = newProgress.level;
    }

    return {
        progress: newProgress,
        leveledUp,
        newLevel,
        title: getTitleForLevel(newLevel),
    };
};

// ── Streak Logic ──────────────────────────────────────

export const updateStreak = (progress) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const lastDate = progress.lastSessionDate;

    if (!lastDate) {
        return { ...progress, streak: 1, lastSessionDate: todayStr };
    }

    if (lastDate === todayStr) {
        // Already recorded today
        return progress;
    }

    const last = new Date(lastDate);
    const diffMs = now.getTime() - last.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return { ...progress, streak: progress.streak + 1, lastSessionDate: todayStr };
    } else if (diffDays > 1) {
        return { ...progress, streak: 1, lastSessionDate: todayStr };
    }

    return { ...progress, lastSessionDate: todayStr };
};

// ── Check New Badges ──────────────────────────────────

export const checkNewBadges = (stats, progress) => {
    const existingBadgeIds = new Set(progress.badges || []);
    const newBadges = [];

    for (const badge of BADGES) {
        if (!existingBadgeIds.has(badge.id) && badge.condition(stats, progress)) {
            newBadges.push(badge);
        }
    }

    return newBadges;
};

// ── Process End of Session ────────────────────────────

export const processSession = (durationSec, stats, progress, extras = {}) => {
    // 1. Calculate points
    const isStreak = progress.lastSessionDate !== new Date().toISOString().split('T')[0];
    const points = calculateSessionPoints(durationSec, { ...extras, isStreak });

    // 2. Update streak
    let updatedProgress = updateStreak(progress);
    updatedProgress.points = (updatedProgress.points || 0) + points;

    // 3. Process XP
    const { progress: xpProgress, leveledUp, newLevel, title } = processXPGain(updatedProgress, points);
    updatedProgress = xpProgress;

    // 4. Update stats for badge checking
    const updatedStats = {
        ...stats,
        totalSessions: stats.totalSessions + 1,
        fastestTime: stats.fastestTime === 0 ? durationSec : Math.min(stats.fastestTime, durationSec),
        longestTime: Math.max(stats.longestTime, durationSec),
    };

    // 5. Check new badges
    const newBadges = checkNewBadges(updatedStats, updatedProgress);
    if (newBadges.length > 0) {
        updatedProgress.badges = [...(updatedProgress.badges || []), ...newBadges.map((b) => b.id)];
    }

    // 6. Check if new record
    const isNewRecord = durationSec < stats.fastestTime || stats.totalSessions === 0;

    return {
        points,
        progress: updatedProgress,
        leveledUp,
        newLevel,
        title,
        newBadges,
        isNewRecord,
        streak: updatedProgress.streak,
    };
};
