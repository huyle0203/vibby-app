import axios from 'axios';


const api = axios.create({
  baseURL: OPENAI_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'OpenAI-Beta': 'assistants=v2'
  },
});

export const callOpenAIAssistant = async (message: string) => {
  try {
    // Step 1: Create a thread
    const threadResponse = await api.post('/threads', {});
    const threadId = threadResponse.data.id;

    // Step 2: Add a message to the thread
    await api.post(`/threads/${threadId}/messages`, {
      role: 'user',
      content: message
    });

    // Step 3: Run the assistant
    const runResponse = await api.post(`/threads/${threadId}/runs`, {
      assistant_id: ASSISTANT_ID
    });
    const runId = runResponse.data.id;

    // Step 4: Wait for the run to complete
    let runStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
      const statusResponse = await api.get(`/threads/${threadId}/runs/${runId}`);
      runStatus = statusResponse.data.status;
    } while (runStatus !== 'completed');

    // Step 5: Retrieve the assistant's messages
    const messagesResponse = await api.get(`/threads/${threadId}/messages`);
    const assistantMessages = messagesResponse.data.data
      .filter((msg: any) => msg.role === 'assistant')
      .map((msg: any) => msg.content[0].text.value);

    return assistantMessages.join(' ');
  } catch (error) {
    console.error('Error calling OpenAI Assistant API:', error);
    throw error;
  }
};