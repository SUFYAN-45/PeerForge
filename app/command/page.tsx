"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {
  Activity, TrendingUp, TrendingDown, Users, Package,
  AlertTriangle, Percent, Target, RefreshCw, Calendar, Bell
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { BentoGrid, BentoCell } from "@/components/bento-grid"
import { PageTransition } from "@/components/page-transition"
import { PulseMap } from "@/components/pulse-map"
import { SmartMatchHub } from "@/components/smart-match-hub"
import { useCrisis } from "@/lib/crisis-context"
import { cn } from "@/lib/utils"
import { getWhistleblowerCount } from "@/app/actions"
import { toast } from "sonner"

const kpiCards = [
  { label: "System-wide Burnout Risk",  value: "42%",   change: "-8%",   trend: "down", icon: Activity, color: "amber"   },
  { label: "Resource Efficiency",       value: "87%",   change: "+12%",  trend: "up",   icon: Target,   color: "emerald" },
  { label: "Match Success Rate",        value: "94%",   change: "+3%",   trend: "up",   icon: Percent,  color: "cyan"    },
  { label: "Active Staff",              value: "2,847", change: "+124",  trend: "up",   icon: Users,    color: "primary" },
]

const recentActivity = [
  { id: 1, message: "PPE dispatched to Emergency Room",    time: "5 min ago",  status: "success" },
  { id: 2, message: "Low stock alert: Ward C – Syringes",  time: "12 min ago", status: "warning" },
  { id: 3, message: "New donation matched with ICU",       time: "25 min ago", status: "info"    },
  { id: 4, message: "Medication delivery completed",       time: "1 hour ago", status: "success" },
  { id: 5, message: "Staff burnout alert: Pediatrics",     time: "2 hours ago",status: "warning" },
]

const resourceOverview = [
  { category: "PPE",        available: 12500, needed: 15000 },
  { category: "Medications",available: 8900,  needed: 7500  },
  { category: "Equipment",  available: 450,   needed: 500   },
  { category: "IV Supplies",available: 3200,  needed: 2800  },
]

export default function CommandDashboard() {
  const { isCrisisMode } = useCrisis()
  const [wbCount, setWbCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    getWhistleblowerCount().then(setWbCount)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const count = await getWhistleblowerCount()
      setWbCount(count)
      toast.success("Data refreshed", { description: `${count} whistleblower report(s) on record.` })
    } finally {
      setTimeout(() => setRefreshing(false), 600)
    }
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              Command Center
              {isCrisisMode && (
                <span className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded-full animate-pulse">
                  Crisis Mode Active
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Whistleblower Bell */}
            <button
              onClick={handleRefresh}
              className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
              title="Whistleblower reports"
            >
              <Bell className="w-5 h-5" />
              {wbCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-xs flex items-center justify-center px-1 font-bold"
                >
                  {wbCount > 99 ? "99+" : wbCount}
                </motion.span>
              )}
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </motion.div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon
            const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown
            return (
              <GlassCard
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.05 }}
                className="relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    kpi.color === "emerald" && "bg-emerald-500/20",
                    kpi.color === "amber"   && "bg-amber-500/20",
                    kpi.color === "cyan"    && "bg-cyan-500/20",
                    kpi.color === "primary" && "bg-primary/20"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      kpi.color === "emerald" && "text-emerald-400",
                      kpi.color === "amber"   && "text-amber-400",
                      kpi.color === "cyan"    && "text-cyan-400",
                      kpi.color === "primary" && "text-primary"
                    )} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    kpi.trend === "up" ? "text-emerald-400" : "text-red-400"
                  )}>
                    <TrendIcon className="w-3 h-3" />
                    {kpi.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{kpi.label}</p>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* Bento Grid — Main Content */}
        <BentoGrid>
          {/* Pulse Map — wide */}
          <BentoCell colSpan={2} rowSpan={1} glowAccent="cyan" index={0} className="p-0 min-h-[22rem]">
            <PulseMap />
          </BentoCell>

          {/* Resource Overview */}
          <BentoCell colSpan={1} rowSpan={1} glowAccent="emerald" index={1} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Resource Overview</h3>
              <Package className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {resourceOverview.map((resource) => {
                const pct = Math.round((resource.available / resource.needed) * 100)
                const isGood = pct >= 100
                return (
                  <div key={resource.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{resource.category}</span>
                      <span className={cn("text-sm font-medium", isGood ? "text-emerald-400" : "text-amber-400")}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", isGood ? "bg-emerald-500" : "bg-amber-500")}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </BentoCell>

          {/* Smart Match Hub – wide */}
          <BentoCell colSpan={2} glowAccent="cyan" index={2} className="p-0">
            <SmartMatchHub />
          </BentoCell>

          {/* Recent Activity */}
          <BentoCell colSpan={1} glowAccent="none" index={3} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Activity</h3>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    a.status === "success" && "bg-emerald-400",
                    a.status === "warning" && "bg-amber-400",
                    a.status === "info"    && "bg-cyan-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{a.message}</p>
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCell>
        </BentoGrid>

        {/* Crisis Alert Banner */}
        {isCrisisMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-full flex items-center gap-3 z-30"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-red-400 font-medium text-sm">Crisis protocols activated</span>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
