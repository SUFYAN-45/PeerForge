"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Must be mounted before reading theme to avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9 rounded-xl" />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-9 h-9 rounded-xl flex items-center justify-center",
        // Adaptive background visible in both light and dark
        "bg-black/10 dark:bg-white/10",
        "hover:bg-black/15 dark:hover:bg-white/20",
        "border border-black/10 dark:border-white/10",
        "hover:border-black/20 dark:hover:border-white/20",
        "transition-all duration-200",
        className
      )}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun — visible in dark mode to click for light */}
      <Sun
        className={cn(
          "w-4 h-4 absolute transition-all duration-300 text-amber-500",
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-50"
        )}
      />
      {/* Moon — visible in light mode to click for dark */}
      <Moon
        className={cn(
          "w-4 h-4 absolute transition-all duration-300 text-indigo-500",
          !isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-50"
        )}
      />
    </button>
  )
}
