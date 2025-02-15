import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_URL ,
  withCredentials: true
})

export const { signIn, signOut, signUp, useSession } = authClient;
