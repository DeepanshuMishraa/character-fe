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
import { useRouter, usePathname } from "next/navigation"
import { CreateCharacterButton } from "./create-character-button"

const Appbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, error, isAuthenticated } = useSession()
  const pathName = usePathname()
  const router = useRouter()

  console.log('Appbar render state:', { user, loading, error, isAuthenticated });

  // Show loading state in a non-intrusive way
  const renderAuthButtons = () => {
    console.log('renderAuthButtons called with:', { loading, isAuthenticated, user });

    if (loading) {
      return (
        <div className="flex space-x-4 items-center">
          <div className="h-9 w-24 bg-white/10 animate-pulse rounded-full"></div>
          <div className="h-9 w-20 bg-white/5 animate-pulse rounded-full"></div>
        </div>
      );
    }

    // If there's an error, we should handle it appropriately
    if (error) {
      console.error('Session error in Appbar:', error);
    }

    // Not loading and not authenticated
    if (!isAuthenticated || !user) {
      console.log('Rendering login/signup buttons');
      return (
        <>
          <Button
            onClick={() => {
              console.log('Redirecting to register...');
              window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`;
            }}
            className="rounded-full font-normal"
          >
            Sign Up to Chat
          </Button>
          <Button
            onClick={() => {
              console.log('Redirecting to login...');
              window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`;
            }}
            className="rounded-full font-normal bg-transparent text-white border-white/20 hover:bg-white/10"
            variant="outline"
          >
            Login
          </Button>
        </>
      );
    }

    // User is authenticated
    console.log('Rendering user menu for:', user);
    return (
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.picture} alt={user.given_name || 'User'} />
                <AvatarFallback>{user.given_name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.given_name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`;
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">
                Carter.Chat
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {user && (
                <Link
                  href="/dashboard"
                  className={pathName === "/dashboard" ? "text-foreground" : "text-foreground/60"}
                >
                  Characters
                </Link>
              )}
            </nav>
          </div>
          <Button
            variant="ghost"
            className="mr-6 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {user && (
                <button className="inline-flex items-center rounded-full border border-input px-4 py-2 text-sm text-muted-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full justify-between md:w-[240px] bg-background">
                  <Search className="mr-2 h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    Search characters...
                  </span>
                  <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </button>
              )}
            </div>
            <nav className="flex items-center">
              {renderAuthButtons()}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-14 z-50 grid h-[calc(100vh-3.5rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-lg animate-in md:hidden"
          >
            <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold">Carter.Chat</span>
              </Link>
              <nav className="grid grid-flow-row auto-rows-max text-sm">
                {user && (
                  <Link
                    href="/dashboard"
                    className={`flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline ${pathName === "/dashboard" ? "text-foreground" : "text-foreground/60"
                      }`}
                  >
                    Characters
                  </Link>
                )}
              </nav>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider px-2">Menu</h3>
                <div className="flex flex-col gap-3">
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-10 bg-white/10 animate-pulse rounded-full"></div>
                      <div className="h-10 bg-white/5 animate-pulse rounded-full"></div>
                    </div>
                  ) : !isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => {
                          window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`;
                        }}
                        className="rounded-full font-normal w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity"
                      >
                        Sign Up to Chat
                      </Button>
                      <Button
                        onClick={() => {
                          window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`;
                        }}
                        className="rounded-full font-normal w-full bg-transparent text-white border-white/20 hover:bg-white/10"
                        variant="outline"
                      >
                        Login
                      </Button>
                    </>
                  ) : user ? (
                    <Button
                      onClick={() => {
                        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`;
                      }}
                      className="rounded-full font-normal w-full bg-transparent text-white border-white/20 hover:bg-white/10"
                      variant="outline"
                    >
                      Logout
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Appbar;
