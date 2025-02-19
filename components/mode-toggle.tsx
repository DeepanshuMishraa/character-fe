"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-12 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-800"
    >
      <div
        className={`absolute inset-0 flex w-full items-center justify-between px-2 transition-transform duration-500 ${theme === "dark" ? "translate-x-0" : "-translate-x-1/2"
          }`}
      >
        <Sun className="h-8 w-8 text-yellow-500 transition-all duration-500 dark:text-gray-400" />
        <Moon className="h-8 w-8 text-gray-400 transition-all duration-500 dark:text-blue-300" />
      </div>
      <div
        className={`absolute h-10 w-10 transform rounded-full bg-white shadow-lg transition-all duration-500 ${theme === "dark" ? "translate-x-[2.75rem]" : "-translate-x-[2.75rem]"
          }`}
      />
    </button>
  )
}

