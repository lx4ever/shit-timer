import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FactCard({ data, colors }) {
    return (
        <View style={[styles.card, { backgroundColor: colors?.card || '#252540', borderColor: colors?.cardBorder || '#3A3A55' }]}>
            <Text style={styles.label}>🤯 DID YOU KNOW?</Text>
            <Text style={styles.emoji}>{data.emoji}</Text>
            <Text style={[styles.fact, { color: colors?.text || '#EEEEF5' }]}>{data.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 16, padding: 20, borderWidth: 1, minHeight: 160, alignItems: 'center', justifyContent: 'center' },
    label: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#64FFDA', marginBottom: 12, textTransform: 'uppercase', alignSelf: 'flex-start' },
    emoji: { fontSize: 40, marginBottom: 12 },
    fact: { fontSize: 16, fontWeight: '500', lineHeight: 24, textAlign: 'center' },
});
