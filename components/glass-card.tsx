"use client"

import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  variant?: "default" | "dark" | "glow"
  glowColor?: "emerald" | "red" | "cyan"
  hover?: boolean
}

export function GlassCard({
  children,
  className,
  variant = "default",
  glowColor,
  hover = true,
  ...props
}: GlassCardProps) {
  const variants = {
    default: "bg-white/10 backdrop-blur-xl border border-white/20",
    dark: "bg-black/40 backdrop-blur-xl border border-white/10",
    glow: "bg-white/10 backdrop-blur-xl border border-white/20"
  }

  const glowClasses = {
    emerald: "glow-emerald",
    red: "glow-red",
    cyan: "shadow-[0_0_20px_rgba(56,189,248,0.4)]"
  }

  return (
    <motion.div
      className={cn(
        "rounded-xl p-6",
        variants[variant],
        glowColor && glowClasses[glowColor],
        hover && "transition-all duration-300 hover:bg-white/15 hover:border-white/30",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
