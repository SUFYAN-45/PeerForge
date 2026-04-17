"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Shield, Activity, Clock, Calendar, Bell, TrendingUp, 
  Package, AlertTriangle, Heart, Users, Coffee
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { DailyPulseWidget } from "@/components/daily-pulse-widget"
import { WhistleblowerModal } from "@/components/whistleblower-modal"
import { SupplyRequestModal } from "@/components/supply-request-modal"
import { useCrisis } from "@/lib/crisis-context"
import { cn } from "@/lib/utils"

const quickStats = [
  { label: "Shift Hours", value: "8:45", icon: Clock, trend: "+15min" },
  { label: "Patients Today", value: "12", icon: Users, trend: "+2" },
  { label: "Break Time", value: "45min", icon: Coffee, trend: "On track" },
]

const notifications = [
  { id: 1, type: "info", message: "Staff meeting at 2:00 PM in Conference Room B", time: "1h ago" },
  { id: 2, type: "warning", message: "PPE supplies running low in Ward C", time: "2h ago" },
  { id: 3, type: "success", message: "Your supply request has been fulfilled", time: "3h ago" },
]

const upcomingShifts = [
  { day: "Today", time: "7:00 AM - 3:00 PM", status: "active" },
  { day: "Tomorrow", time: "3:00 PM - 11:00 PM", status: "upcoming" },
  { day: "Wednesday", time: "7:00 AM - 3:00 PM", status: "upcoming" },
]

const teamMembers = [
  { name: "Dr. Chen", role: "Attending", status: "available" },
  { name: "RN Johnson", role: "Charge Nurse", status: "busy" },
  { name: "RN Williams", role: "Staff Nurse", status: "available" },
  { name: "Tech Martinez", role: "Med Tech", status: "break" },
]

export default function FrontlineDashboard() {
  const [isWhistleblowerOpen, setIsWhistleblowerOpen] = useState(false)
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false)
  const { setHighBurnout } = useCrisis()

  const handleBurnoutChange = (risk: number) => {
    setHighBurnout(risk >= 70)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Good Morning, Dr. Sarah
          </h1>
          <p className="text-muted-foreground mt-1">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <GlassCard
              key={stat.label}
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs text-emerald-400">{stat.trend}</span>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Pulse - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <DailyPulseWidget onBurnoutChange={handleBurnoutChange} />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="h-full">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsSupplyModalOpen(true)}
                className="w-full p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 
                  hover:bg-cyan-500/20 transition-all group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground block">Need Supplies</span>
                  <span className="text-xs text-muted-foreground">Quick ward request</span>
                </div>
                <TrendingUp className="w-5 h-5 text-cyan-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 
                  hover:bg-emerald-500/20 transition-all group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground block">Wellness Resources</span>
                  <span className="text-xs text-muted-foreground">Support and tools</span>
                </div>
              </button>

              <button
                className="w-full p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 
                  hover:bg-amber-500/20 transition-all group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground block">View History</span>
                  <span className="text-xs text-muted-foreground">Past check-ins</span>
                </div>
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <span className="text-xs text-muted-foreground">View all</span>
            </div>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    notif.type === "info" && "bg-cyan-400",
                    notif.type === "warning" && "bg-amber-400",
                    notif.type === "success" && "bg-emerald-400"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{notif.message}</p>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Upcoming Shifts</h3>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {upcomingShifts.map((shift, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border",
                    shift.status === "active" 
                      ? "bg-emerald-500/10 border-emerald-500/30" 
                      : "bg-white/5 border-white/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "font-medium",
                      shift.status === "active" ? "text-emerald-400" : "text-foreground"
                    )}>
                      {shift.day}
                    </span>
                    {shift.status === "active" && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{shift.time}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Team Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Team on Shift</h3>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-sm font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground block">{member.name}</span>
                      <span className="text-xs text-muted-foreground">{member.role}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    member.status === "available" && "bg-emerald-500/20 text-emerald-400",
                    member.status === "busy" && "bg-red-500/20 text-red-400",
                    member.status === "break" && "bg-amber-500/20 text-amber-400"
                  )}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Whistleblower FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setIsWhistleblowerOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-amber-500 text-black 
          shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-all
          flex items-center justify-center group z-30"
      >
        <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute right-full mr-3 px-3 py-2 bg-black/90 backdrop-blur-sm rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Secure Report
        </span>
      </motion.button>

      {/* Modals */}
      <WhistleblowerModal 
        isOpen={isWhistleblowerOpen} 
        onClose={() => setIsWhistleblowerOpen(false)} 
      />
      <SupplyRequestModal 
        isOpen={isSupplyModalOpen} 
        onClose={() => setIsSupplyModalOpen(false)} 
      />
    </div>
  )
}
