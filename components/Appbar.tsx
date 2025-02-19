"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { signIn, signOut, signUp, useSession } from "@/lib/auth-client"
import { User, LogOut, Search, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreateCharacterButton } from "./create-character-button"
import { usePathname, useRouter } from "next/navigation"

const Appbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname()

  const renderAuthButtons = () => (
    !session ? (
      <></>
    ) : (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User'} />
              <AvatarFallback className="bg-white/10 text-white">
                {session.user?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  }
                }
              })
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-4 bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-4 sm:gap-10">
          <Link href="/" className="text-xl font-normal text-white">holo.ai</Link>
          <div className="hidden sm:flex items-center space-x-4">
            {session?.user && <Link href="/dashboard" className="">Dashboard</Link>}
            {pathName === "/dashboard" && <CreateCharacterButton />}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:flex items-center">
            <div className="absolute left-3">
              <Search className="w-4 h-4 text-white/60" />
            </div>
            <Input
              placeholder="Search"
              className="w-[200px] md:w-[300px] lg:w-[400px] rounded-full bg-white/10 border-none pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/60"
            />
          </div>
          {!session && (
            <Button
              onClick={async () => {
                router.push("/login");
              }}
              className="rounded-full font-normal bg-transparent text-white border-white/20 hover:bg-white/10"
              variant="outline"
            >
              Login
            </Button>
          )}
          {renderAuthButtons()}
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
            className="sm:hidden fixed inset-0 top-[72px] bg-[#111111] z-50"
          >
            <div className="relative h-full p-6 space-y-6 overflow-auto">
              <div className="relative flex items-center">
                <div className="absolute left-3">
                  <Search className="w-4 h-4 text-white/60" />
                </div>
                <Input
                  placeholder="Search"
                  className="w-full rounded-full bg-white/10 border-none pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/60"
                />
              </div>

              <div className="space-y-4">
                {session?.user && <Link href="/dashboard" className="">Dashboard</Link>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appbar;
