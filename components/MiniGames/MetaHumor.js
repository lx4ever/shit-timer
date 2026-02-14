import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MetaHumor({ data, colors, elapsed }) {
    return (
        <View style={[styles.card, { backgroundColor: colors?.card || '#252540', borderColor: colors?.cardBorder || '#3A3A55' }]}>
            <Text style={styles.label}>🎭 META</Text>
            <Text style={styles.emoji}>{data.emoji}</Text>
            <Text style={[styles.text, { color: colors?.text || '#EEEEF5' }]}>{data.text}</Text>
            {elapsed !== undefined && (
                <Text style={[styles.time, { color: colors?.textMuted || '#6A6A80' }]}>
                    ⏱️ {Math.floor(elapsed / 60)}m {elapsed % 60}s on the throne
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 16, padding: 20, borderWidth: 1, minHeight: 140, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#FF6B8A', marginBottom: 12, textTransform: 'uppercase', alignSelf: 'flex-start' },
    emoji: { fontSize: 40, marginBottom: 10 },
    text: { fontSize: 17, fontWeight: '600', lineHeight: 24, textAlign: 'center' },
    time: { marginTop: 12, fontSize: 12, fontWeight: '500' },
});
