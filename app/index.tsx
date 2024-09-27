import { View, Text, Button } from 'react-native';
import React from 'react'
import { useRouter } from 'expo-router';

const index = () => {
    const router = useRouter();
    return (
        <View>
            <Text>index</Text>
            <Text> contains all links</Text>
            <Button title="welcome" onPress={() => router.push({ pathname: '/welcome' })} />
            <Button title="profilePicture" onPress={() => router.push({ pathname: '/profilePicture' })} />
            <Button title="profilePicture" onPress={() => router.push({ pathname: '/tagsSelection' })} />
            <Button title="highlightBio" onPress={() => router.push({ pathname: '/highlightBio' })} />
            <Button title="login" onPress={() => router.push({ pathname: '/login' })} />
            <Button title="signUp" onPress={() => router.push({ pathname: '/signUp' })} />
            <Button title="aiChatbotScreen" onPress={() => router.push({ pathname: '/aiChatbotScreen' })} />
            <Button title="aiSummaryScreen" onPress={() => router.push({ pathname: '/aiSummaryScreen' })} />
            <Button title="main" onPress={() => router.push({ pathname: '/(tabs)/two' })} />
            <Button title="nameInputScreen" onPress={() => router.push({ pathname: '/nameInput' })} />

        </View>
    )
}

export default index;