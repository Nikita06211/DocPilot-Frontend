import { SignIn } from '@clerk/clerk-react'

export function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/chat"
        forceRedirectUrl="/chat"
        appearance={{ baseTheme: undefined, variables: { colorBackground: '#0a0a0a', colorText: '#e5e5e5' } }}
      />
    </div>
  )
}
