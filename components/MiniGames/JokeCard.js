import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function JokeCard({ data, colors, onComplete }) {
    const [revealed, setRevealed] = useState(false);

    const handleReveal = () => {
        setRevealed(true);
        if (onComplete) setTimeout(onComplete, 3000);
    };

    return (
        <View style={[styles.card, { backgroundColor: colors?.card || '#252540', borderColor: colors?.cardBorder || '#3A3A55' }]}>
            <Text style={styles.label}>😂 JOKE</Text>
            <Text style={[styles.setup, { color: colors?.text || '#EEEEF5' }]}>{data.setup}</Text>
            {revealed ? (
                <Text style={[styles.punchline, { color: colors?.accentWarm || '#FFD54F' }]}>{data.punchline}</Text>
            ) : (
                <TouchableOpacity
                    style={[styles.revealBtn, { backgroundColor: colors?.primary || '#FF6B8A' }]}
                    onPress={handleReveal}
                    activeOpacity={0.7}
                >
                    <Text style={styles.revealText}>Tap for punchline 👆</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 16, padding: 20, borderWidth: 1, minHeight: 160, justifyContent: 'center' },
    label: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#FF6B8A', marginBottom: 12, textTransform: 'uppercase' },
    setup: { fontSize: 17, fontWeight: '600', lineHeight: 24, marginBottom: 16 },
    punchline: { fontSize: 17, fontWeight: '700', lineHeight: 24, fontStyle: 'italic' },
    revealBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignSelf: 'center' },
    revealText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
