import { createAuthClient } from "better-auth/react"

// Add console.log to debug the URL
console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL)

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const { signIn, signOut, signUp, useSession } = authClient;
