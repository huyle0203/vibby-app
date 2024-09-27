import { SafeAreaView, StatusBar, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
//import { OPENAI_API_KEY } from '@env';


//import the .env file to access the API key
export default function AISummaryScreen() {
    const [input, setInput] = useState(`
    The 200 word project is a visual and audio tool comprised of a database of specialized words with pictures and video clips that allow students to hear native speakers pronounce each word. 
     Words were identified based on their applicability to professional fields such as business medicine and human rights as well as their ability to facilitate informal conversation and cultural integration.
    `);
    const [output, setOutput] = useState('');

    async function callOpenAIAPI() {
        const APIBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
            {
                "role": "system",
                "content": "You are a job recuiter that will summarize the input text given in 2 sentences."
            },
            {
                "role": "user",
                "content": input
            }
            ]
        }
        //const apiKey = process.env.API_KEY;

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            "authorization": `Bearer ${process.env.CHATGPT_API_KEY}`
            },
            body: JSON.stringify(APIBody)
        //translate data into response
        }).then((data) => {
            console.log("returned output", data);
            return data.json();
        }).then((data) => {
            setOutput(data.choices[0]['message']['content']);
            console.log(output);
        }).catch((error) => {
            console.error(error);
        });
    }
    
    return (
        <SafeAreaView>
            <Text >AI Screen</Text>
            <StatusBar />
            <TouchableOpacity onPress={callOpenAIAPI}>
                <Text>Run AI</Text>
            </TouchableOpacity>
            <Text>{output}</Text>
        </SafeAreaView>
    )
};