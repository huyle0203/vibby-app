import { StatusBar } from "expo-status-bar";
import { hp, wp } from "./helpers/common";
import { theme } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import Button from "@/components/Button";
import { router } from "expo-router";

const Welcome = () => {
    return (
        <ScreenWrapper>
            <StatusBar style="dark" />
            <View style={styles.container}>
                <Image style={styles.welcomeImage} resizeMode='contain' source={require('@/assets/images/penguin.png')} />

                {/* title */}
                <View style={{gap:20}}>
                    <Text style={styles.title}>Welcome to Vibby</Text>
                    <Text style={styles.punchline}>Let's start vibing</Text>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Button 
                        title="Getting Started"
                        buttonStyle={{marginHorizontal: wp(3)}}
                        onPress={()=>router.push('/signUp')}
                    />
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.loginText}>
                            Already have an account?
                        </Text>
                        <Pressable onPress={()=>router.push('/login')}>
                            <Text style={[styles.loginText, {color: theme.colors.primary, fontWeight: '700'}]}>
                                Login
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Welcome 

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        backgroundColor: 'black',
        paddingHorizontal: wp(4),
    },
    welcomeImage: {
        height: hp(30),
        width: wp(100),
        alignSelf: 'center',
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text,
    },
    footer: {
        gap: 30,
        width: '100%',
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.8)
    },

})
