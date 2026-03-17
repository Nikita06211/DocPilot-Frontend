import { SignUp } from '@clerk/clerk-react'

export function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        signInUrl="/sign-in"
        fallbackRedirectUrl="/chat"
        forceRedirectUrl="/chat"
        appearance={{ baseTheme: undefined, variables: { colorBackground: '#0a0a0a', colorText: '#e5e5e5' } }}
      />
    </div>
  )
}
