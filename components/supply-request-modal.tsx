"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { X, Package, Plus, Minus, Send, AlertTriangle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SupplyRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

const supplyCategories = [
  { 
    id: "ppe", 
    label: "PPE", 
    items: ["N95 Masks", "Face Shields", "Gowns", "Gloves"] 
  },
  { 
    id: "medical", 
    label: "Medical Supplies", 
    items: ["IV Sets", "Syringes", "Bandages", "Catheters"] 
  },
  { 
    id: "equipment", 
    label: "Equipment", 
    items: ["Oxygen Tanks", "Monitors", "Ventilator Parts", "Defibrillator Pads"] 
  },
  { 
    id: "medication", 
    label: "Medications", 
    items: ["Pain Relief", "Antibiotics", "Sedatives", "Insulin"] 
  }
]

const urgencyLevels = [
  { id: "routine", label: "Routine", color: "emerald", description: "Within 48 hours" },
  { id: "urgent", label: "Urgent", color: "amber", description: "Within 12 hours" },
  { id: "critical", label: "Critical", color: "red", description: "Immediate need" }
]

interface RequestItem {
  category: string
  item: string
  quantity: number
}

export function SupplyRequestModal({ isOpen, onClose }: SupplyRequestModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(supplyCategories[0].id)
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [urgency, setUrgency] = useState("routine")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentCategory = supplyCategories.find(c => c.id === selectedCategory)

  const addItem = (item: string) => {
    const existing = requests.find(r => r.item === item && r.category === selectedCategory)
    if (existing) {
      setRequests(requests.map(r => 
        r.item === item && r.category === selectedCategory 
          ? { ...r, quantity: r.quantity + 1 } 
          : r
      ))
    } else {
      setRequests([...requests, { category: selectedCategory, item, quantity: 1 }])
    }
  }

  const updateQuantity = (item: string, category: string, delta: number) => {
    setRequests(requests.map(r => {
      if (r.item === item && r.category === category) {
        const newQty = r.quantity + delta
        return newQty > 0 ? { ...r, quantity: newQty } : r
      }
      return r
    }).filter(r => r.quantity > 0))
  }

  const removeItem = (item: string, category: string) => {
    setRequests(requests.filter(r => !(r.item === item && r.category === category)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (requests.length === 0) {
      toast.error("Please add at least one item to your request")
      return
    }

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const urgencyData = urgencyLevels.find(u => u.id === urgency)
    toast.success("Supply request submitted!", {
      description: `${requests.length} items requested with ${urgencyData?.label} priority`
    })
    
    setIsSubmitting(false)
    setRequests([])
    setNotes("")
    setUrgency("routine")
    onClose()
  }

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
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Request Supplies</h2>
                    <p className="text-sm text-muted-foreground">Quick ward supply request</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {supplyCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                          selectedCategory === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {currentCategory?.items.map((item) => {
                      const existing = requests.find(r => r.item === item && r.category === selectedCategory)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => addItem(item)}
                          className={cn(
                            "p-3 rounded-lg border text-left transition-all",
                            "flex items-center justify-between",
                            existing
                              ? "bg-primary/20 border-primary/30"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          )}
                        >
                          <span className="text-sm text-foreground">{item}</span>
                          {existing ? (
                            <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded">
                              x{existing.quantity}
                            </span>
                          ) : (
                            <Plus className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Selected Items */}
                  {requests.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground">Your Request</h3>
                      <div className="space-y-2">
                        {requests.map((req) => (
                          <div
                            key={`${req.category}-${req.item}`}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div>
                              <span className="text-sm text-foreground">{req.item}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({supplyCategories.find(c => c.id === req.category)?.label})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(req.item, req.category, -1)}
                                className="p-1 rounded hover:bg-white/10"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{req.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(req.item, req.category, 1)}
                                className="p-1 rounded hover:bg-white/10"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(req.item, req.category)}
                                className="p-1 rounded hover:bg-red-500/20 text-red-400 ml-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Urgency */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground">Urgency Level</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {urgencyLevels.map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setUrgency(level.id)}
                          className={cn(
                            "p-3 rounded-lg border text-center transition-all",
                            urgency === level.id
                              ? level.color === "emerald" && "bg-emerald-500/20 border-emerald-500/30"
                              : "bg-white/5 border-white/10 hover:bg-white/10",
                            urgency === level.id && level.color === "amber" && "bg-amber-500/20 border-amber-500/30",
                            urgency === level.id && level.color === "red" && "bg-red-500/20 border-red-500/30"
                          )}
                        >
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {level.color === "red" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                            {level.color === "amber" && <Clock className="w-4 h-4 text-amber-400" />}
                            <span className={cn(
                              "text-sm font-medium",
                              level.color === "emerald" && "text-emerald-400",
                              level.color === "amber" && "text-amber-400",
                              level.color === "red" && "text-red-400"
                            )}>
                              {level.label}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{level.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Additional Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific requirements or delivery instructions..."
                      rows={2}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                        text-foreground placeholder:text-muted-foreground
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 
                        transition-all resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || requests.length === 0}
                    className={cn(
                      "w-full py-3 rounded-lg font-semibold transition-all duration-200",
                      "flex items-center justify-center gap-2",
                      "bg-primary text-primary-foreground",
                      "hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Request ({requests.reduce((acc, r) => acc + r.quantity, 0)} items)
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
