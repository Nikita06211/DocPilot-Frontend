import { SignIn } from '@clerk/clerk-react'

export function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/chat"
        forceRedirectUrl="/chat"
       
      />
    </div>
  )
}
