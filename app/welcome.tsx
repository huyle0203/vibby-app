import React from 'react';
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "./helpers/common";
import { theme } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StyleSheet, Text, View, Pressable, ImageBackground } from "react-native";
import Button from "@/components/Buttons/Button";
import { router } from "expo-router";

export default function Welcome() {
    return (
        <ScreenWrapper fullScreen>
            <StatusBar 
            style="dark" 
            backgroundColor="transparent"
            translucent={true}
            />
            <ImageBackground 
                source={require('@/assets/images/background.png')} 
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <View style={styles.topContent} />
                    <View style={styles.cloudContent}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Welcome to Vibby</Text>
                            <Text style={styles.punchline}>Let's start vibing</Text>
                        </View>
                        <View style={styles.footer}>
                            <Button 
                                title="Getting Started"
                                buttonStyle={styles.button}
                                onPress={() => router.push('/signUp')}
                            />
                            <View style={styles.bottomTextContainer}>
                                <Text style={styles.loginText}>
                                    Already have an account?
                                </Text>
                                <Pressable onPress={() => router.push('/login')}>
                                    <Text style={[styles.loginText, styles.loginLink]}>
                                        Login
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    topContent: {
        flex: 1,
    },
    cloudContent: {
        height: hp(50), // Increased height to accommodate all content
        justifyContent: 'flex-end', // Align content to the bottom of the cloud
        paddingHorizontal: wp(4),
        paddingBottom: hp(8),
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: hp(2),
    },
    title: {
        color: 'black',
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(2),
        color: 'black',
        marginTop: hp(2),
        fontWeight: 'bold',
    },
    footer: {
        gap: hp(2),
        width: '100%',
    },
    button: {
        marginHorizontal: wp(3),
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: wp(1),
    },
    loginText: {
        textAlign: 'center',
        color: 'black',
        fontSize: hp(1.8),
    },
    loginLink: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
});