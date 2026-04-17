"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { 
  Sparkles, ArrowRight, Package, Building2, MapPin, 
  Clock, Check, X, TrendingUp, Zap
} from "lucide-react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface Match {
  id: string
  donor: {
    name: string
    type: "NGO" | "Corporate" | "Individual"
    location: string
  }
  recipient: {
    name: string
    department: string
    urgency: "critical" | "high" | "medium"
  }
  items: {
    name: string
    quantity: number
    unit: string
  }[]
  matchScore: number
  eta: string
  distance: string
}

const mockMatches: Match[] = [
  {
    id: "1",
    donor: {
      name: "Red Cross Regional",
      type: "NGO",
      location: "Downtown Hub"
    },
    recipient: {
      name: "Emergency Room",
      department: "Critical Care",
      urgency: "critical"
    },
    items: [
      { name: "N95 Masks", quantity: 500, unit: "units" },
      { name: "Surgical Gowns", quantity: 200, unit: "pieces" }
    ],
    matchScore: 98,
    eta: "45 min",
    distance: "12 km"
  },
  {
    id: "2",
    donor: {
      name: "MedSupply Corp",
      type: "Corporate",
      location: "Industrial District"
    },
    recipient: {
      name: "Ward C",
      department: "General Medicine",
      urgency: "high"
    },
    items: [
      { name: "IV Sets", quantity: 150, unit: "sets" },
      { name: "Syringes", quantity: 1000, unit: "units" }
    ],
    matchScore: 92,
    eta: "1h 20min",
    distance: "28 km"
  },
  {
    id: "3",
    donor: {
      name: "Community Foundation",
      type: "NGO",
      location: "Eastside Center"
    },
    recipient: {
      name: "ICU",
      department: "Intensive Care",
      urgency: "medium"
    },
    items: [
      { name: "Oxygen Regulators", quantity: 20, unit: "units" }
    ],
    matchScore: 87,
    eta: "2h",
    distance: "35 km"
  }
]

const urgencyConfig = {
  critical: { color: "text-red-400", bg: "bg-red-500/20", label: "Critical" },
  high: { color: "text-amber-400", bg: "bg-amber-500/20", label: "High" },
  medium: { color: "text-cyan-400", bg: "bg-cyan-500/20", label: "Medium" }
}

export function SmartMatchHub() {
  const [matches, setMatches] = useState(mockMatches)
  const [dispatchingId, setDispatchingId] = useState<string | null>(null)

  const handleDispatch = async (matchId: string) => {
    setDispatchingId(matchId)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const match = matches.find(m => m.id === matchId)
    toast.success("Dispatch initiated!", {
      description: `Resources from ${match?.donor.name} are on the way to ${match?.recipient.name}`
    })
    
    setMatches(matches.filter(m => m.id !== matchId))
    setDispatchingId(null)
  }

  const handleDecline = (matchId: string) => {
    setMatches(matches.filter(m => m.id !== matchId))
    toast.info("Match declined", {
      description: "The AI will suggest alternative matches"
    })
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Smart Match Hub</h3>
            <p className="text-sm text-muted-foreground">AI-suggested resource allocations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">{matches.length} Pending</span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {matches.map((match) => {
            const urgency = urgencyConfig[match.recipient.urgency]
            const isDispatching = dispatchingId === match.id

            return (
              <motion.div
                key={match.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Match Score</span>
                        <span className={cn(
                          "text-lg font-bold",
                          match.matchScore >= 95 ? "text-emerald-400" : 
                          match.matchScore >= 90 ? "text-cyan-400" : "text-amber-400"
                        )}>
                          {match.matchScore}%
                        </span>
                      </div>
                      <span className={cn("text-xs px-2 py-0.5 rounded", urgency.bg, urgency.color)}>
                        {urgency.label} Priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      ETA: {match.eta}
                    </div>
                    <span className="text-xs text-muted-foreground">{match.distance}</span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Donor */}
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">From</span>
                    </div>
                    <p className="font-medium text-foreground">{match.donor.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      {match.donor.location}
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded mt-2 inline-block",
                      match.donor.type === "NGO" && "bg-emerald-500/20 text-emerald-400",
                      match.donor.type === "Corporate" && "bg-cyan-500/20 text-cyan-400",
                      match.donor.type === "Individual" && "bg-amber-500/20 text-amber-400"
                    )}>
                      {match.donor.type}
                    </span>
                  </div>

                  {/* Recipient */}
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">To</span>
                    </div>
                    <p className="font-medium text-foreground">{match.recipient.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{match.recipient.department}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {match.items.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-white/10 text-sm text-foreground"
                    >
                      {item.quantity} {item.unit} {item.name}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecline(match.id)}
                    disabled={isDispatching}
                    className="flex-1 py-2.5 rounded-lg border border-white/20 text-foreground font-medium 
                      hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={() => handleDispatch(match.id)}
                    disabled={isDispatching}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg font-semibold transition-all",
                      "flex items-center justify-center gap-2",
                      match.recipient.urgency === "critical" 
                        ? "bg-red-500 text-white hover:bg-red-600" 
                        : "bg-primary text-primary-foreground hover:opacity-90",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isDispatching ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Dispatch
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {matches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold text-foreground mb-2">All caught up!</h4>
            <p className="text-muted-foreground">No pending matches. The AI is analyzing new opportunities.</p>
          </motion.div>
        )}
      </div>
    </GlassCard>
  )
}
