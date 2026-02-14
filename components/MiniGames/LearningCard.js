import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LearningCard({ data, colors, onBookmark }) {
    return (
        <View style={[styles.card, { backgroundColor: colors?.card || '#252540', borderColor: colors?.cardBorder || '#3A3A55' }]}>
            <View style={styles.header}>
                <Text style={styles.label}>📖 LEARN</Text>
                <Text style={[styles.category, { color: colors?.textMuted || '#6A6A80' }]}>{data.category}</Text>
            </View>
            <Text style={styles.emoji}>{data.emoji}</Text>
            <Text style={[styles.title, { color: colors?.accent || '#64FFDA' }]}>{data.title}</Text>
            <Text style={[styles.content, { color: colors?.text || '#EEEEF5' }]}>{data.content}</Text>
            {onBookmark && (
                <TouchableOpacity style={styles.bookmarkBtn} onPress={() => onBookmark(data)} activeOpacity={0.7}>
                    <Text style={styles.bookmarkText}>🔖 Bookmark</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 16, padding: 20, borderWidth: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    label: { fontSize: 11, fontWeight: '700', letterSpacing: 2, color: '#64FFDA', textTransform: 'uppercase' },
    category: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    emoji: { fontSize: 36, textAlign: 'center', marginBottom: 8 },
    title: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
    content: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
    bookmarkBtn: { marginTop: 14, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgba(100,255,218,0.1)' },
    bookmarkText: { fontSize: 13, fontWeight: '600', color: '#64FFDA' },
});
