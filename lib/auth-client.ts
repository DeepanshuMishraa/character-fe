import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "https://holo-ai-one.vercel.app",
  withCredentials: true
})

export const { signIn, signOut, signUp, useSession } = authClient;
