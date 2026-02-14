import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from './_layout';
import { getUserProgress } from '../utils/storage';
import { BADGES } from '../utils/gamification';
import { SPACING, RADIUS, getTitleForLevel, getXPForLevel } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function AchievementsScreen() {
    const { colors } = useTheme();
    const [progress, setProgress] = useState(null);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const p = await getUserProgress();
                setProgress(p);
            })();
        }, [])
    );

    if (!progress) return null;

    const currentTitle = getTitleForLevel(progress.level);
    const xpNeeded = getXPForLevel(progress.level);
    const xpPercent = Math.min((progress.xp / xpNeeded) * 100, 100);
    const unlockedBadges = new Set(progress.badges || []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: colors.text }]}>🏆 Achievements</Text>

                {/* Level Card */}
                <View style={[styles.levelCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <Text style={styles.levelEmoji}>{currentTitle.emoji}</Text>
                    <Text style={[styles.levelTitle, { color: colors.secondary }]}>{currentTitle.title}</Text>
                    <Text style={[styles.levelNum, { color: colors.textSecondary }]}>Level {progress.level}</Text>

                    {/* XP Bar */}
                    <View style={[styles.xpBarBg, { backgroundColor: colors.xpBar }]}>
                        <View style={[styles.xpBarFill, { width: `${xpPercent}%`, backgroundColor: colors.xpFill }]} />
                    </View>
                    <Text style={[styles.xpText, { color: colors.textMuted }]}>
                        {progress.xp} / {xpNeeded} XP
                    </Text>

                    {/* Stats row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statVal, { color: colors.streak }]}>{progress.streak} 🔥</Text>
                            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Streak</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statVal, { color: colors.accentWarm }]}>{progress.points} ⭐</Text>
                            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Points</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statVal, { color: colors.accent }]}>{progress.totalXP}</Text>
                            <Text style={[styles.statLbl, { color: colors.textMuted }]}>Total XP</Text>
                        </View>
                    </View>
                </View>

                {/* Badges Grid */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges</Text>
                <View style={styles.badgesGrid}>
                    {BADGES.map((badge) => {
                        const unlocked = unlockedBadges.has(badge.id);
                        return (
                            <View
                                key={badge.id}
                                style={[
                                    styles.badgeCard,
                                    {
                                        backgroundColor: unlocked ? colors.badge : colors.badgeLocked,
                                        borderColor: unlocked ? colors.accentWarm + '44' : colors.cardBorder,
                                        opacity: unlocked ? 1 : 0.5,
                                    },
                                ]}
                            >
                                <Text style={styles.badgeEmoji}>{unlocked ? badge.emoji : '🔒'}</Text>
                                <Text style={[styles.badgeName, { color: unlocked ? colors.text : colors.textMuted }]} numberOfLines={1}>
                                    {badge.name}
                                </Text>
                                <Text style={[styles.badgeDesc, { color: colors.textMuted }]} numberOfLines={2}>
                                    {badge.desc}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: 60, paddingHorizontal: SPACING.lg, paddingBottom: 120 },
    title: { fontSize: 28, fontWeight: '800', letterSpacing: 2, marginBottom: SPACING.lg },
    levelCard: {
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: SPACING.lg,
    },
    levelEmoji: { fontSize: 48, marginBottom: 8 },
    levelTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
    levelNum: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.md },
    xpBarBg: {
        width: '100%',
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    xpBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    xpText: { fontSize: 12, fontWeight: '600', marginTop: 6 },
    statsRow: {
        flexDirection: 'row',
        marginTop: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statItem: { alignItems: 'center', flex: 1 },
    statVal: { fontSize: 18, fontWeight: '700' },
    statLbl: { fontSize: 11, fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
    statDivider: { width: 1, height: 30 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: SPACING.md },
    badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    badgeCard: {
        width: (width - SPACING.lg * 2 - 24) / 3,
        borderRadius: RADIUS.md,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
    },
    badgeEmoji: { fontSize: 28, marginBottom: 6 },
    badgeName: { fontSize: 11, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
    badgeDesc: { fontSize: 9, textAlign: 'center', lineHeight: 12 },
});
