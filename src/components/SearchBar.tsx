import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { borderRadius, shadows, spacing } from "../theme";

interface ISearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    placeholder?: string;
}

const SearchBar = ({
    value,
    onChangeText,
    onSubmit,
    placeholder = "Tìm công việc tại đây...",
}: ISearchBarProps) => {
    return (
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
                onSubmitEditing={onSubmit}
            />
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
});

export default SearchBar;