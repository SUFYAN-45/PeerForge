"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Activity, Building2, Heart, ArrowRight, Mail, Lock, User } from "lucide-react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

type Role = "frontline" | "command" | "benefactor"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRole?: Role
}

const roles = [
  {
    id: "frontline" as Role,
    title: "Healthcare Frontline",
    description: "Nurses, doctors, and medical staff",
    icon: Activity,
    color: "emerald",
    href: "/frontline"
  },
  {
    id: "command" as Role,
    title: "Hospital Command",
    description: "Administrators and coordinators",
    icon: Building2,
    color: "cyan",
    href: "/command"
  },
  {
    id: "benefactor" as Role,
    title: "Donor Network",
    description: "NGOs, donors, and suppliers",
    icon: Heart,
    color: "rose",
    href: "/benefactor"
  }
]

export function LoginModal({ isOpen, onClose, selectedRole }: LoginModalProps) {
  const [step, setStep] = useState<"select" | "login">(selectedRole ? "login" : "select")
  const [role, setRole] = useState<Role | null>(selectedRole || null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole)
    setStep("login")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return

    setIsLoading(true)
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const selectedRoleData = roles.find(r => r.id === role)
    if (selectedRoleData) {
      router.push(selectedRoleData.href)
    }
    setIsLoading(false)
    onClose()
  }

  const handleBack = () => {
    setStep("select")
    setRole(null)
  }

  const selectedRoleData = roles.find(r => r.id === role)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <GlassCard 
              className="w-full max-w-md relative overflow-hidden"
              hover={false}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {step === "select" ? (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
                      <p className="text-muted-foreground mt-2">Select your access level to continue</p>
                    </div>

                    <div className="space-y-3">
                      {roles.map((r) => {
                        const Icon = r.icon
                        return (
                          <button
                            key={r.id}
                            onClick={() => handleRoleSelect(r.id)}
                            className={cn(
                              "w-full p-4 rounded-xl border border-white/10 text-left",
                              "hover:bg-white/10 hover:border-white/20 transition-all duration-200",
                              "flex items-center gap-4 group"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center",
                              r.color === "emerald" && "bg-emerald-500/20",
                              r.color === "cyan" && "bg-cyan-500/20",
                              r.color === "rose" && "bg-rose-500/20"
                            )}>
                              <Icon className={cn(
                                "w-6 h-6",
                                r.color === "emerald" && "text-emerald-400",
                                r.color === "cyan" && "text-cyan-400",
                                r.color === "rose" && "text-rose-400"
                              )} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{r.title}</h3>
                              <p className="text-sm text-muted-foreground">{r.description}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleBack}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      {selectedRoleData && (
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            selectedRoleData.color === "emerald" && "bg-emerald-500/20",
                            selectedRoleData.color === "cyan" && "bg-cyan-500/20",
                            selectedRoleData.color === "rose" && "bg-rose-500/20"
                          )}>
                            <selectedRoleData.icon className={cn(
                              "w-5 h-5",
                              selectedRoleData.color === "emerald" && "text-emerald-400",
                              selectedRoleData.color === "cyan" && "text-cyan-400",
                              selectedRoleData.color === "rose" && "text-rose-400"
                            )} />
                          </div>
                          <div>
                            <h2 className="font-semibold text-foreground">{selectedRoleData.title}</h2>
                            <p className="text-xs text-muted-foreground">Sign in to continue</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Dr. Sarah Chen"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sarah@hospital.org"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "w-full py-3 rounded-lg font-semibold transition-all duration-200",
                          "bg-primary text-primary-foreground hover:opacity-90",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "flex items-center justify-center gap-2"
                        )}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <>
                            Enter Mission Control
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                      Demo mode: Enter any credentials to continue
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
