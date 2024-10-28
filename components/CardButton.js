import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../themes/colors';
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomButton = ({ title, onPress, icon, disable }) => {
    return (
        <TouchableOpacity style={disable ? styles.disabledButon : styles.button} onPress={onPress} disabled={disable}>
            <Text style={styles.text}>{title}</Text>
            <Ionicons
                name={icon}
                size={24}
                color={colors.white}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.DEFAULT,
        paddingVertical: 10,
        paddingHorizontal: 6,
        gap: 6,
        borderRadius: 8,
        justifyContent: 'center',
    },
    disabledButon: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 6,
        gap: 6,
        borderRadius: 8,
        justifyContent: 'center',
        backgroundColor: colors.grey,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500'
    },
    icon: {
        marginRight: 5,
    },
});

export default CustomButton;
