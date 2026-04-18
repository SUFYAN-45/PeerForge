"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { getPulseMapData, type PulseMapMarker } from "@/app/actions"
import { GlassCard } from "./glass-card"
import { Activity, MapPin, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

// Dynamically import the map primitives to avoid SSR window errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import("react-leaflet").then((m) => m.Tooltip),
  { ssr: false }
)

function getMarkerColor(avgStress: number): string {
  if (avgStress <= 40) return "#34d399" // emerald
  if (avgStress <= 70) return "#fbbf24" // amber
  return "#f87171"                       // red
}

function getStressLabel(avgStress: number): string {
  if (avgStress <= 40) return "Low Stress"
  if (avgStress <= 70) return "Moderate"
  return "High Stress"
}

interface LeafletMapProps {
  markers: PulseMapMarker[]
}

function LeafletMap({ markers }: LeafletMapProps) {
  return (
    <MapContainer
      center={[51.505, -0.088]}
      zoom={14}
      style={{ height: "100%", width: "100%", background: "transparent" }}
      className="rounded-xl z-0"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker) => {
        const color = getMarkerColor(marker.avg_stress)
        return (
          <CircleMarker
            key={marker.ward_id}
            center={[marker.lat, marker.lng]}
            radius={14}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.85,
              color: color,
              weight: 2,
              opacity: 0.6,
            }}
          >
            <Tooltip permanent={false} direction="top">
              <div className="text-xs font-semibold">
                <p className="font-bold">{marker.ward_id}</p>
                <p>Avg Stress: {marker.avg_stress}%</p>
                <p>{marker.report_count} check-ins</p>
              </div>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}

export function PulseMap() {
  const [markers, setMarkers] = useState<PulseMapMarker[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getPulseMapData()
      .then(setMarkers)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <GlassCard className="p-0 overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Pulse Map</h3>
            <p className="text-xs text-muted-foreground">Live ward stress heatmap</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-72 lg:h-80">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground">Loading map data...</p>
            </div>
          </div>
        ) : (
          <LeafletMap markers={markers} />
        )}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-white/10 flex items-center gap-6 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Stress Level:</span>
        {[
          { color: "bg-emerald-400", label: "Low (≤40%)" },
          { color: "bg-amber-400",   label: "Moderate (41–70%)" },
          { color: "bg-red-400",     label: "High (>70%)" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded-full", color)} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
