import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
            <Ionicons name="search" size={20} color="#2F4F4F" style={styles.icon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
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
        backgroundColor: "#E0EBEE", // nền xanh nhạt
        borderRadius: 6,
        paddingHorizontal: 8,
        height: 40,
        marginVertical: 8,
    },
    icon: {
        marginRight: 6,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: "#333",
    },
});

export default SearchBar;
