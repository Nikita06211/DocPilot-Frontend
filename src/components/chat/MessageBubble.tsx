import type { UIMessage } from 'ai'
import { getToolName, isReasoningUIPart, isToolUIPart } from 'ai'
import { Download, RotateCw, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ui/reasoning'
import { Tool } from '@/components/ui/tool'

interface MessageBubbleProps {
  message: UIMessage
  isStreaming?: boolean
  onRegenerate?: (options?: { messageId?: string }) => Promise<void>
  canRegenerate?: boolean
}

function getMessageMarkdown(message: UIMessage): string {
  const parts = message.parts ?? []
  const sections: string[] = []
  for (const part of parts) {
    if (part.type === 'text' && part.text) sections.push(part.text)
    if (isReasoningUIPart(part) && part.text) {
      sections.push(`\n\n_Thinking:_\n\n${part.text}\n\n`)
    }
  }
  return sections.join('\n\n').trim() || ''
}

const markdownComponents = {
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="my-3 list-disc space-y-1 pl-6 [&_ul]:mt-2 [&_ul]:pl-5 [&_ul]:list-[circle]"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="my-3 list-decimal space-y-1 pl-6 [&_ol]:mt-2 [&_ol]:pl-5"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-0.5 leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-3 border-l-4 border-white/20 pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-2 leading-7" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className
    return isInline ? (
      <code
        className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-foreground"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className={cn(
          'block overflow-x-auto rounded-md border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-[13px] text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-2 overflow-x-auto rounded-md border border-white/10 bg-white/5 px-3 py-2.5">
      {children}
    </pre>
  ),
}

export function MessageBubble({
  message,
  isStreaming,
  onRegenerate,
  canRegenerate = false,
}: MessageBubbleProps) {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)
  const isUser = message.role === 'user'
  const parts = message.parts ?? []
  const hasContent = parts.length > 0
  const showActions = !isUser && canRegenerate && !isStreaming

  const handleDownload = () => {
    const markdown = getMessageMarkdown(message)
    if (!markdown) return
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `response-${message.id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-1',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] space-y-3 rounded-lg px-4 py-3',
          isUser
            ? 'bg-white/10 text-foreground'
            : 'text-foreground'
        )}
      >
        {hasContent ? (
          <div className="flex flex-col gap-3">
            {parts.map((part, idx) => {
              if (isToolUIPart(part)) {
                const toolName = getToolName(part)
                const toolState =
                  part.state === 'approval-requested' ||
                  part.state === 'approval-responded'
                    ? 'input-available'
                    : part.state === 'output-denied'
                      ? 'output-error'
                      : part.state
                const inputRecord =
                  part.input != null && typeof part.input === 'object' && !Array.isArray(part.input)
                    ? (part.input as Record<string, unknown>)
                    : { input: part.input }
                const outputRecord =
                  part.output != null && typeof part.output === 'object' && !Array.isArray(part.output)
                    ? (part.output as Record<string, unknown>)
                    : part.output != null
                      ? { result: part.output }
                      : undefined
                return (
                  <Tool
                    key={part.toolCallId ?? `tool-${idx}`}
                    toolPart={{
                      type: toolName,
                      state: toolState,
                      input: inputRecord,
                      output: outputRecord,
                      toolCallId: part.toolCallId,
                      errorText: part.errorText,
                    }}
                    className="mt-2"
                  />
                )
              }
              if (isReasoningUIPart(part)) {
                return (
                  <Reasoning
                    key={`reasoning-${idx}`}
                    isStreaming={part.state === 'streaming'}
                  >
                    <ReasoningTrigger>Show reasoning</ReasoningTrigger>
                    <ReasoningContent markdown>{part.text}</ReasoningContent>
                  </Reasoning>
                )
              }
              if (part.type === 'text' && part.text) {
                return (
                  <div
                    key={`text-${idx}`}
                    className="prose prose-sm prose-invert max-w-none text-[15px] font-normal leading-relaxed prose-headings:font-medium prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-10 prose-strong:text-foreground prose-strong:font-medium"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {part.text}
                    </ReactMarkdown>
                  </div>
                )
              }
              return null
            })}
          </div>
        ) : isStreaming ? (
          <div className="flex items-center gap-1.5 py-1">
            <span
              className="size-1.5 animate-pulse rounded-full bg-white/60"
              aria-hidden
            />
            <span
              className="size-1.5 animate-pulse rounded-full bg-white/60 delay-100"
              aria-hidden
            />
            <span
              className="size-1.5 animate-pulse rounded-full bg-white/60 delay-200"
              aria-hidden
            />
          </div>
        ) : null}
        {showActions && (
          <div className="mt-3 flex items-center gap-0.5 border-t border-white/10 pt-2">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onRegenerate?.({ messageId: message.id })}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              aria-label="Regenerate answer"
            >
              <RotateCw className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
              className={cn(
                'h-7 w-7',
                feedback === 'like'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="Like"
            >
              <ThumbsUp className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
              className={cn(
                'h-7 w-7',
                feedback === 'dislike'
                  ? 'text-destructive'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label="Dislike"
            >
              <ThumbsDown className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleDownload}
              disabled={!getMessageMarkdown(message)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-40"
              aria-label="Download as markdown"
            >
              <Download className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
