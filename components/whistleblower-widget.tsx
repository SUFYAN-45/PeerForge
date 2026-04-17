"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { 
  Shield, AlertTriangle, Eye, EyeOff, Send, Trash2, 
  Lock, Clock, MapPin, Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { submitWhistleblowerReport } from "@/app/actions"
import { GlassCard } from "./glass-card"

const issueTypes = [
  { id: "safety", label: "Patient Safety Concern", icon: AlertTriangle },
  { id: "staffing", label: "Unsafe Staffing Levels", icon: Users },
  { id: "equipment", label: "Equipment Failure", icon: Shield },
  { id: "protocol", label: "Protocol Violation", icon: Clock },
  { id: "other", label: "Other Concern", icon: MapPin }
]

export function WhistleblowerWidget() {
  const [issueType, setIssueType] = useState("")
  const [description, setDescription] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selfDestructing, setSelfDestructing] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueType || !description) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    
    try {
      const typeLabel = issueTypes.find(t => t.id === issueType)?.label || issueType
      await submitWhistleblowerReport(`Type: ${typeLabel}\n\nDescription: ${description}`)
      
      toast.success("Report submitted securely", {
        description: "Your identity is protected. Thank you for speaking up."
      })
      
      handleReset()
    } catch (error) {
      toast.error("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelfDestruct = () => {
    setSelfDestructing(true)
    let count = 5
    
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      
      if (count <= 0) {
        clearInterval(interval)
        setDescription("")
        setIssueType("")
        setSelfDestructing(false)
        setCountdown(5)
        toast.success("Form data erased", {
          description: "All entered information has been permanently deleted."
        })
      }
    }, 1000)
  }

  const handleReset = () => {
    setDescription("")
    setIssueType("")
    setIsAnonymous(true)
  }

  return (
    <GlassCard className="relative overflow-hidden w-full h-full p-0 flex flex-col">
      {/* Incognito Header */}
      <div className="bg-black/20 px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Secure Report</h2>
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <Lock className="w-3 h-3" />
              <span>End-to-end encrypted whistleblower portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
        {/* Anonymous Toggle */}
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={cn(
            "w-full p-4 rounded-xl border transition-all duration-200",
            "flex items-center justify-between",
            isAnonymous 
              ? "bg-amber-500/10 border-amber-500/30" 
              : "bg-white/5 border-white/10"
          )}
        >
          <div className="flex items-center gap-3">
            {isAnonymous ? (
              <EyeOff className="w-5 h-5 text-amber-400" />
            ) : (
              <Eye className="w-5 h-5 text-white/60" />
            )}
            <div className="text-left">
              <span className="font-medium text-foreground block">
                {isAnonymous ? "Anonymous Mode" : "Identified Mode"}
              </span>
              <span className="text-xs text-muted-foreground">
                {isAnonymous 
                  ? "Your identity will be fully protected" 
                  : "Include your credentials for follow-up"}
              </span>
            </div>
          </div>
          <div className={cn(
            "w-12 h-6 rounded-full p-1 transition-colors",
            isAnonymous ? "bg-amber-500" : "bg-white/20"
          )}>
            <motion.div
              className="w-4 h-4 bg-white rounded-full"
              animate={{ x: isAnonymous ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </button>

        {/* Issue Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Issue Type</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {issueTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setIssueType(type.id)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    "flex items-center gap-2",
                    issueType === type.id
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm truncate">{type.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail. Include dates, locations, and any relevant context..."
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
              text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 
              transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleSelfDestruct}
            disabled={selfDestructing || (!description && !issueType)}
            className={cn(
              "flex-1 py-3 rounded-lg font-medium transition-all duration-200",
              "flex items-center justify-center gap-2",
              "bg-red-500/20 text-red-400 border border-red-500/30",
              "hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Trash2 className="w-5 h-5" />
            {selfDestructing ? `Erasing... ${countdown}s` : "Self-Destruct"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !issueType || !description}
            className={cn(
              "flex-1 py-3 rounded-lg font-semibold transition-all duration-200",
              "flex items-center justify-center gap-2",
              "bg-amber-500 text-black",
              "hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Reports are encrypted and stored securely. 
          Anonymous reports cannot be traced back to you.
        </p>
      </form>
    </GlassCard>
  )
}
