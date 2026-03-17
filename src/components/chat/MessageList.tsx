import type { UIMessage } from 'ai'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: UIMessage[]
  onRegenerate?: (options?: { messageId?: string }) => Promise<void>
  isLoading: boolean
  error?: Error
}

export function MessageList({
  messages,
  onRegenerate,
  isLoading,
  error,
}: MessageListProps) {
  return (
    <ScrollArea className="h-full pr-4">
      <div className="flex flex-col gap-6 pb-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onRegenerate={onRegenerate}
            canRegenerate={
              message.role === 'assistant' &&
              !isLoading &&
              message.id !== 'typing'
            }
          />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <MessageBubble
            message={{
              id: 'typing',
              role: 'assistant',
              parts: [],
            }}
            isStreaming
          />
        )}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error.message}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
