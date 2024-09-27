import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/app/helpers/common';
import Loading from './Loading';
interface ButtonProps {
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    title?: string;
    onPress?: () => void;
    loading?: boolean;
    hasShadow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading = false,
    hasShadow = true,
}) => {

    const shadowStyle = {
        shadowColor: theme.colors.primaryDark,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    }

    if(loading) {
        return (
            <View style={[styles.button, buttonStyle, {backgroundColor: 'black'}]}>
                <Loading />
            </View>
        )
    }



    return (
        <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
            <Text style ={[styles.text, textStyle]}>{title}</Text>
        </Pressable>
    )
    
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        height: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.lg,
    },
    text: {
        fontSize: hp(2.5),
        color: 'white',
        fontWeight: 'bold',
    }
})