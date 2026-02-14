import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withSpring,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const STATES = {
    idle: { emoji: '💩', label: 'Ready to roll!' },
    happy: { emoji: '💩', label: 'Quick & clean!' },
    content: { emoji: '💩', label: 'Taking it easy...' },
    sleepy: { emoji: '😴', label: 'Zzz...' },
    celebration: { emoji: '🎉', label: 'NEW RECORD!' },
};

export default function Avatar({ state = 'idle', size = 80, showLabel = true }) {
    const bounceY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const zzOpacity = useSharedValue(0);

    useEffect(() => {
        switch (state) {
            case 'idle':
                bounceY.value = withRepeat(
                    withSequence(
                        withTiming(-8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                );
                rotation.value = withRepeat(
                    withSequence(
                        withTiming(5, { duration: 2000 }),
                        withTiming(-5, { duration: 2000 })
                    ),
                    -1,
                    true
                );
                scale.value = withTiming(1);
                zzOpacity.value = withTiming(0);
                break;

            case 'happy':
                bounceY.value = withRepeat(
                    withSequence(
                        withTiming(-15, { duration: 300, easing: Easing.out(Easing.ease) }),
                        withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
                    ),
                    -1,
                    true
                );
                rotation.value = withRepeat(
                    withSequence(
                        withTiming(10, { duration: 150 }),
                        withTiming(-10, { duration: 150 })
                    ),
                    6,
                    true
                );
                scale.value = withSpring(1.1);
                zzOpacity.value = withTiming(0);
                break;

            case 'content':
                bounceY.value = withRepeat(
                    withSequence(
                        withTiming(-4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    true
                );
                rotation.value = withTiming(0);
                scale.value = withTiming(1);
                zzOpacity.value = withTiming(0);
                break;

            case 'sleepy':
                bounceY.value = withRepeat(
                    withSequence(
                        withTiming(-2, { duration: 3000 }),
                        withTiming(2, { duration: 3000 })
                    ),
                    -1,
                    true
                );
                rotation.value = withRepeat(
                    withTiming(10, { duration: 3000 }),
                    -1,
                    true
                );
                scale.value = withTiming(0.95);
                zzOpacity.value = withRepeat(
                    withSequence(
                        withTiming(1, { duration: 1500 }),
                        withTiming(0, { duration: 1500 })
                    ),
                    -1,
                    true
                );
                break;

            case 'celebration':
                bounceY.value = withRepeat(
                    withSequence(
                        withTiming(-25, { duration: 200 }),
                        withTiming(0, { duration: 200 })
                    ),
                    6,
                    true
                );
                rotation.value = withRepeat(
                    withSequence(
                        withTiming(15, { duration: 100 }),
                        withTiming(-15, { duration: 100 })
                    ),
                    10,
                    true
                );
                scale.value = withSequence(
                    withSpring(1.3),
                    withDelay(500, withSpring(1.1))
                );
                zzOpacity.value = withTiming(0);
                break;
        }
    }, [state]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: bounceY.value },
            { rotate: `${rotation.value}deg` },
            { scale: scale.value },
        ],
    }));

    const zzStyle = useAnimatedStyle(() => ({
        opacity: zzOpacity.value,
    }));

    const info = STATES[state] || STATES.idle;

    return (
        <View style={styles.container}>
            <View style={styles.avatarWrap}>
                <Animated.View style={[styles.emojiContainer, animatedStyle]}>
                    <Text style={[styles.emoji, { fontSize: size }]}>{info.emoji}</Text>
                </Animated.View>
                {state === 'sleepy' && (
                    <Animated.View style={[styles.zzContainer, zzStyle]}>
                        <Text style={styles.zz}>💤</Text>
                    </Animated.View>
                )}
                {state === 'celebration' && (
                    <View style={styles.sparkles}>
                        <Text style={styles.sparkle}>✨</Text>
                        <Text style={[styles.sparkle, { top: -10, right: -5 }]}>⭐</Text>
                        <Text style={[styles.sparkle, { top: 5, left: -10 }]}>🌟</Text>
                    </View>
                )}
            </View>
            {showLabel && (
                <Text style={styles.label}>{info.label}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarWrap: {
        position: 'relative',
    },
    emojiContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        textAlign: 'center',
    },
    label: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#A0A0B5',
        textAlign: 'center',
    },
    zzContainer: {
        position: 'absolute',
        top: -15,
        right: -20,
    },
    zz: {
        fontSize: 24,
    },
    sparkles: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    sparkle: {
        position: 'absolute',
        fontSize: 20,
        top: -15,
        left: -15,
    },
});
