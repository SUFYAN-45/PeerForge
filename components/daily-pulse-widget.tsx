"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Activity, Moon, Brain, Check, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface SliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  icon: React.ElementType
  color: string
  labels: string[]
}

function PulseSlider({ label, value, onChange, icon: Icon, color, labels }: SliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-5 h-5", color)} />
          <span className="font-medium text-foreground">{label}</span>
        </div>
        <span className={cn("text-sm font-medium", color)}>
          {labels[value - 1]}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={1}
          max={5}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={cn(
                "w-1 h-1 rounded-full",
                n <= value ? "bg-primary" : "bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface BurnoutGaugeProps {
  risk: number // 0-100
  animate?: boolean
}

function BurnoutGauge({ risk, animate = false }: BurnoutGaugeProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (risk / 100) * circumference * 0.75

  const getRiskColor = (risk: number) => {
    if (risk < 30) return { color: "text-emerald-400", bg: "stroke-emerald-400", label: "Low Risk" }
    if (risk < 60) return { color: "text-yellow-400", bg: "stroke-yellow-400", label: "Moderate" }
    if (risk < 80) return { color: "text-orange-400", bg: "stroke-orange-400", label: "Elevated" }
    return { color: "text-red-400", bg: "stroke-red-400", label: "High Risk" }
  }

  const riskData = getRiskColor(risk)
  const TrendIcon = risk > 60 ? TrendingUp : risk > 40 ? Minus : TrendingDown

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-135" viewBox="0 0 100 100">
          {/* Background arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-white/10"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          />
          {/* Progress arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={riskData.bg}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animate ? strokeDashoffset : circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("text-3xl font-bold", riskData.color)}
            initial={{ opacity: 0 }}
            animate={{ opacity: animate ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            {risk}%
          </motion.span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <TrendIcon className={cn("w-4 h-4", riskData.color)} />
        <span className={cn("text-sm font-medium", riskData.color)}>{riskData.label}</span>
      </div>
    </div>
  )
}

interface DailyPulseWidgetProps {
  onBurnoutChange?: (risk: number) => void
}

export function DailyPulseWidget({ onBurnoutChange }: DailyPulseWidgetProps) {
  const [mood, setMood] = useState(3)
  const [stress, setStress] = useState(3)
  const [sleep, setSleep] = useState(3)
  const [submitted, setSubmitted] = useState(false)
  const [burnoutRisk, setBurnoutRisk] = useState(0)

  const calculateBurnoutRisk = () => {
    // Simple algorithm: invert mood and sleep (higher is better), use stress directly
    const moodFactor = (5 - mood) * 20 // 0-80
    const stressFactor = stress * 15 // 15-75
    const sleepFactor = (5 - sleep) * 15 // 0-60
    
    const risk = Math.min(100, Math.max(0, (moodFactor + stressFactor + sleepFactor) / 2.15))
    return Math.round(risk)
  }

  const handleSubmit = () => {
    const risk = calculateBurnoutRisk()
    setBurnoutRisk(risk)
    setSubmitted(true)
    onBurnoutChange?.(risk)
    
    toast.success("Daily pulse recorded!", {
      description: `Your burnout risk has been assessed at ${risk}%`
    })
  }

  const handleReset = () => {
    setSubmitted(false)
    setMood(3)
    setStress(3)
    setSleep(3)
    setBurnoutRisk(0)
  }

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Daily Pulse Check-in</h3>
          <p className="text-sm text-muted-foreground">How are you feeling today?</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <PulseSlider
              label="Mood"
              value={mood}
              onChange={setMood}
              icon={Activity}
              color="text-emerald-400"
              labels={["Very Low", "Low", "Neutral", "Good", "Excellent"]}
            />
            <PulseSlider
              label="Stress Level"
              value={stress}
              onChange={setStress}
              icon={Brain}
              color="text-amber-400"
              labels={["Minimal", "Low", "Moderate", "High", "Severe"]}
            />
            <PulseSlider
              label="Sleep Quality"
              value={sleep}
              onChange={setSleep}
              icon={Moon}
              color="text-cyan-400"
              labels={["Poor", "Fair", "Average", "Good", "Excellent"]}
            />

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Submit Check-in
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h4 className="font-medium text-foreground mb-4">Burnout Risk Assessment</h4>
              <BurnoutGauge risk={burnoutRisk} animate={true} />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-white/5">
                <Activity className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                <span className="text-xs text-muted-foreground">Mood</span>
                <p className="font-medium text-foreground">{mood}/5</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <Brain className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <span className="text-xs text-muted-foreground">Stress</span>
                <p className="font-medium text-foreground">{stress}/5</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <Moon className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
                <span className="text-xs text-muted-foreground">Sleep</span>
                <p className="font-medium text-foreground">{sleep}/5</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-lg bg-white/10 text-foreground font-medium hover:bg-white/15 transition-colors"
            >
              Update Check-in
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
