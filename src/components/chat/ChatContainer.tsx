import type { UIMessage } from 'ai'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

interface ChatContainerProps {
  messages: UIMessage[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onRegenerate?: (options?: { messageId?: string }) => Promise<void>
  isLoading: boolean
  error?: Error
}

export function ChatContainer({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  onRegenerate,
  isLoading,
  error,
}: ChatContainerProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4 py-6">
          {messages.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Chat
              </p>
              <h2 className="text-lg font-medium text-foreground tracking-tight">
                Ask anything with live web context
              </h2>
              <p className="max-w-sm text-sm font-normal leading-relaxed text-muted-foreground">
                Your AI assistant uses web search to provide the latest information.
              </p>
            </div>
          )}
          <MessageList
            messages={messages}
            onRegenerate={onRegenerate}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
