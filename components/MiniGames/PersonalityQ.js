import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PersonalityQ({ data, colors, onComplete }) {
    const [chosen, setChosen] = useState(null);

    const handleChoose = (choice) => {
        if (chosen) return;
        setChosen(choice);
        if (onComplete) setTimeout(onComplete, 3000);
    };

    return (
        <View style={[styles.card, { backgroundColor: colors?.card || '#252540', borderColor: colors?.cardBorder || '#3A3A55' }]}>
            <Text style={styles.label}>🔮 PERSONALITY</Text>
            <Text style={[styles.question, { color: colors?.text || '#EEEEF5' }]}>{data.question}</Text>
            <View style={styles.options}>
                <TouchableOpacity
                    style={[
                        styles.option,
                        chosen === 'A' && { backgroundColor: '#B388FF22', borderColor: '#B388FF' },
                        { borderColor: colors?.cardBorder || '#3A3A55' },
                    ]}
                    onPress={() => handleChoose('A')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.optionText, { color: chosen === 'A' ? '#B388FF' : (colors?.text || '#EEEEF5') }]}>
                        {data.optionA}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.option,
                        chosen === 'B' && { backgroundColor: '#FF6B8A22', borderColor: '#FF6B8A' },
                        { borderColor: colors?.cardBorder || '#3A3A55' },
                    ]}
                    onPress={() => handleChoose('B')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.optionText, { color: chosen === 'B' ? '#FF6B8A' : (colors?.text || '#EEEEF5') }]}>
                        {data.optionB}
                    </Text>
                </TouchableOpacity>
            </View>
            {chosen && (
                <Text style={[styles.trait, { color: colors?.textSecondary || '#A0A0B5' }]}>
                    You lean: {chosen === 'A' ? data.traitA : data.traitB} {chosen === 'A' ? '🌙' : '☀️'}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 16, padding: 20, borderWidth: 1, minHeight: 160 },
    label: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#FF6B8A', marginBottom: 12, textTransform: 'uppercase' },
    question: { fontSize: 16, fontWeight: '600', lineHeight: 22, marginBottom: 16 },
    options: { gap: 10 },
    option: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1.5 },
    optionText: { fontSize: 15, fontWeight: '500', lineHeight: 20 },
    trait: { marginTop: 12, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
