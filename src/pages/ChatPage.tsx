import { useChat } from '@ai-sdk/react'
import { useAuth } from '@clerk/clerk-react'
import { DefaultChatTransport } from 'ai'
import { useMemo, useState } from 'react'
import { ChatContainer } from '@/components/chat/ChatContainer'
import { Navbar } from '@/components/layout/Navbar'

const API_URL = import.meta.env.VITE_API_URL || ''

export function ChatPage() {
  const { getToken } = useAuth()
  const [input, setInput] = useState('')

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${API_URL}/api/chat`,
        fetch: async (url, options) => {
          const token = await getToken()
          return fetch(url, {
            ...options,
            headers: {
              ...(options?.headers as Record<string, string>),
              Authorization: token ? `Bearer ${token}` : '',
            },
          })
        },
      }),
    [getToken]
  )

  const { messages, sendMessage, regenerate, status, error } = useChat({
    transport,
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />
      <ChatContainer
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        onRegenerate={regenerate}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}
