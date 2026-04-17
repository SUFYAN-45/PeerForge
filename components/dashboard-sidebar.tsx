"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCrisis } from "@/lib/crisis-context"
import {
  Shield,
  Activity,
  Building2,
  Heart,
  Home,
  LayoutDashboard,
  Users,
  Package,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

const frontlineNav: NavItem[] = [
  { label: "Dashboard", href: "/frontline", icon: LayoutDashboard },
  { label: "Daily Pulse", href: "/frontline#pulse", icon: Activity },
  { label: "Request Supplies", href: "/frontline#supplies", icon: Package },
]

const commandNav: NavItem[] = [
  { label: "Overview", href: "/command", icon: LayoutDashboard },
  { label: "Heatmap", href: "/command#heatmap", icon: AlertTriangle, badge: "3" },
  { label: "Smart Match", href: "/command#match", icon: Users },
  { label: "Analytics", href: "/command#analytics", icon: Activity },
]

const benefactorNav: NavItem[] = [
  { label: "Dashboard", href: "/benefactor", icon: LayoutDashboard },
  { label: "Inventory", href: "/benefactor#inventory", icon: Package },
  { label: "Leaderboard", href: "/benefactor#leaderboard", icon: Heart },
]

export function DashboardSidebar({ role }: { role: "frontline" | "command" | "benefactor" }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { isCrisisMode, toggleCrisisMode } = useCrisis()

  const navItems = role === "frontline" 
    ? frontlineNav 
    : role === "command" 
    ? commandNav 
    : benefactorNav

  const roleConfig = {
    frontline: { title: "Frontline", icon: Activity, color: "text-emerald-400" },
    command: { title: "Command Center", icon: Building2, color: "text-cyan-400" },
    benefactor: { title: "Benefactor", icon: Heart, color: "text-rose-400" }
  }

  const config = roleConfig[role]

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isCrisisMode ? "bg-red-500/20" : "bg-emerald-500/20"
          )}>
            <Shield className={cn("w-5 h-5", isCrisisMode ? "text-red-400" : "text-emerald-400")} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-semibold text-foreground">RescueShield</span>
                <span className={cn("text-xs", config.color)}>{config.title}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href.split("#")[0])
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent text-sidebar-primary"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Links */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <Home className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Home</span>}
        </Link>
        <button
          onClick={toggleCrisisMode}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            isCrisisMode 
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
              : "hover:bg-sidebar-accent"
          )}
        >
          <Zap className={cn("w-5 h-5 shrink-0", isCrisisMode && "text-red-400")} />
          {!isCollapsed && (
            <span className="text-sm">
              {isCrisisMode ? "Crisis Active" : "Crisis Mode"}
            </span>
          )}
        </button>
        <Link
          href="#settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center hover:bg-sidebar-accent transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  )
}
