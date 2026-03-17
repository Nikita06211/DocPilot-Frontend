import { UserButton } from '@clerk/clerk-react'
import { MessageSquare } from 'lucide-react'

export function Navbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/8 bg-background px-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4 text-muted-foreground" aria-hidden />
        <span className="font-medium tracking-tight text-foreground">DocsAI</span>
      </div>
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          elements: {
            avatarBox: 'size-8',
          },
        }}
      />
    </header>
  )
}
