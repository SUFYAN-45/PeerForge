"use client"

import { motion } from "framer-motion"
import { 
  Activity, TrendingUp, TrendingDown, Users, Package, 
  AlertTriangle, Percent, Target, RefreshCw, Calendar
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { StrategicHeatmap } from "@/components/strategic-heatmap"
import { SmartMatchHub } from "@/components/smart-match-hub"
import { useCrisis } from "@/lib/crisis-context"
import { cn } from "@/lib/utils"

const kpiCards = [
  {
    label: "System-wide Burnout Risk",
    value: "42%",
    change: "-8%",
    trend: "down",
    icon: Activity,
    color: "amber",
    description: "vs. last week"
  },
  {
    label: "Resource Efficiency",
    value: "87%",
    change: "+12%",
    trend: "up",
    icon: Target,
    color: "emerald",
    description: "allocation accuracy"
  },
  {
    label: "Match Success Rate",
    value: "94%",
    change: "+3%",
    trend: "up",
    icon: Percent,
    color: "cyan",
    description: "completed matches"
  },
  {
    label: "Active Staff",
    value: "2,847",
    change: "+124",
    trend: "up",
    icon: Users,
    color: "primary",
    description: "currently on shift"
  }
]

const recentActivity = [
  { id: 1, type: "dispatch", message: "PPE dispatched to Emergency Room", time: "5 min ago", status: "success" },
  { id: 2, type: "alert", message: "Low stock alert: Ward C - Syringes", time: "12 min ago", status: "warning" },
  { id: 3, type: "match", message: "New donation matched with ICU", time: "25 min ago", status: "info" },
  { id: 4, type: "dispatch", message: "Medication delivery completed", time: "1 hour ago", status: "success" },
  { id: 5, type: "alert", message: "Staff burnout alert: Pediatrics", time: "2 hours ago", status: "warning" },
]

const resourceOverview = [
  { category: "PPE", available: 12500, needed: 15000, status: "warning" },
  { category: "Medications", available: 8900, needed: 7500, status: "good" },
  { category: "Equipment", available: 450, needed: 500, status: "warning" },
  { category: "IV Supplies", available: 3200, needed: 2800, status: "good" },
]

export default function CommandDashboard() {
  const { isCrisisMode } = useCrisis()

  return (
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
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown
          
          return (
            <GlassCard
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  kpi.color === "emerald" && "bg-emerald-500/20",
                  kpi.color === "amber" && "bg-amber-500/20",
                  kpi.color === "cyan" && "bg-cyan-500/20",
                  kpi.color === "primary" && "bg-primary/20"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    kpi.color === "emerald" && "text-emerald-400",
                    kpi.color === "amber" && "text-amber-400",
                    kpi.color === "cyan" && "text-cyan-400",
                    kpi.color === "primary" && "text-primary"
                  )} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  kpi.trend === "up" ? "text-emerald-400" : "text-red-400"
                )}>
                  <TrendIcon className="w-4 h-4" />
                  {kpi.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            </GlassCard>
          )
        })}
      </motion.div>

      {/* Strategic Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StrategicHeatmap />
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Match Hub - Takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <SmartMatchHub />
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resource Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Resource Overview</h3>
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {resourceOverview.map((resource) => {
                  const percentage = Math.round((resource.available / resource.needed) * 100)
                  const isGood = percentage >= 100
                  
                  return (
                    <div key={resource.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{resource.category}</span>
                        <span className={cn(
                          "text-sm font-medium",
                          isGood ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            isGood ? "bg-emerald-500" : "bg-amber-500"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>{resource.available.toLocaleString()} available</span>
                        <span>{resource.needed.toLocaleString()} needed</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Recent Activity</h3>
                <span className="text-xs text-muted-foreground">View all</span>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      activity.status === "success" && "bg-emerald-400",
                      activity.status === "warning" && "bg-amber-400",
                      activity.status === "info" && "bg-cyan-400"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{activity.message}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Alert Banner for Crisis Mode */}
      {isCrisisMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-full flex items-center gap-3 z-30"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
          <span className="text-red-400 font-medium">Crisis protocols activated - All dispatches prioritized</span>
        </motion.div>
      )}
    </div>
  )
}
