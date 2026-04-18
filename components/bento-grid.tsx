"use client"

import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"

// ─── BentoGrid ────────────────────────────────────────────────────────────────

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── BentoCell ────────────────────────────────────────────────────────────────

interface BentoCellProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
  glowAccent?: "emerald" | "cyan" | "amber" | "rose" | "none"
  /** Use `"bento"` for the 3D card look, `"flat"` for minimal */
  variant?: "bento" | "flat"
  index?: number
}

const colSpanMap = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-2 lg:col-span-3",
} as const

const rowSpanMap = {
  1: "",
  2: "row-span-2",
} as const

const glowMap = {
  emerald: "shadow-[0_0_24px_rgba(52,211,153,0.18)] hover:shadow-[0_0_36px_rgba(52,211,153,0.32)]",
  cyan:    "shadow-[0_0_24px_rgba(34,211,238,0.18)] hover:shadow-[0_0_36px_rgba(34,211,238,0.32)]",
  amber:   "shadow-[0_0_24px_rgba(251,191,36,0.18)] hover:shadow-[0_0_36px_rgba(251,191,36,0.32)]",
  rose:    "shadow-[0_0_24px_rgba(251,113,133,0.18)] hover:shadow-[0_0_36px_rgba(251,113,133,0.32)]",
  none:    "",
} as const

export function BentoCell({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  glowAccent = "none",
  variant = "bento",
  index = 0,
  ...props
}: BentoCellProps) {
  const isBento = variant === "bento"

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={isBento ? { y: -3, scale: 1.005, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-300",
        colSpanMap[colSpan],
        rowSpanMap[rowSpan],
        isBento && [
          "bg-gradient-to-br from-white/[0.07] to-white/[0.03]",
          "backdrop-blur-2xl",
          "border border-white/[0.12]",
          "hover:border-white/20",
          // 3D depth: subtle inner light at top-left
          "before:absolute before:inset-0 before:rounded-2xl",
          "before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent",
          "before:pointer-events-none before:block",
          "relative",
        ],
        isBento && glowMap[glowAccent],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
