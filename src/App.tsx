import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { ChatPage } from '@/pages/ChatPage'
import { SignInPage } from '@/pages/SignInPage'
import { SignUpPage } from '@/pages/SignUpPage'

function RootRedirect() {
  return (
    <>
      <SignedIn>
        <Navigate to="/chat" replace />
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/sign-in', element: <SignInPage /> },
  { path: '/sign-up', element: <SignUpPage /> },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
