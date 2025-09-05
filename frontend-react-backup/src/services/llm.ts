import axios from 'axios'

const llmApi = axios.create({
  baseURL: '/api/llm',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const chat = (messages: Array<{ role: string; content: string }>) =>
  llmApi.post('/chat', { messages })

export default llmApi
