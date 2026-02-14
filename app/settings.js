import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from './_layout';
import { getSettings, saveSettings, clearAllData, getSessions } from '../utils/storage';
import { SPACING, RADIUS } from '../utils/theme';

export default function SettingsScreen() {
    const { colors, dark, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({ darkMode: true, soundEnabled: false, sassLevel: 1 });

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const s = await getSettings();
                setSettings(s);
            })();
        }, [])
    );

    const updateSetting = async (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        await saveSettings(newSettings);
        if (key === 'darkMode') toggleTheme();
    };

    const handleClearData = () => {
        Alert.alert(
            '🗑️ Clear All Data?',
            'This will delete all sessions, badges, and progress. This cannot be undone!',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Everything',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllData();
                        Alert.alert('✅ Done', 'All data has been cleared.');
                    },
                },
            ]
        );
    };

    const handleExportCSV = async () => {
        try {
            const sessions = (await getSessions()) || [];
            if (sessions.length === 0) {
                Alert.alert('No Data', 'Complete some sessions first!');
                return;
            }
            const csv = 'Date,Duration (sec),Points\n' +
                sessions.map((s) => `${s.date},${s.duration},${s.points}`).join('\n');
            Alert.alert('📋 CSV Data', csv.substring(0, 500) + (csv.length > 500 ? '\n...' : ''), [{ text: 'OK' }]);
        } catch (e) {
            Alert.alert('Error', 'Failed to export data.');
        }
    };

    const sassLabels = ['😊 Mild', '😏 Spicy', '🌶️ Savage'];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: colors.text }]}>⚙️ Settings</Text>

                {/* Appearance */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
                <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <View>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>🌙 Dark Mode</Text>
                        <Text style={[styles.settingDesc, { color: colors.textMuted }]}>Easy on the eyes</Text>
                    </View>
                    <Switch
                        value={settings.darkMode}
                        onValueChange={(v) => updateSetting('darkMode', v)}
                        trackColor={{ false: '#ccc', true: colors.primary }}
                        thumbColor="#fff"
                    />
                </View>

                {/* Humor */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>HUMOR</Text>
                <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>🌶️ Sass Level</Text>
                    <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                        How sarcastic should the meta humor be?
                    </Text>
                    <View style={styles.sassButtons}>
                        {[1, 2, 3].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.sassBtn,
                                    {
                                        backgroundColor: settings.sassLevel === level ? colors.primary : 'transparent',
                                        borderColor: settings.sassLevel === level ? colors.primary : colors.cardBorder,
                                    },
                                ]}
                                onPress={() => updateSetting('sassLevel', level)}
                            >
                                <Text
                                    style={[
                                        styles.sassBtnText,
                                        { color: settings.sassLevel === level ? '#fff' : colors.textSecondary },
                                    ]}
                                >
                                    {sassLabels[level - 1]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Sound */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AUDIO</Text>
                <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <View>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>🔊 Sound Effects</Text>
                        <Text style={[styles.settingDesc, { color: colors.textMuted }]}>Silly sounds & feedback</Text>
                    </View>
                    <Switch
                        value={settings.soundEnabled}
                        onValueChange={(v) => updateSetting('soundEnabled', v)}
                        trackColor={{ false: '#ccc', true: colors.primary }}
                        thumbColor="#fff"
                    />
                </View>

                {/* Data */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DATA</Text>
                <TouchableOpacity
                    style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                    onPress={handleExportCSV}
                    activeOpacity={0.7}
                >
                    <View>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>📤 Export Stats</Text>
                        <Text style={[styles.settingDesc, { color: colors.textMuted }]}>Export session data as CSV</Text>
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: 18 }}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                    onPress={handleClearData}
                    activeOpacity={0.7}
                >
                    <View>
                        <Text style={[styles.settingLabel, { color: colors.danger }]}>🗑️ Clear All Data</Text>
                        <Text style={[styles.settingDesc, { color: colors.textMuted }]}>Delete all sessions & progress</Text>
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: 18 }}>→</Text>
                </TouchableOpacity>

                {/* About */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
                <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <Text style={styles.aboutEmoji}>💩</Text>
                    <Text style={[styles.aboutTitle, { color: colors.text }]}>SHIT TIMER</Text>
                    <Text style={[styles.aboutVersion, { color: colors.textMuted }]}>Version 1.0.0</Text>
                    <Text style={[styles.aboutDesc, { color: colors.textSecondary }]}>
                        The world's most fun bathroom companion.{'\n'}No ads. No accounts. 100% offline. 100% fun.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: 60, paddingHorizontal: SPACING.lg, paddingBottom: 120 },
    title: { fontSize: 28, fontWeight: '800', letterSpacing: 2, marginBottom: SPACING.lg },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
        textTransform: 'uppercase',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        marginBottom: 8,
    },
    settingCard: {
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        marginBottom: 8,
    },
    settingLabel: { fontSize: 16, fontWeight: '600' },
    settingDesc: { fontSize: 12, marginTop: 2 },
    sassButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    sassBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        alignItems: 'center',
    },
    sassBtnText: { fontSize: 13, fontWeight: '700' },
    aboutCard: {
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 1,
    },
    aboutEmoji: { fontSize: 48, marginBottom: 8 },
    aboutTitle: { fontSize: 24, fontWeight: '800', letterSpacing: 3 },
    aboutVersion: { fontSize: 12, fontWeight: '600', marginTop: 4, marginBottom: SPACING.md },
    aboutDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
