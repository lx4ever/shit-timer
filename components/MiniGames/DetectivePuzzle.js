import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DetectivePuzzle({ data, colors, onComplete }) {
    const [selected, setSelected] = useState(null);
    const isAnswered = selected !== null;
    const isCorrect = selected === data.answer;

    const handleSelect = (idx) => {
        if (isAnswered) return;
        setSelected(idx);
        if (onComplete) setTimeout(onComplete, 4000);
    };

    return (
        <View style={[styles.card, { backgroundColor: colors?.card || '#252540', borderColor: colors?.cardBorder || '#3A3A55' }]}>
            <Text style={styles.label}>🕵️ DETECTIVE</Text>
            <Text style={[styles.title, { color: colors?.accentWarm || '#FFD54F' }]}>{data.title}</Text>
            <Text style={[styles.story, { color: colors?.text || '#EEEEF5' }]}>{data.story}</Text>
            <Text style={[styles.question, { color: colors?.text || '#EEEEF5' }]}>{data.question}</Text>
            <View style={styles.options}>
                {data.options.map((opt, idx) => {
                    let optBg = 'transparent';
                    let optBorder = colors?.cardBorder || '#3A3A55';
                    let textColor = colors?.text || '#EEEEF5';
                    if (isAnswered) {
                        if (idx === data.answer) { optBg = '#69F0AE22'; optBorder = '#69F0AE'; textColor = '#69F0AE'; }
                        else if (idx === selected) { optBg = '#FF525222'; optBorder = '#FF5252'; textColor = '#FF5252'; }
                    }
                    return (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.option, { backgroundColor: optBg, borderColor: optBorder }]}
                            onPress={() => handleSelect(idx)}
                            activeOpacity={0.7}
                            disabled={isAnswered}
                        >
                            <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {isAnswered && (
                <Text style={[styles.explanation, { color: colors?.textSecondary || '#A0A0B5' }]}>
                    {isCorrect ? '🎯 ' : '💡 '}{data.explanation}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 16, padding: 20, borderWidth: 1 },
    label: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#FFD54F', marginBottom: 8, textTransform: 'uppercase' },
    title: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
    story: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
    question: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
    options: { gap: 8 },
    option: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1.5 },
    optionText: { fontSize: 14, fontWeight: '500' },
    explanation: { marginTop: 12, fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
});
