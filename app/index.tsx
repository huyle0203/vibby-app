import { View, Text, Button } from 'react-native';
import React from 'react'
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';

const index = () => {
    const router = useRouter();
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Loading />
        {/* <View> */}
            {/* <Text>index</Text>
            <Text> contains all links</Text>
            <Button title="welcome" onPress={() => router.push({ pathname: '/welcome' })} />
            <Button title="profilePicture" onPress={() => router.push({ pathname: '/profilePicture' })} />
            <Button title="tagsSelection" onPress={() => router.push({ pathname: '/tagsSelection' })} />
            <Button title="highlightBio" onPress={() => router.push({ pathname: '/highlightBio' })} />
            <Button title="login" onPress={() => router.push({ pathname: '/(auth)/login' })} />
            <Button title="signUp" onPress={() => router.push({ pathname: '/(auth)/signUp' })} />
            <Button title="aiChatbotScreen" onPress={() => router.push({ pathname: '/aiChatbotScreen' })} />
            <Button title="aiSummaryScreen" onPress={() => router.push({ pathname: '/aiSummaryScreen' })} />
            <Button title="main" onPress={() => router.push({ pathname: '/(tabs)/two' })} />
            <Button title="nameInputScreen" onPress={() => router.push({ pathname: '/nameInput' })} />
            <Button title="imageSelection" onPress={() => router.push({ pathname: '/imagesSelection' })} />
            <Button title="mustVibeFatcs" onPress={() => router.push({ pathname: '/mustVibeFacts' })} /> */}

        </View>
    )
}

export default index;