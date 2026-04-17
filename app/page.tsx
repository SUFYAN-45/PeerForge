"use client"

import { motion } from "framer-motion"
import { Activity, Building2, Heart, ArrowRight, Shield, Sparkles, Users, TrendingUp } from "lucide-react"
import { GlobalMeshBackground } from "@/components/global-mesh-background"
import { GlassCard } from "@/components/glass-card"
import { Shield3D } from "@/components/shield-3d"
import { CrisisProvider, useCrisis } from "@/lib/crisis-context"
import { cn } from "@/lib/utils"
import { SignInButton, Show, UserButton } from "@clerk/nextjs"
import Link from "next/link"

const stats = [
  { label: "Healthcare Workers Protected", value: "12,847", icon: Users },
  { label: "Resources Matched", value: "45,231", icon: TrendingUp },
  { label: "Critical Shortages Resolved", value: "2,156", icon: Sparkles },
]

const entryCards = [
  {
    id: "frontline",
    title: "Healthcare Frontline",
    description: "Nurses, doctors, and medical staff on the front lines",
    icon: Activity,
    color: "emerald",
    features: ["Daily wellness check-ins", "Anonymous reporting", "Supply requests"]
  },
  {
    id: "command",
    title: "Hospital Command",
    description: "Administrators managing resources and coordination",
    icon: Building2,
    color: "cyan",
    features: ["Real-time heatmaps", "Smart resource matching", "KPI analytics"]
  },
  {
    id: "benefactor",
    title: "Donor Network",
    description: "NGOs, donors, and suppliers providing resources",
    icon: Heart,
    color: "rose",
    features: ["Inventory management", "Impact tracking", "Gamified leaderboards"]
  }
]

function LandingContent() {
  const { isHighBurnout } = useCrisis()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GlobalMeshBackground isHighBurnout={isHighBurnout} />
      
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-bold text-xl text-foreground">RescueShield</span>
            </div>
            <div className="flex items-center gap-4">
              <Show when="signed-in">
                <Link 
                  href="/onboarding"
                  className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-medium transition-all"
                >
                  Enter Dashboard
                </Link>
                <div className="ml-2 w-8 h-8 rounded-full ring-2 ring-white/10 flex items-center justify-center overflow-hidden">
                  <UserButton />
                </div>
              </Show>
              <Show when="signed-out">
                <SignInButton fallbackRedirectUrl="/onboarding" signUpFallbackRedirectUrl="/onboarding">
                  <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-foreground font-medium transition-all">
                    Sign In
                  </button>
                </SignInButton>
              </Show>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* 3D Shield */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <Shield3D size={140} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance"
            >
              Protecting the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Protectors
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
            >
              A mission-critical platform connecting healthcare workers with resources, 
              tracking burnout, and coordinating support in real-time.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <GlassCard
                    key={stat.label}
                    className="p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Icon className="w-5 h-5 text-emerald-400" />
                      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </GlassCard>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Entry Cards Section */}
      <section className="relative z-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground">Choose Your Access</h2>
            <p className="text-muted-foreground mt-2">Select your role to enter Mission Control</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entryCards.map((card, index) => {
              const Icon = card.icon
              
              const CardContent = (
                <GlassCard
                  className={cn(
                    "h-full cursor-pointer group text-left",
                    "hover:scale-[1.02] transition-transform duration-300"
                  )}
                  glowColor={card.color as "emerald" | "red" | "cyan"}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                    card.color === "emerald" && "bg-emerald-500/20",
                    card.color === "cyan" && "bg-cyan-500/20",
                    card.color === "rose" && "bg-rose-500/20"
                  )}>
                    <Icon className={cn(
                      "w-7 h-7",
                      card.color === "emerald" && "text-emerald-400",
                      card.color === "cyan" && "text-cyan-400",
                      card.color === "rose" && "text-rose-400"
                    )} />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{card.description}</p>

                  <ul className="space-y-2 mb-6">
                    {card.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className={cn(
                    "flex items-center gap-2 font-medium transition-colors",
                    card.color === "emerald" && "text-emerald-400",
                    card.color === "cyan" && "text-cyan-400",
                    card.color === "rose" && "text-rose-400"
                  )}>
                    Enter Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              )

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Show when="signed-in">
                    <Link href="/onboarding" className="block h-full w-full">
                      {CardContent}
                    </Link>
                  </Show>
                  <Show when="signed-out">
                    <SignInButton fallbackRedirectUrl="/onboarding" signUpFallbackRedirectUrl="/onboarding">
                      <button className="block h-full w-full text-left">
                        {CardContent}
                      </button>
                    </SignInButton>
                  </Show>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-muted-foreground">
                RescueShield - Mission Control Platform
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with care for those who care for us
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function LandingPage() {
  return (
    <CrisisProvider>
      <LandingContent />
    </CrisisProvider>
  )
}
