'use client'

import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'
import React from 'react'

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black/80">
      <div className="max-w-md w-full p-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-10">
          <Button
            onClick={async () => {
              await signIn.social({
                provider: "google",
                callbackURL: `${process.env.NEXT_PUBLIC_URL}/dashboard`
              })
            }}
            variant="outline"
            className="w-full h-12 px-6 flex items-center justify-center gap-3
            bg-white dark:bg-black/90 hover:bg-gray-50 dark:hover:bg-black/70
            text-gray-800 dark:text-gray-200 font-medium
            border border-gray-300 dark:border-gray-800
            transition-all duration-200 ease-in-out
            hover:shadow-md dark:hover:shadow-black/40
            focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-500/30"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.766 12.277c0-.82-.07-1.64-.19-2.41H12.24v4.554h6.458c-.287 1.487-1.136 2.726-2.396 3.583v3.02h3.86c2.274-2.087 3.604-5.168 3.604-8.747Z"
                fill="#4285F4"
              />
              <path
                d="M12.24 24c3.236 0 5.966-1.062 7.922-2.876l-3.86-3.02c-1.087.731-2.464 1.146-4.062 1.146-3.13 0-5.785-2.112-6.728-4.952h-3.97v3.116C3.578 21.262 7.659 24 12.24 24Z"
                fill="#34A853"
              />
              <path
                d="M5.512 14.298A7.176 7.176 0 0 1 5.12 12c0-.798.142-1.574.392-2.298V6.586h-3.97A11.944 11.944 0 0 0 0 12c0 1.936.464 3.772 1.276 5.414l4.236-3.116Z"
                fill="#FBBC05"
              />
              <path
                d="M12.24 4.75c1.762 0 3.338.605 4.584 1.794l3.417-3.417C18.206 1.19 15.476 0 12.24 0 7.659 0 3.578 2.738 1.542 6.586l3.97 3.116c.943-2.84 3.597-4.952 6.728-4.952Z"
                fill="#EA4335"
              />
            </svg>
            <span>Sign in with Google</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

