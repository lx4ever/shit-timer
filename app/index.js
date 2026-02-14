import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from './_layout';
import Avatar from '../components/Avatar';
import TimerDisplay from '../components/TimerDisplay';
import JokeCard from '../components/MiniGames/JokeCard';
import FactCard from '../components/MiniGames/FactCard';
import TriviaQuiz from '../components/MiniGames/TriviaQuiz';
import PersonalityQ from '../components/MiniGames/PersonalityQ';
import DetectivePuzzle from '../components/MiniGames/DetectivePuzzle';
import LearningCard from '../components/MiniGames/LearningCard';
import MetaHumor from '../components/MiniGames/MetaHumor';
import { getNextEntertainment, resetUsedContent } from '../utils/entertainment';
import { saveSession, getStats, getUserProgress, saveUserProgress, getSettings, addBookmark } from '../utils/storage';
import { processSession } from '../utils/gamification';
import { SPACING, RADIUS, SHADOWS } from '../utils/theme';

const { width, height } = Dimensions.get('window');
const startBtnSize = Math.min(width * 0.5, height * 0.25);

export default function TimerScreen() {
    const { colors } = useTheme();
    const [timerState, setTimerState] = useState('idle'); // idle, running, finished
    const [seconds, setSeconds] = useState(0);
    const [entertainment, setEntertainment] = useState(null);
    const [avatarState, setAvatarState] = useState('idle');
    const [sessionResult, setSessionResult] = useState(null);
    const [triviaCorrectCount, setTriviaCorrectCount] = useState(0);
    const [sassLevel, setSassLevel] = useState(1);
    const intervalRef = useRef(null);
    const entertainmentIntervalRef = useRef(null);
    const inactivityRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const settings = await getSettings();
                setSassLevel(settings.sassLevel || 1);
            })();
        }, [])
    );

    useEffect(() => {
        if (timerState === 'running') {
            intervalRef.current = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [timerState]);

    useEffect(() => {
        if (timerState !== 'running') return;
        if (seconds < 120) setAvatarState('happy');
        else if (seconds < 300) setAvatarState('content');
        else setAvatarState('sleepy');
    }, [seconds, timerState]);

    useEffect(() => {
        if (timerState === 'running' && !entertainment) {
            setEntertainment(getNextEntertainment(seconds, sassLevel));
        }
        if (timerState !== 'running') {
            clearInterval(entertainmentIntervalRef.current);
            clearTimeout(inactivityRef.current);
        }
        return () => {
            clearInterval(entertainmentIntervalRef.current);
            clearTimeout(inactivityRef.current);
        };
    }, [timerState]);

    useEffect(() => {
        clearInterval(entertainmentIntervalRef.current);
        clearTimeout(inactivityRef.current);
        if (timerState === 'running' && entertainment) {
            if (entertainment.type === 'meta') {
                entertainmentIntervalRef.current = setInterval(() => {
                    setEntertainment({ type: 'meta', data: require('../utils/entertainment').getMetaHumor(seconds, sassLevel) });
                }, 8000);
            } else if (entertainment.type === 'fact') {
                inactivityRef.current = setTimeout(() => {
                    setEntertainment(getNextEntertainment(seconds, sassLevel));
                }, 15000);
            } else {
                inactivityRef.current = setTimeout(() => {
                    setEntertainment(getNextEntertainment(seconds, sassLevel));
                }, 30000);
            }
        }
        return () => {
            clearInterval(entertainmentIntervalRef.current);
            clearTimeout(inactivityRef.current);
        };
    }, [entertainment, timerState]);

    const handleStart = () => {
        setSeconds(0);
        setTimerState('running');
        setSessionResult(null);
        setTriviaCorrectCount(0);
        setAvatarState('happy');
        resetUsedContent();
    };

    const handleFinish = async () => {
        setTimerState('finished');
        clearInterval(intervalRef.current);
        clearInterval(entertainmentIntervalRef.current);

        const duration = seconds;
        const stats = await getStats();
        const progress = await getUserProgress();

        const result = processSession(duration, stats, progress, {
            triviaCorrect: triviaCorrectCount,
        });

        result.progress.triviaCorrect = (result.progress.triviaCorrect || 0) + triviaCorrectCount;

        await saveSession({
            duration,
            date: new Date().toISOString(),
            points: result.points,
        });

        await saveUserProgress(result.progress);

        if (result.isNewRecord && stats.totalSessions > 0) {
            setAvatarState('celebration');
        } else if (duration < 120) {
            setAvatarState('happy');
        } else {
            setAvatarState('content');
        }

        setSessionResult(result);
    };

    const handleReset = () => {
        setTimerState('idle');
        setSeconds(0);
        setEntertainment(null);
        setAvatarState('idle');
        setSessionResult(null);
    };

    const handleTriviaCorrect = () => {
        setTriviaCorrectCount((c) => c + 1);
    };

    const handleBookmark = async (item) => {
        await addBookmark({ type: 'learning', ...item });
    };

    const advanceEntertainment = useCallback(() => {
        if (timerState === 'running') {
            setEntertainment(getNextEntertainment(seconds, sassLevel));
        }
    }, [timerState, seconds, sassLevel]);

    const contentKey = entertainment ? `${entertainment.type}-${JSON.stringify(entertainment.data).slice(0, 40)}` : '';

    const renderEntertainment = () => {
        if (!entertainment) return null;
        switch (entertainment.type) {
            case 'joke':
                return <JokeCard key={contentKey} data={entertainment.data} colors={colors} onComplete={advanceEntertainment} />;
            case 'fact':
                return <FactCard key={contentKey} data={entertainment.data} colors={colors} />;
            case 'trivia':
                return <TriviaQuiz key={contentKey} data={entertainment.data} colors={colors} onCorrect={handleTriviaCorrect} onComplete={advanceEntertainment} />;
            case 'personality':
                return <PersonalityQ key={contentKey} data={entertainment.data} colors={colors} onComplete={advanceEntertainment} />;
            case 'detective':
                return <DetectivePuzzle key={contentKey} data={entertainment.data} colors={colors} onComplete={advanceEntertainment} />;
            case 'learning':
                return <LearningCard key={contentKey} data={entertainment.data} colors={colors} onBookmark={handleBookmark} />;
            case 'meta':
                return <MetaHumor key={contentKey} data={entertainment.data} colors={colors} elapsed={seconds} />;
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    timerState === 'idle' && styles.idleContent,
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {timerState === 'idle' ? 'SHIT TIMER' : timerState === 'running' ? 'IN SESSION' : 'COMPLETE'}
                    </Text>
                    <View style={[styles.titleUnderline, { backgroundColor: colors.primary }]} />
                </View>

                {/* Status Indicator (Avatar + Timer) */}
                <View style={styles.statusSection}>
                    <Avatar state={avatarState} size={timerState === 'running' ? 70 : 100} showLabel={timerState !== 'finished'} />
                    <TimerDisplay seconds={seconds} isRunning={timerState === 'running'} colors={colors} />
                </View>

                {/* Main Action Buttons */}
                {timerState === 'idle' && (
                    <TouchableOpacity
                        style={[styles.startBtn, { backgroundColor: colors.primary }, SHADOWS.glow(colors.primary)]}
                        onPress={handleStart}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.startBtnText}>START</Text>
                        <Text style={styles.startBtnEmoji}>💩</Text>
                    </TouchableOpacity>
                )}

                {timerState === 'running' && (
                    <TouchableOpacity
                        style={[styles.finishBtn, { backgroundColor: colors.success }, SHADOWS.glow(colors.success)]}
                        onPress={handleFinish}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.finishBtnText}>FINISH SESSION ✅</Text>
                    </TouchableOpacity>
                )}

                {/* Entertainment Module */}
                {timerState === 'running' && entertainment && (
                    <View style={styles.entertainmentWrap}>
                        <View style={styles.contentHeader}>
                            <Text style={[styles.contentLabel, { color: colors.textMuted }]}>WHILE YOU WAIT...</Text>
                            <TouchableOpacity
                                style={styles.skipBtn}
                                onPress={() => setEntertainment(getNextEntertainment(seconds, sassLevel))}
                            >
                                <Text style={[styles.skipText, { color: colors.primary }]}>Next ➔</Text>
                            </TouchableOpacity>
                        </View>
                        {renderEntertainment()}
                    </View>
                )}

                {/* Session Results */}
                {timerState === 'finished' && sessionResult && (
                    <View style={[styles.resultsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.resultTitle, { color: colors.text }]}>Good job, soldier. 🫡</Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.resultRow}>
                                <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Time Elapsed</Text>
                                <Text style={[styles.resultValue, { color: colors.text }]}>
                                    {Math.floor(seconds / 60)}m {seconds % 60}s
                                </Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Points Gained</Text>
                                <Text style={[styles.resultValue, { color: colors.accentWarm }]}>+{sessionResult.points} XP</Text>
                            </View>

                            <View style={[styles.resultRow, { borderBottomWidth: 0 }]}>
                                <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Daily Streak</Text>
                                <Text style={[styles.resultValue, { color: colors.streak }]}>{sessionResult.streak} days 🔥</Text>
                            </View>
                        </View>

                        {sessionResult.leveledUp && (
                            <View style={[styles.banner, { backgroundColor: colors.secondary + '20' }]}>
                                <Text style={[styles.bannerText, { color: colors.secondary }]}>
                                    🎊 LEVEL UP: {sessionResult.newLevel} — {sessionResult.title.title} {sessionResult.title.emoji}
                                </Text>
                            </View>
                        )}

                        {sessionResult.isNewRecord && (
                            <View style={[styles.banner, { backgroundColor: colors.success + '20' }]}>
                                <Text style={[styles.bannerText, { color: colors.success }]}>
                                    🏆 NEW PB: Light Speed Poop!
                                </Text>
                            </View>
                        )}

                        {sessionResult.newBadges.length > 0 && (
                            <View style={styles.newBadges}>
                                <Text style={[styles.newBadgesTitle, { color: colors.textSecondary }]}>NEW BADGES</Text>
                                {sessionResult.newBadges.map((b) => (
                                    <View key={b.id} style={[styles.badgeItem, { backgroundColor: colors.background }]}>
                                        <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                                        <View>
                                            <Text style={[styles.badgeName, { color: colors.text }]}>{b.name}</Text>
                                            <Text style={[styles.badgeDesc, { color: colors.textMuted }]}>{b.desc}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.resetBtn, { backgroundColor: colors.primary }]}
                            onPress={handleReset}
                        >
                            <Text style={styles.resetBtnText}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: SPACING.xl,
        paddingBottom: 60,
        alignItems: 'center',
    },
    idleContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 4,
        opacity: 0.8,
    },
    titleUnderline: {
        height: 3,
        width: 30,
        borderRadius: 2,
        marginTop: 4,
    },
    statusSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
        gap: SPACING.md,
    },
    startBtn: {
        width: startBtnSize,
        height: startBtnSize,
        borderRadius: startBtnSize / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.xl,
    },
    startBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
    },
    startBtnEmoji: {
        fontSize: 32,
        marginTop: 4,
    },
    finishBtn: {
        width: '100%',
        height: 64,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    finishBtnText: {
        color: '#1A1A2E',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    entertainmentWrap: {
        width: '100%',
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        paddingHorizontal: 4,
    },
    contentLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    skipBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    skipText: {
        fontSize: 13,
        fontWeight: '700',
    },
    resultsCard: {
        width: '100%',
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        borderWidth: 1,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    statsContainer: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    resultLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    resultValue: {
        fontSize: 16,
        fontWeight: '800',
    },
    banner: {
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
    },
    bannerText: {
        fontSize: 14,
        fontWeight: '800',
        textAlign: 'center',
    },
    newBadges: {
        marginTop: SPACING.md,
    },
    newBadgesTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    badgeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
    },
    badgeEmoji: {
        fontSize: 24,
        marginRight: SPACING.md,
    },
    badgeName: {
        fontSize: 14,
        fontWeight: '700',
    },
    badgeDesc: {
        fontSize: 12,
    },
    resetBtn: {
        marginTop: SPACING.xl,
        paddingVertical: 18,
        borderRadius: RADIUS.lg,
        width: '100%',
        alignItems: 'center',
    },
    resetBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});