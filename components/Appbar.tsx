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
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreateCharacterButton } from "./create-character-button"
import { usePathname, useRouter } from "next/navigation"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { ModeToggle } from "./mode-toggle"

interface SearchResult {
  id: string;
  name: string;
  description: string;
  avatar?: string;
}

const Appbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debouncedSearch = useDebounce(search, 300);
  const pathName = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/character/search?q=${encodeURIComponent(debouncedSearch)}`
        );
        const data = await response.json();
        setSearchResults(data.characters);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  const handleResultClick = (characterId: string) => {
    router.push(`/dashboard/chat/${characterId}`);
    setShowResults(false);
    setSearch("");
  };

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
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 sm:gap-10">
          <Link href="/" className="text-xl font-normal text-foreground">holo.ai</Link>
          <div className="hidden sm:flex items-center space-x-4" />
        </div>

        <div className="flex items-center gap-4">
          {pathName === "/dashboard" && (
            <div ref={searchRef} className="relative hidden sm:flex items-center">
              <div className="absolute left-3">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                placeholder="Search characters..."
                className="w-[200px] md:w-[300px] lg:w-[400px] rounded-full bg-accent/50 border-border pl-10 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground"
              />

              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-popover/95 backdrop-blur-lg rounded-lg border border-border overflow-hidden shadow-lg"
                  >
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleResultClick(result.id)}
                        className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>{result.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{result.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{result.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <ModeToggle />

          {!session && (
            <Button
              onClick={async () => {
                router.push("/login");
              }}
              className="rounded-full font-normal bg-transparent text-foreground border-border hover:bg-accent"
              variant="outline"
            >
              Login
            </Button>
          )}

          {renderAuthButtons()}

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden relative z-50 hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
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
            className="sm:hidden fixed inset-0 top-[72px] bg-background z-50"
          >
            <div className="relative h-full p-6 space-y-6 overflow-auto">
              <div className="relative flex items-center">
                <div className="absolute left-3">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Search"
                  className="w-full rounded-full bg-accent/50 border-border pl-10 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-4">
                {session?.user && (
                  <Link href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appbar;
