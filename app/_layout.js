import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';
import { getSettings } from '../utils/storage';

// Theme context
export const ThemeContext = createContext({
    dark: true,
    colors: COLORS.dark,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export default function Layout() {
    const [dark, setDark] = useState(true);
    const colors = dark ? COLORS.dark : COLORS.light;

    useEffect(() => {
        (async () => {
            const settings = await getSettings();
            setDark(settings.darkMode);
        })();
    }, []);

    const toggleTheme = () => setDark((d) => !d);

    return (
        <ThemeContext.Provider value={{ dark, colors, toggleTheme }}>
            <StatusBar style={dark ? 'light' : 'dark'} />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: colors.tabBar,
                        borderTopColor: colors.tabBarBorder,
                        borderTopWidth: 1,
                        height: 85,
                        paddingBottom: 28,
                        paddingTop: 8,
                    },
                    tabBarActiveTintColor: colors.tabActive,
                    tabBarInactiveTintColor: colors.tabInactive,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Timer',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💩</Text>,
                    }}
                />
                <Tabs.Screen
                    name="stats"
                    options={{
                        title: 'Stats',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📊</Text>,
                    }}
                />
                <Tabs.Screen
                    name="achievements"
                    options={{
                        title: 'Badges',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏆</Text>,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
                    }}
                />
            </Tabs>
        </ThemeContext.Provider>
    );
}
