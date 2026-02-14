import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TriviaQuiz({ data, colors, onCorrect, onComplete }) {
    const [selected, setSelected] = useState(null);
    const isAnswered = selected !== null;
    const isCorrect = selected === data.answer;

    const handleSelect = (idx) => {
        if (isAnswered) return;
        setSelected(idx);
        if (idx === data.answer && onCorrect) onCorrect();
        if (onComplete) setTimeout(onComplete, 3000);
    };

    return (
        <View style={[styles.card, { backgroundColor: colors?.card || '#252540', borderColor: colors?.cardBorder || '#3A3A55' }]}>
            <Text style={styles.label}>🧠 TRIVIA</Text>
            <Text style={[styles.question, { color: colors?.text || '#EEEEF5' }]}>{data.question}</Text>
            <View style={styles.options}>
                {data.options.map((opt, idx) => {
                    let optStyle = [styles.option, { borderColor: colors?.cardBorder || '#3A3A55' }];
                    let textColor = colors?.text || '#EEEEF5';
                    if (isAnswered) {
                        if (idx === data.answer) {
                            optStyle.push({ backgroundColor: '#69F0AE22', borderColor: '#69F0AE' });
                            textColor = '#69F0AE';
                        } else if (idx === selected) {
                            optStyle.push({ backgroundColor: '#FF525222', borderColor: '#FF5252' });
                            textColor = '#FF5252';
                        }
                    }
                    return (
                        <TouchableOpacity
                            key={idx}
                            style={optStyle}
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
                <Text style={[styles.result, { color: isCorrect ? '#69F0AE' : '#FF5252' }]}>
                    {isCorrect ? '✅ Correct! +5 pts' : `❌ The answer was: ${data.options[data.answer]}`}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 16, padding: 20, borderWidth: 1, minHeight: 160 },
    label: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#B388FF', marginBottom: 12, textTransform: 'uppercase' },
    question: { fontSize: 16, fontWeight: '600', lineHeight: 22, marginBottom: 16 },
    options: { gap: 8 },
    option: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1.5 },
    optionText: { fontSize: 15, fontWeight: '500' },
    result: { marginTop: 12, fontSize: 14, fontWeight: '700', textAlign: 'center' },
});
