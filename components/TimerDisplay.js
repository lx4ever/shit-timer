import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function TimerDisplay({ seconds, isRunning, colors }) {
    const pulseOpacity = useSharedValue(1);

    useEffect(() => {
        if (isRunning) {
            pulseOpacity.value = withRepeat(
                withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else {
            pulseOpacity.value = withTiming(1);
        }
    }, [isRunning]);

    const dotStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    const timerColor = !isRunning
        ? (colors?.textMuted || '#6A6A80')
        : seconds < 120
            ? (colors?.success || '#69F0AE')
            : seconds < 300
                ? (colors?.accentWarm || '#FFD54F')
                : (colors?.primary || '#FF6B8A');

    return (
        <View style={styles.container}>
            {isRunning && (
                <Animated.View style={[styles.dot, { backgroundColor: timerColor }, dotStyle]} />
            )}
            <Text style={[styles.timer, { color: timerColor }]}>
                {formatTime(seconds)}
            </Text>
            {isRunning && (
                <Text style={[styles.subtitle, { color: colors?.textMuted || '#6A6A80' }]}>
                    {seconds < 60 ? '⚡ Speed run!' : seconds < 180 ? '👍 Normal pace' : seconds < 300 ? '🧘 Taking your time...' : '🛋️ Making yourself at home?'}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    timer: {
        fontSize: 72,
        fontWeight: '200',
        fontVariant: ['tabular-nums'],
        letterSpacing: 2,
    },
    subtitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});
