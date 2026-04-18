"use client"

import { motion } from "framer-motion"
import { Activity, Building2, Heart, ArrowRight, Shield, Lock, ChevronRight } from "lucide-react"
import { GlobalMeshBackground } from "@/components/global-mesh-background"
import { CrisisProvider, useCrisis } from "@/lib/crisis-context"
import { cn } from "@/lib/utils"
import { SignInButton, Show, UserButton, useUser } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

// ─── Data ─────────────────────────────────────────────────────────────────────

const portalCards = [
  {
    id: "frontline",
    title: "Healthcare Frontline",
    description: "Daily wellness check-ins, anonymous reporting, and supply requests for nurses and doctors on the front lines.",
    icon: Activity,
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    accent: "text-emerald-400",
    badge: "For Clinical Staff",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    features: ["Daily Pulse check-ins", "Anonymous whistleblower", "Supply requests"],
  },
  {
    id: "command",
    title: "Hospital Command",
    description: "Real-time stress heatmaps, smart resource matching, and KPI analytics for hospital administrators.",
    icon: Building2,
    gradient: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    accent: "text-cyan-400",
    badge: "For Administrators",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    features: ["Live Pulse Map", "Smart resource match", "KPI analytics"],
  },
  {
    id: "benefactor",
    title: "Donor Network",
    description: "Donate supplies, track your impact, and compete on the leaderboard as an NGO, donor, or supplier.",
    icon: Heart,
    gradient: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/20 hover:border-rose-500/40",
    accent: "text-rose-400",
    badge: "For Donors & NGOs",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    features: ["Donation management", "Impact tracking", "Gamified leaderboard"],
  },
]

const stats = [
  { value: "12,847", label: "Healthcare Workers", suffix: "+" },
  { value: "45,231", label: "Resources Matched",  suffix: "+" },
  { value: "2,156",  label: "Crises Resolved",    suffix: ""  },
  { value: "98.4",   label: "Match Accuracy",     suffix: "%"  },
]

// ─── Landing content ──────────────────────────────────────────────────────────

function LandingContent() {
  const { isHighBurnout } = useCrisis()
  const { user } = useUser()

  const userRole =
    (user?.publicMetadata?.role as string) ||
    (user?.unsafeMetadata?.role as string) ||
    null

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  })

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background">
      <GlobalMeshBackground isHighBurnout={isHighBurnout} />

      {/* ── Nav ── */}
      <header className="relative z-20 border-b border-white/[0.06] backdrop-blur-xl bg-background/60 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">RescueShield</span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Show when="signed-in">
              <Link
                href={userRole ? `/${userRole}` : "/onboarding"}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 text-sm font-medium transition-all"
              >
                Enter Dashboard
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <div className="w-8 h-8 rounded-full ring-2 ring-white/10 overflow-hidden">
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <SignInButton fallbackRedirectUrl="/onboarding" signUpFallbackRedirectUrl="/onboarding">
                <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-foreground text-sm font-medium transition-all">
                  Sign In
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <motion.div {...fadeUp(0)} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Mission Control — Live
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.08)} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.08] tracking-tight text-balance">
            Protecting the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Protectors
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p {...fadeUp(0.16)} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            A mission-critical platform connecting healthcare workers with resources,
            tracking burnout in real-time, and coordinating life-saving support.
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(0.24)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Show when="signed-out">
              <SignInButton fallbackRedirectUrl="/onboarding" signUpFallbackRedirectUrl="/onboarding">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-base shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link
                href={userRole ? `/${userRole}` : "/onboarding"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-base shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
              >
                Enter Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Show>
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/15 text-foreground font-semibold text-base transition-all">
              Watch Demo
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div {...fadeUp(0.32)} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.08]">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-background/60 backdrop-blur-sm px-6 py-5 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.value}<span className="text-emerald-400">{stat.suffix}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Portal Cards ── */}
      <section className="relative z-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0.36)} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Choose Your Portal</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-lg mx-auto">
              Select your role to enter Mission Control. Access is secured to your assigned portal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portalCards.map((card, index) => {
              const Icon = card.icon
              const isLocked  = !!userRole && userRole !== card.id
              const isDirect  = !!userRole && userRole === card.id
              const isSignedOut = !user

              const inner = (
                <motion.div
                  {...fadeUp(0.40 + index * 0.08)}
                  whileHover={!isLocked ? { y: -4, transition: { duration: 0.2 } } : undefined}
                  className={cn(
                    "relative h-full rounded-2xl border p-6 transition-all duration-300",
                    "bg-gradient-to-br",
                    card.gradient,
                    isLocked ? "border-white/10 opacity-55 grayscale cursor-not-allowed" : card.border,
                    !isLocked && "cursor-pointer"
                  )}
                >
                  {/* Locked overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/30 backdrop-blur-[2px] z-10 gap-2">
                      <Lock className="w-7 h-7 text-white/40" />
                      <span className="text-xs text-white/40 font-medium">Access Restricted</span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="mb-5 flex items-center justify-between">
                    <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border", card.badgeBg)}>
                      {card.badge}
                    </span>
                    {isDirect && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/15 text-foreground">
                        Your Portal
                      </span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br", card.gradient, "border border-white/10")}>
                    <Icon className={cn("w-6 h-6", card.accent)} />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{card.description}</p>

                  <ul className="space-y-2 mb-6">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", card.accent.replace("text-", "bg-"))} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className={cn("flex items-center gap-1.5 font-semibold text-sm", card.accent)}>
                    {isDirect ? "Enter Dashboard" : isSignedOut ? "Sign In to Access" : "Learn More"}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              )

              if (isLocked) return <div key={card.id}>{inner}</div>
              if (isDirect)  return <Link key={card.id} href={`/${card.id}`} className="block h-full">{inner}</Link>
              // signed out
              return (
                <Show key={card.id} when="signed-out">
                  <SignInButton fallbackRedirectUrl="/onboarding" signUpFallbackRedirectUrl="/onboarding">
                    <button className="block w-full h-full text-left">{inner}</button>
                  </SignInButton>
                </Show>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-muted-foreground font-medium">RescueShield — Mission Control Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">Built with care for those who care for us</p>
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
