"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, TrendingUp, MapPin, Package } from "lucide-react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface HospitalZone {
  id: string
  name: string
  x: number
  y: number
  status: "critical" | "warning" | "stable" | "incoming"
  details: string
  metric: string
}

const hospitalZones: HospitalZone[] = [
  { id: "er", name: "Emergency", x: 20, y: 25, status: "critical", details: "PPE shortage", metric: "-85%" },
  { id: "icu", name: "ICU", x: 45, y: 20, status: "warning", details: "Staffing low", metric: "-30%" },
  { id: "ward-a", name: "Ward A", x: 70, y: 30, status: "stable", details: "Fully stocked", metric: "+100%" },
  { id: "ward-b", name: "Ward B", x: 25, y: 55, status: "incoming", details: "Donation incoming", metric: "+500 units" },
  { id: "or", name: "Operating Rooms", x: 55, y: 50, status: "warning", details: "Equipment maintenance", metric: "-15%" },
  { id: "ward-c", name: "Ward C", x: 75, y: 60, status: "critical", details: "Critical shortage", metric: "-92%" },
  { id: "pharmacy", name: "Pharmacy", x: 40, y: 75, status: "stable", details: "Stock optimal", metric: "+85%" },
  { id: "lab", name: "Laboratory", x: 65, y: 80, status: "incoming", details: "Supplies arriving", metric: "+200 units" },
]

const statusConfig = {
  critical: {
    color: "bg-red-500",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.6)]",
    text: "text-red-400",
    label: "Critical"
  },
  warning: {
    color: "bg-amber-500",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]",
    text: "text-amber-400",
    label: "Warning"
  },
  stable: {
    color: "bg-emerald-500",
    glow: "shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    text: "text-emerald-400",
    label: "Stable"
  },
  incoming: {
    color: "bg-cyan-500",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    text: "text-cyan-400",
    label: "Incoming"
  }
}

export function StrategicHeatmap() {
  const [selectedZone, setSelectedZone] = useState<HospitalZone | null>(null)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  const criticalCount = hospitalZones.filter(z => z.status === "critical").length
  const warningCount = hospitalZones.filter(z => z.status === "warning").length

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Strategic Heatmap</h3>
            <p className="text-sm text-muted-foreground">Real-time facility status</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">{criticalCount} Critical</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full">
              <span className="text-sm font-medium text-amber-400">{warningCount} Warning</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2 relative">
          <div className="aspect-[4/3] bg-white/5 rounded-xl border border-white/10 relative overflow-hidden">
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Zone Labels Background */}
            <div className="absolute inset-4 border border-white/10 rounded-lg bg-gradient-to-br from-white/5 to-transparent" />

            {/* Hospital Zones */}
            {hospitalZones.map((zone) => {
              const config = statusConfig[zone.status]
              const isHovered = hoveredZone === zone.id
              const isSelected = selectedZone?.id === zone.id

              return (
                <motion.button
                  key={zone.id}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2",
                    "flex flex-col items-center gap-1 z-10"
                  )}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  onClick={() => setSelectedZone(zone)}
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Pulse effect for critical/incoming */}
                  {(zone.status === "critical" || zone.status === "incoming") && (
                    <motion.div
                      className={cn(
                        "absolute w-8 h-8 rounded-full",
                        zone.status === "critical" ? "bg-red-500/30" : "bg-cyan-500/30"
                      )}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                  
                  {/* Marker */}
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 border-white/50 transition-all",
                    config.color,
                    config.glow,
                    (isHovered || isSelected) && "scale-125"
                  )} />
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm whitespace-nowrap",
                    config.text
                  )}>
                    {zone.name}
                  </span>
                </motion.button>
              )
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
              {Object.entries(statusConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", config.color)} />
                  <span className="text-xs text-muted-foreground">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          {selectedZone ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={cn(
                "p-4 rounded-xl border",
                statusConfig[selectedZone.status].text,
                "bg-white/5 border-white/10"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{selectedZone.name}</h4>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    selectedZone.status === "critical" && "bg-red-500/20 text-red-400",
                    selectedZone.status === "warning" && "bg-amber-500/20 text-amber-400",
                    selectedZone.status === "stable" && "bg-emerald-500/20 text-emerald-400",
                    selectedZone.status === "incoming" && "bg-cyan-500/20 text-cyan-400"
                  )}>
                    {statusConfig[selectedZone.status].label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{selectedZone.details}</p>
                <div className="flex items-center gap-2">
                  {selectedZone.status === "incoming" ? (
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Package className="w-4 h-4" />
                  )}
                  <span className={cn(
                    "font-bold",
                    selectedZone.metric.startsWith("+") ? "text-emerald-400" : "text-red-400"
                  )}>
                    {selectedZone.metric}
                  </span>
                </div>
              </div>

              {selectedZone.status === "critical" && (
                <button className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
                  Dispatch Emergency Resources
                </button>
              )}

              {selectedZone.status === "incoming" && (
                <button className="w-full py-3 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors">
                  Track Shipment
                </button>
              )}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-xl border border-white/10">
              <MapPin className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Select a zone on the map to view details</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/5 text-center">
              <span className="text-2xl font-bold text-foreground">8</span>
              <p className="text-xs text-muted-foreground">Active Zones</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 text-center">
              <span className="text-2xl font-bold text-emerald-400">4</span>
              <p className="text-xs text-muted-foreground">Fully Stocked</p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
