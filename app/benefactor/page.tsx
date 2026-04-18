"use client"

import { motion } from "framer-motion"
import { 
  Heart, Package, TrendingUp, Calendar, Clock, 
  MapPin, CheckCircle, Truck, AlertCircle
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { InventoryForm } from "@/components/inventory-form"
import { ImpactLeaderboard } from "@/components/impact-leaderboard"
import { DonationForm } from "@/components/donation-form"
import { PageTransition } from "@/components/page-transition"
import { cn } from "@/lib/utils"

const impactStats = [
  { label: "Lives Guarded", value: "4,850", icon: Heart, color: "rose", change: "+124" },
  { label: "Items Donated", value: "1,247", icon: Package, color: "cyan", change: "+38" },
  { label: "Matches Made", value: "156", icon: CheckCircle, color: "emerald", change: "+12" },
  { label: "Active Listings", value: "8", icon: TrendingUp, color: "amber", change: "+3" }
]

const recentDonations = [
  { 
    id: 1, 
    items: "500 N95 Masks, 200 Gowns", 
    recipient: "City Hospital - ER",
    date: "Today", 
    status: "delivered",
    livesImpacted: 450
  },
  { 
    id: 2, 
    items: "150 IV Sets, 1000 Syringes", 
    recipient: "Regional Medical Center",
    date: "Yesterday", 
    status: "in-transit",
    livesImpacted: 320
  },
  { 
    id: 3, 
    items: "20 Oxygen Regulators", 
    recipient: "Community Clinic",
    date: "2 days ago", 
    status: "delivered",
    livesImpacted: 180
  },
  { 
    id: 4, 
    items: "Medications Bundle", 
    recipient: "Pediatric Ward",
    date: "3 days ago", 
    status: "delivered",
    livesImpacted: 95
  }
]

const pendingRequests = [
  { 
    id: 1, 
    facility: "Emergency Department", 
    items: "N95 Masks", 
    quantity: "500 units",
    urgency: "critical",
    distance: "12 km"
  },
  { 
    id: 2, 
    facility: "ICU Ward B", 
    items: "IV Sets", 
    quantity: "100 sets",
    urgency: "high",
    distance: "28 km"
  },
  { 
    id: 3, 
    facility: "General Ward", 
    items: "Bandages", 
    quantity: "200 rolls",
    urgency: "medium",
    distance: "5 km"
  }
]

const statusConfig = {
  delivered: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Delivered" },
  "in-transit": { icon: Truck, color: "text-cyan-400", bg: "bg-cyan-500/20", label: "In Transit" },
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20", label: "Pending" }
}

const urgencyConfig = {
  critical: { color: "text-red-400", bg: "bg-red-500/20" },
  high: { color: "text-amber-400", bg: "bg-amber-500/20" },
  medium: { color: "text-cyan-400", bg: "bg-cyan-500/20" }
}

export default function BenefactorDashboard() {
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
            Welcome, Sarah
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            Making a difference, one donation at a time
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <Heart className="w-5 h-5 text-rose-400" />
          <span className="font-semibold text-rose-400">4,850 Lives Guarded</span>
        </div>
      </motion.div>

      {/* Impact Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {impactStats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <GlassCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  stat.color === "rose" && "bg-rose-500/20",
                  stat.color === "cyan" && "bg-cyan-500/20",
                  stat.color === "emerald" && "bg-emerald-500/20",
                  stat.color === "amber" && "bg-amber-500/20"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    stat.color === "rose" && "text-rose-400",
                    stat.color === "cyan" && "text-cyan-400",
                    stat.color === "emerald" && "text-emerald-400",
                    stat.color === "amber" && "text-amber-400"
                  )} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <span className="text-xs text-emerald-400">{stat.change}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Form — new! */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <DonationForm />
        </motion.div>

        {/* Inventory Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InventoryForm />
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Matching Requests</h3>
                    <p className="text-sm text-muted-foreground">Facilities need your help</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">3 urgent</span>
              </div>

              <div className="space-y-3">
                {pendingRequests.map((request) => {
                  const urgency = urgencyConfig[request.urgency as keyof typeof urgencyConfig]
                  
                  return (
                    <div
                      key={request.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium text-foreground">{request.facility}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{request.distance}</span>
                          </div>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded capitalize",
                          urgency.bg, urgency.color
                        )}>
                          {request.urgency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {request.items} - {request.quantity}
                        </div>
                        <button className="text-xs font-medium text-primary hover:underline">
                          Match
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Recent Donations</h3>
                <span className="text-xs text-muted-foreground">View all</span>
              </div>

              <div className="space-y-3">
                {recentDonations.map((donation) => {
                  const status = statusConfig[donation.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon
                  
                  return (
                    <div
                      key={donation.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", status.bg)}>
                        <StatusIcon className={cn("w-5 h-5", status.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{donation.items}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{donation.recipient}</span>
                          <span>-</span>
                          <span>{donation.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-xs px-2 py-1 rounded", status.bg, status.color)}>
                          {status.label}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {donation.livesImpacted} lives
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <ImpactLeaderboard />
      </motion.div>
    </div>
    </PageTransition>
  )
}
