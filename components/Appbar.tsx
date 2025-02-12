"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Search, Menu, X, User, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "@/lib/use-session"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { redirect } from "next/navigation"

const Appbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, isAuthenticated } = useSession()

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-4 bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-4 sm:gap-10">
          <Link href="/" className="text-xl font-normal text-white">holo.ai</Link>
          <div className="hidden sm:flex space-x-4">
            {!loading && !isAuthenticated ? (
              <>
                <Button
                    onClick={() => redirect(`${process.env.BACKEND_URL}/api/auth/register`)}
                  className="rounded-full font-normal"
                >
                  Sign Up to Chat
                </Button>
                <Button
                  onClick={() => redirect(`${process.env.BACKEND_URL}/api/auth/login`)}
                  className="rounded-full font-normal bg-transparent text-white border-white/20 hover:bg-white/10"
                  variant="outline"
                >
                  Login
                </Button>
              </>
            ) : isAuthenticated && user ? (
              <DropdownMenu>  
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.picture || ''} alt={user.given_name || 'User'} />
                      <AvatarFallback className="bg-white/10 text-white">
                        {user.given_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.given_name} {user.family_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => redirect(`${process.env.BACKEND_URL}/api/auth/logout`)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:flex items-center">
            <div className="absolute left-3">
              <Search className="w-4 h-4 text-white/60" />
            </div>
            <Input
              placeholder="Search"
              className="w-[300px] lg:w-[400px] rounded-full bg-white/10 border-none pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/60"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden relative z-50 hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed inset-0 top-[72px] bg-[#111111]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
            <div className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] -top-[200px] -right-[200px]" />
            <div className="absolute w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] -bottom-[200px] -left-[200px]" />

            <div className="relative h-full p-6 space-y-6 overflow-auto">
              <div className="relative flex items-center">
                <div className="absolute left-3">
                  <Search className="w-4 h-4 text-white/60" />
                </div>
                <Input
                  placeholder="Search characters..."
                  className="w-full rounded-full bg-white/10 border-none pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/60"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider px-2">Menu</h3>
                <div className="flex flex-col gap-3">
                  {!loading && !isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => redirect(`${process.env.BACKEND_URL}/api/auth/register`)}
                        className="rounded-full font-normal w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity"
                      >
                        Sign Up to Chat
                      </Button>
                      <Button
                        onClick={() => redirect(`${process.env.BACKEND_URL}/api/auth/login`)}
                        className="rounded-full font-normal w-full bg-transparent text-white border-white/20 hover:bg-white/10"
                        variant="outline"
                      >
                        Login
                      </Button>
                    </>
                  ) : isAuthenticated && user ? (
                    <Button
                      onClick={() => redirect(`${process.env.BACKEND_URL}/api/auth/logout`)}
                      className="rounded-full font-normal w-full bg-transparent text-white border-white/20 hover:bg-white/10"
                      variant="outline"
                    >
                      Logout
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider px-2">Quick Links</h3>
                <div className="flex flex-col gap-2">
                  <button className="text-left px-2 py-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    Popular Characters
                  </button>
                  <button className="text-left px-2 py-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    Create Character
                  </button>
                  <button className="text-left px-2 py-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    Help & Support
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Appbar
