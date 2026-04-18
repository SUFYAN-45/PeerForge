"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import {
  Heart, Package, Pill, DollarSign, MessageSquare,
  Send, Sparkles, ChevronDown
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { submitDonation } from "@/app/actions"

const donationTypes = [
  { id: "PPE",         label: "PPE & Protective Gear",   icon: Package },
  { id: "Medications", label: "Medications & Supplies",   icon: Pill    },
  { id: "Equipment",   label: "Medical Equipment",        icon: Heart   },
  { id: "Financial",   label: "Financial Contribution",   icon: DollarSign },
]

export function DonationForm() {
  const [donationType, setDonationType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!donationType || !quantity) {
      toast.error("Please fill in all required fields")
      return
    }

    startTransition(async () => {
      try {
        await submitDonation(donationType, quantity, message)
        setIsSuccess(true)
        toast.success("Donation submitted! 🎉", {
          description: "Thank you for your generosity. Your contribution will save lives.",
        })
        // Reset after delay
        setTimeout(() => {
          setIsSuccess(false)
          setDonationType("")
          setQuantity("")
          setMessage("")
        }, 3000)
      } catch (err) {
        toast.error("Failed to submit donation", {
          description: "Please try again or contact support.",
        })
      }
    })
  }

  return (
    <GlassCard className="p-0 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-rose-500/10 to-pink-500/5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <Heart className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">Make a Donation</h3>
            <p className="text-xs text-muted-foreground">Every contribution protects a frontline worker</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Donation Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Donation Type <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {donationTypes.map((type) => {
              const Icon = type.icon
              const isSelected = donationType === type.id
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setDonationType(type.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-2.5",
                    isSelected
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isSelected && "text-rose-400")} />
                  <span className="text-xs font-medium leading-snug">{type.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Amount / Quantity */}
        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium text-foreground">
            Amount / Quantity <span className="text-rose-400">*</span>
          </label>
          <input
            id="quantity"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={donationType === "Financial" ? "e.g. $500 USD" : "e.g. 200 units, 50 boxes"}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white/5 text-foreground text-sm",
              "placeholder:text-muted-foreground",
              "border-white/10 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20",
              "outline-none transition-all"
            )}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="donation-message" className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
            Message <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <textarea
            id="donation-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message for the recipients..."
            rows={3}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white/5 text-foreground text-sm resize-none",
              "placeholder:text-muted-foreground",
              "border-white/10 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20",
              "outline-none transition-all"
            )}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isPending || isSuccess || !donationType || !quantity}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300",
            "flex items-center justify-center gap-2",
            isSuccess
              ? "bg-emerald-500 text-white"
              : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-400 hover:to-pink-400",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-rose-500/20"
          )}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : isSuccess ? (
            <>
              <Sparkles className="w-4 h-4" />
              Donation Submitted!
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Donation
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-muted-foreground">
          Your donation will be matched with the highest-priority medical facility in the network.
        </p>
      </form>
    </GlassCard>
  )
}
