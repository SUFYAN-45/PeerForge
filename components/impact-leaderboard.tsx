"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Trophy, Medal, Shield, Heart, Star, TrendingUp, 
  Crown, Award, Sparkles
} from "lucide-react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  rank: number
  name: string
  type: "NGO" | "Corporate" | "Individual"
  livesGuarded: number
  donations: number
  badge: string
  isCurrentUser?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Red Cross Regional", type: "NGO", livesGuarded: 12450, donations: 847, badge: "Guardian Angel" },
  { rank: 2, name: "MedSupply Corp", type: "Corporate", livesGuarded: 9820, donations: 623, badge: "Lifeline Hero" },
  { rank: 3, name: "Community Foundation", type: "NGO", livesGuarded: 7650, donations: 512, badge: "Shield Bearer" },
  { rank: 4, name: "HealthFirst Inc.", type: "Corporate", livesGuarded: 6200, donations: 389, badge: "Resource Champion" },
  { rank: 5, name: "Sarah Johnson", type: "Individual", livesGuarded: 4850, donations: 156, badge: "Care Provider", isCurrentUser: true },
  { rank: 6, name: "Local Heroes Fund", type: "NGO", livesGuarded: 4120, donations: 298, badge: "Community Shield" },
  { rank: 7, name: "PharmaCare Ltd.", type: "Corporate", livesGuarded: 3890, donations: 245, badge: "Medicine Guardian" },
  { rank: 8, name: "David Chen", type: "Individual", livesGuarded: 2150, donations: 87, badge: "Rising Star" },
]

const badges = [
  { name: "Guardian Angel", icon: Crown, color: "amber", description: "Top contributor" },
  { name: "Lifeline Hero", icon: Heart, color: "rose", description: "10,000+ lives guarded" },
  { name: "Shield Bearer", icon: Shield, color: "emerald", description: "500+ donations" },
  { name: "Resource Champion", icon: Award, color: "cyan", description: "Consistent donor" },
  { name: "Care Provider", icon: Star, color: "purple", description: "Healthcare supporter" },
]

const typeColors = {
  NGO: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  Corporate: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  Individual: { bg: "bg-rose-500/20", text: "text-rose-400" }
}

export function ImpactLeaderboard() {
  const [selectedTab, setSelectedTab] = useState<"all" | "ngo" | "corporate" | "individual">("all")

  const filteredData = leaderboardData.filter(entry => {
    if (selectedTab === "all") return true
    return entry.type.toLowerCase() === selectedTab
  })

  const currentUser = leaderboardData.find(e => e.isCurrentUser)

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Impact Leaderboard</h3>
            <p className="text-sm text-muted-foreground">Top contributors this month</p>
          </div>
        </div>
      </div>

      {/* Current User Stats */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-500/30 to-amber-500/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">#{currentUser.rank}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{currentUser.name}</span>
                <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded">You</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-foreground">{currentUser.livesGuarded.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">lives guarded</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span className="text-sm text-foreground">{currentUser.donations}</span>
                  <span className="text-xs text-muted-foreground">donations</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="font-medium text-amber-400">{currentUser.badge}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12 this week</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: "all", label: "All" },
          { id: "ngo", label: "NGOs" },
          { id: "corporate", label: "Corporate" },
          { id: "individual", label: "Individual" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              selectedTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {filteredData.map((entry, index) => {
          const typeColor = typeColors[entry.type]
          
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl transition-colors",
                entry.isCurrentUser 
                  ? "bg-rose-500/10 border border-rose-500/20" 
                  : "bg-white/5 hover:bg-white/10"
              )}
            >
              {/* Rank */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center font-bold",
                entry.rank === 1 && "bg-amber-500/20 text-amber-400",
                entry.rank === 2 && "bg-gray-400/20 text-gray-300",
                entry.rank === 3 && "bg-orange-600/20 text-orange-400",
                entry.rank > 3 && "bg-white/10 text-muted-foreground"
              )}>
                {entry.rank <= 3 ? (
                  entry.rank === 1 ? <Crown className="w-5 h-5" /> :
                  entry.rank === 2 ? <Medal className="w-5 h-5" /> :
                  <Award className="w-5 h-5" />
                ) : (
                  <span>#{entry.rank}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">{entry.name}</span>
                  {entry.isCurrentUser && (
                    <span className="text-xs px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded">You</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn("text-xs px-2 py-0.5 rounded", typeColor.bg, typeColor.text)}>
                    {entry.type}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {entry.badge}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-foreground">{entry.livesGuarded.toLocaleString()}</span>
                </div>
                <span className="text-xs text-muted-foreground">{entry.donations} donations</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Badges Section */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-foreground mb-3">Available Badges</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.name}
                className="p-3 rounded-lg bg-white/5 text-center hover:bg-white/10 transition-colors group"
              >
                <Icon className={cn(
                  "w-6 h-6 mx-auto mb-1 group-hover:scale-110 transition-transform",
                  badge.color === "amber" && "text-amber-400",
                  badge.color === "rose" && "text-rose-400",
                  badge.color === "emerald" && "text-emerald-400",
                  badge.color === "cyan" && "text-cyan-400",
                  badge.color === "purple" && "text-purple-400"
                )} />
                <span className="text-xs text-foreground block truncate">{badge.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}
