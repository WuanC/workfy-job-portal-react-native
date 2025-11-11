import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../theme/colors";
import { borderRadius, shadows, spacing } from "../theme";

interface ISearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    // how many recent items to show when focused (default 3)
    recentLimit?: number;
}

const RECENT_KEY = "recentSearches";

const SearchBar = ({
    value,
    onChangeText,
    onSubmit,
    placeholder = "Tìm công việc tại đây...",
    recentLimit = 3,
}: ISearchBarProps) => {
    const [recents, setRecents] = useState<string[]>([]);
    const [showRecents, setShowRecents] = useState(false);

    useEffect(() => {
        // load recents once
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(RECENT_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw) as string[];
                    setRecents(parsed || []);
                }
            } catch (e) {
                // ignore silently
                console.warn("Failed to load recent searches", e);
            }
        })();
    }, []);

    const saveRecents = async (items: string[]) => {
        try {
            await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(items));
        } catch (e) {
            console.warn("Failed to save recent searches", e);
        }
    };

    const handleSubmit = async () => {
        onSubmit();

        const text = value?.trim();
        if (!text) return;

        // update recents: put on top, dedupe, keep up to 10
        const next = [text, ...recents.filter((r) => r.toLowerCase() !== text.toLowerCase())].slice(0, 10);
        setRecents(next);
        await saveRecents(next);
        setShowRecents(false);
    };

    const handleSelectRecent = async (text: string) => {
        onChangeText(text);
        // run submit immediately when user taps a recent
        setShowRecents(false);
        // small delay to allow UI update
        setTimeout(() => onSubmit(), 50);
    };

    return (
        <View style={{ width: "100%" }}>
            <View style={styles.container}>
                <Ionicons name="search" size={20} color={colors.primary.start} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.text.tertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    onSubmitEditing={handleSubmit}
                    onFocus={() => setShowRecents(true)}
                    onBlur={() => {
                        // delay hiding to allow pressing recent item on Android
                        setTimeout(() => setShowRecents(false), 200);
                    }}
                    returnKeyType="search"
                />
            </View>

            {showRecents && recents.length > 0 && (
                <View style={styles.recentContainer} pointerEvents="box-none">
                    {recents.slice(0, recentLimit).map((item, idx) => (
                        <TouchableOpacity
                            key={item + idx}
                            style={styles.recentItem}
                            onPress={() => handleSelectRecent(item)}
                        >
                            <Ionicons name="time-outline" size={18} color={colors.text.tertiary} style={{ marginRight: 10 }} />
                            <Text style={styles.recentText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 48,
        marginVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border.light,
        ...shadows.soft,
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
    },
    recentContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginTop: 6,
        paddingVertical: 6,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
        ...shadows.soft,
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Platform.OS === "android" ? 8 : 10,
    },
    recentText: {
        color: colors.text.primary,
        fontSize: 15,
    },
});

export default SearchBar;