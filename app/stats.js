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
import { getStats, getWeeklyData } from '../utils/storage';
import { SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { formatTime } from '../components/TimerDisplay';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
    const { colors } = useTheme();
    const [stats, setStats] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const s = await getStats();
                setStats(s);
                const w = await getWeeklyData();
                setWeeklyData(w);
            })();
        }, [])
    );

    if (!stats) return null;

    const maxCount = Math.max(...weeklyData.map((d) => d.count), 1);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: colors.text }]}>📊 Stats</Text>

                {/* Summary Cards */}
                <View style={styles.cardsGrid}>
                    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <Text style={styles.statEmoji}>🚽</Text>
                        <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalSessions}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Sessions</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <Text style={styles.statEmoji}>⏱️</Text>
                        <Text style={[styles.statValue, { color: colors.text }]}>{formatTime(stats.avgTime)}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Average</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <Text style={styles.statEmoji}>⚡</Text>
                        <Text style={[styles.statValue, { color: colors.success }]}>{stats.fastestTime > 0 ? formatTime(stats.fastestTime) : '--:--'}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Fastest</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <Text style={styles.statEmoji}>🐌</Text>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{stats.longestTime > 0 ? formatTime(stats.longestTime) : '--:--'}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Longest</Text>
                    </View>
                </View>

                {/* Weekly Chart */}
                <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <Text style={[styles.chartTitle, { color: colors.text }]}>This Week</Text>
                    <View style={styles.chart}>
                        {weeklyData.map((day, idx) => (
                            <View key={idx} style={styles.barWrap}>
                                <View style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${Math.max((day.count / maxCount) * 100, day.count > 0 ? 15 : 5)}%`,
                                                backgroundColor: day.count > 0 ? colors.primary : colors.xpBar,
                                                borderRadius: 6,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.barLabel, { color: colors.textMuted }]}>{day.label}</Text>
                                {day.count > 0 && (
                                    <Text style={[styles.barCount, { color: colors.textSecondary }]}>{day.count}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Sessions */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Sessions</Text>
                {stats.sessions.length === 0 ? (
                    <Text style={[styles.empty, { color: colors.textMuted }]}>No sessions yet. Hit START! 💩</Text>
                ) : (
                    [...stats.sessions].reverse().slice(0, 20).map((session, idx) => (
                        <View key={idx} style={[styles.sessionRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                            <View>
                                <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                                    {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </Text>
                                <Text style={[styles.sessionTime, { color: colors.textMuted }]}>
                                    {new Date(session.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                            <View style={styles.sessionRight}>
                                <Text style={[styles.sessionDuration, { color: colors.text }]}>{formatTime(session.duration)}</Text>
                                <Text style={[styles.sessionPoints, { color: colors.accentWarm }]}>+{session.points}⭐</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: 60, paddingHorizontal: SPACING.lg, paddingBottom: 120 },
    title: { fontSize: 28, fontWeight: '800', letterSpacing: 2, marginBottom: SPACING.lg },
    cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: SPACING.lg },
    statCard: {
        width: (width - SPACING.lg * 2 - 12) / 2,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 1,
    },
    statEmoji: { fontSize: 28, marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: '700', fontVariant: ['tabular-nums'] },
    statLabel: { fontSize: 12, fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
    chartCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, marginBottom: SPACING.lg },
    chartTitle: { fontSize: 18, fontWeight: '700', marginBottom: SPACING.md },
    chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
    barWrap: { alignItems: 'center', flex: 1 },
    barContainer: { width: 24, height: 100, justifyContent: 'flex-end' },
    bar: { width: '100%' },
    barLabel: { fontSize: 11, fontWeight: '600', marginTop: 6 },
    barCount: { fontSize: 10, fontWeight: '700', marginTop: 2 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: SPACING.md },
    empty: { fontSize: 15, textAlign: 'center', marginTop: SPACING.xl },
    sessionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: 8,
        borderWidth: 1,
    },
    sessionDate: { fontSize: 14, fontWeight: '600' },
    sessionTime: { fontSize: 12, marginTop: 2 },
    sessionRight: { alignItems: 'flex-end' },
    sessionDuration: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
    sessionPoints: { fontSize: 12, fontWeight: '600', marginTop: 2 },
});
