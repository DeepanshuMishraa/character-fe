// auth-client.ts (NextJS)
import { createAuthClient } from "better-auth/react"

// Add console.log to debug the URL
console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL)

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`,
  withCredentials: true,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  cookieOptions:{
    httpOnly:true,
    path:"/",
    maxAge:30 * 24 * 60 * 60 * 1000,
  },
  secret:process.env.BETTER_AUTH_SECRET as string,
})

export const { signIn, signOut, signUp, useSession } = authClient;
