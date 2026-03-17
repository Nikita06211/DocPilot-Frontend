import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="border-t border-white/8 bg-background px-4 py-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl gap-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          disabled={isLoading}
          className="min-h-10 flex-1 border-white/10 bg-white/5 placeholder:text-muted-foreground focus-visible:ring-white/20"
          aria-label="Chat message"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="size-10 shrink-0 bg-white text-background hover:bg-white/90"
          aria-label="Send message"
        >
          <Send className="size-4" aria-hidden />
        </Button>
      </form>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
        Powered by web search — always up to date
      </p>
    </div>
  )
}
