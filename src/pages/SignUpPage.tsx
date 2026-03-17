import { SignUp } from '@clerk/clerk-react'

export function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        signInUrl="/sign-in"
        fallbackRedirectUrl="/chat"
        forceRedirectUrl="/chat"
       
      />
    </div>
  )
}
