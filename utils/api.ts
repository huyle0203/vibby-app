import axios from 'axios';

// Log environment variables to ensure they are loaded correctly
console.log('CHATGPT_API_ENDPOINT:', process.env.CHATGPT_API_ENDPOINT);
console.log('CHATGPT_API_KEY:', process.env.CHATGPT_API_KEY);

const api = axios.create({
  baseURL: process.env.CHATGPT_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
  },
});

export const callChatGPT = async (message: string) => {
  try {
    const response = await api.post('', {
      prompt: `Respond concisely and break long responses into shorter sentences: ${message}`,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw error;
  }
};