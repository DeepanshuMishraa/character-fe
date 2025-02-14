import { createAuthClient } from "better-auth/react"

// In production, the API URL should be the same as the frontend URL + /api
const baseURL = process.env.NEXT_PUBLIC_URL as string
export const authClient = createAuthClient({
  baseURL,
  withCredentials: true
})

export const { signIn, signOut, signUp, useSession } = authClient;
