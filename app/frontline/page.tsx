"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Activity, Clock, Calendar, Bell,
  TrendingUp, Package, Heart, Users, Coffee, ArrowRight
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { BentoGrid, BentoCell } from "@/components/bento-grid"
import { PageTransition } from "@/components/page-transition"
import { DailyPulseWidget } from "@/components/daily-pulse-widget"
import { WhistleblowerWidget } from "@/components/whistleblower-widget"
import { SupplyRequestModal } from "@/components/supply-request-modal"
import { useCrisis } from "@/lib/crisis-context"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"

const quickStats = [
  { label: "Shift Hours",    value: "8:45",  icon: Clock,   trend: "+15min" },
  { label: "Patients Today", value: "12",    icon: Users,   trend: "+2"     },
  { label: "Break Time",     value: "45min", icon: Coffee,  trend: "On track"},
]

const notifications = [
  { id: 1, type: "info",    message: "Staff meeting at 2:00 PM in Conference Room B", time: "1h ago" },
  { id: 2, type: "warning", message: "PPE supplies running low in Ward C",             time: "2h ago" },
  { id: 3, type: "success", message: "Your supply request has been fulfilled",          time: "3h ago" },
]

const upcomingShifts = [
  { day: "Today",     time: "7:00 AM – 3:00 PM",  status: "active"   },
  { day: "Tomorrow",  time: "3:00 PM – 11:00 PM", status: "upcoming" },
  { day: "Wednesday", time: "7:00 AM – 3:00 PM",  status: "upcoming" },
]

const teamMembers = [
  { name: "Dr. Chen",     role: "Attending",    status: "available" },
  { name: "RN Johnson",   role: "Charge Nurse", status: "busy"      },
  { name: "RN Williams",  role: "Staff Nurse",  status: "available" },
  { name: "Tech Martinez",role: "Med Tech",     status: "break"     },
]

const quickActions = [
  { label: "Need Supplies",      sub: "Quick ward request",  color: "cyan",    icon: Package,   onClick: "supply" },
  { label: "Wellness Resources", sub: "Support and tools",   color: "emerald", icon: Heart,     onClick: null     },
  { label: "View History",       sub: "Past check-ins",      color: "amber",   icon: Activity,  onClick: null     },
]

export default function FrontlineDashboard() {
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false)
  const { setHighBurnout } = useCrisis()
  const { user } = useUser()

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return "Good Morning"
    if (h < 17) return "Good Afternoon"
    return "Good Evening"
  })()

  const name = user?.firstName || "Doctor"

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {greeting}, {name}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
          <button className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors self-start sm:self-center">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
              {notifications.length}
            </span>
          </button>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <GlassCard
                key={stat.label}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-4 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.05 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-emerald-400">{stat.trend}</span>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* ── Main Bento Grid ── */}
        <BentoGrid>
          {/* Daily Pulse – wide */}
          <BentoCell colSpan={2} glowAccent="emerald" index={0} className="p-0">
            <DailyPulseWidget onBurnoutChange={(risk) => setHighBurnout(risk >= 70)} />
          </BentoCell>

          {/* Quick Actions */}
          <BentoCell colSpan={1} glowAccent="none" index={1} className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    onClick={() => action.onClick === "supply" && setIsSupplyModalOpen(true)}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-all group flex items-center gap-3 text-left",
                      action.color === "cyan"    && "bg-cyan-500/10    border-cyan-500/20    hover:bg-cyan-500/20",
                      action.color === "emerald" && "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20",
                      action.color === "amber"   && "bg-amber-500/10   border-amber-500/20   hover:bg-amber-500/20"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      action.color === "cyan"    && "bg-cyan-500/20",
                      action.color === "emerald" && "bg-emerald-500/20",
                      action.color === "amber"   && "bg-amber-500/20"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        action.color === "cyan"    && "text-cyan-400",
                        action.color === "emerald" && "text-emerald-400",
                        action.color === "amber"   && "text-amber-400"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground block text-sm">{action.label}</span>
                      <span className="text-xs text-muted-foreground">{action.sub}</span>
                    </div>
                    <ArrowRight className={cn(
                      "w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform shrink-0",
                      action.color === "cyan"    && "text-cyan-400",
                      action.color === "emerald" && "text-emerald-400",
                      action.color === "amber"   && "text-amber-400"
                    )} />
                  </button>
                )
              })}
            </div>
          </BentoCell>

          {/* Whistleblower Widget – wide */}
          <BentoCell colSpan={2} glowAccent="amber" index={2} className="p-0">
            <WhistleblowerWidget />
          </BentoCell>

          {/* Notifications */}
          <BentoCell colSpan={1} glowAccent="none" index={3} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <span className="text-xs text-muted-foreground">View all</span>
            </div>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    n.type === "info"    && "bg-cyan-400",
                    n.type === "warning" && "bg-amber-400",
                    n.type === "success" && "bg-emerald-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{n.message}</p>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCell>

          {/* Upcoming Shifts */}
          <BentoCell colSpan={1} glowAccent="none" index={4} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Upcoming Shifts</h3>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {upcomingShifts.map((shift, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-3 rounded-lg border",
                    shift.status === "active"
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-white/5 border-white/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("font-medium text-sm", shift.status === "active" ? "text-emerald-400" : "text-foreground")}>
                      {shift.day}
                    </span>
                    {shift.status === "active" && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Active</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{shift.time}</span>
                </div>
              ))}
            </div>
          </BentoCell>

          {/* Team on Shift */}
          <BentoCell colSpan={1} glowAccent="none" index={5} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Team on Shift</h3>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {teamMembers.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-sm font-medium shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground block">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.role}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    m.status === "available" && "bg-emerald-500/20 text-emerald-400",
                    m.status === "busy"      && "bg-red-500/20 text-red-400",
                    m.status === "break"     && "bg-amber-500/20 text-amber-400"
                  )}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </BentoCell>
        </BentoGrid>

        <SupplyRequestModal isOpen={isSupplyModalOpen} onClose={() => setIsSupplyModalOpen(false)} />
      </div>
    </PageTransition>
  )
}
