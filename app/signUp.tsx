import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { wp, hp } from './helpers/common'
import { theme } from '@/constants/theme'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { Iconify } from 'react-native-iconify'
import Button from '@/components/Button'

const SignUp = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const nameRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const onSubmit = async ()=> {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Login', 'Fill all fields!');
            return;
        }        
    } 
  return (
    <ScreenWrapper bg='black'>
        <StatusBar style='dark' />
        <View style={styles.container}>
            <BackButton router={router} />

            {/* welcome */}
            <View>
                <Text style={styles.welcomeText}>Let's</Text>
                <Text style={styles.welcomeText}>Get Started</Text>
            </View>

            {/* form */}
            <View style={styles.form}>
                <Text style={{fontSize: hp(1.8), color: theme.colors.text, fontWeight: '700'}}>
                    Please fill all the details
                </Text>
                <Input 
                icon = {<Iconify icon="lucide:mail" size={26} strokeWidth={1.6} /> }
                placeholder="Enter your name"
                onChangeText={(value: string) => nameRef.current = value}
                />
                <Input 
                icon = {<Iconify icon="lucide:mail" size={26} strokeWidth={1.6} /> }
                placeholder="Enter your email"
                onChangeText={(value: string)=> emailRef.current = value}
                />
                <Input 
                icon = {<Iconify icon="lucide:mail" size={26} strokeWidth={1.6} /> }
                placeholder="Enter your password"
                secureTextEntry
                onChangeText={(value: string)=> passwordRef.current = value}
                />
                <Text style={styles.forgotPassword}>
                    Forgot Password?
                </Text>
                <Button title={'Sign Up'} loading={loading} onPress={onSubmit} />
            </View>
            {/* footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Already have an account?
                </Text>
                <Pressable onPress={()=> router.push('/login')}>
                    <Text style={[styles.footerText, {color: theme.colors.primary, fontWeight: '700'}]}>Login</Text>
                </Pressable>
            </View>
        </View>

    </ScreenWrapper>

  )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    form: {
        gap: 25,
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: 'semibold',
        color: theme.colors.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.7),

    }
})