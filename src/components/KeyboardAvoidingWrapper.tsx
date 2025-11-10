import React from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, ViewStyle } from "react-native";

type Props = {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
};

const KeyboardAvoidingWrapper: React.FC<Props> = ({ children, style }) => {
    return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >

                {children}


            </KeyboardAvoidingView>
    );
};


export default KeyboardAvoidingWrapper;
