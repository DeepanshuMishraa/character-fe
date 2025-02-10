"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Search, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const Appbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-4 bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-4 sm:gap-10">
          <Link href="/" className="text-xl font-normal text-white">holo.ai</Link>
          <div className="hidden sm:flex space-x-4">
            <Button className="rounded-full font-normal">Sign Up to Chat</Button>
            <Button className="rounded-full font-normal bg-transparent text-white border-white/20 hover:bg-white/10" variant={"outline"}>Login</Button>
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
                  <Button
                    className="rounded-full font-normal w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity"
                  >
                    Sign Up to Chat
                  </Button>
                  <Button
                    className="rounded-full font-normal w-full bg-transparent text-white border-white/20 hover:bg-white/10"
                    variant={"outline"}
                  >
                    Login
                  </Button>
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
