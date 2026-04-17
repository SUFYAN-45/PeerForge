"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { 
  Package, Plus, Trash2, Calendar, MapPin, Clock, 
  ChevronDown, Check, AlertCircle
} from "lucide-react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface InventoryItem {
  id: string
  category: string
  name: string
  quantity: number
  unit: string
  expiryDate: string
  condition: "new" | "good" | "fair"
}

const categories = [
  { id: "ppe", label: "PPE & Safety" },
  { id: "medical", label: "Medical Supplies" },
  { id: "equipment", label: "Equipment" },
  { id: "medication", label: "Medications" },
  { id: "other", label: "Other" }
]

const itemOptions: Record<string, string[]> = {
  ppe: ["N95 Masks", "Surgical Masks", "Face Shields", "Gowns", "Gloves", "Shoe Covers"],
  medical: ["IV Sets", "Syringes", "Bandages", "Catheters", "Gauze", "Sutures"],
  equipment: ["Oxygen Tanks", "Monitors", "Wheelchairs", "Beds", "Stretchers"],
  medication: ["Pain Relief", "Antibiotics", "Sedatives", "Insulin", "Vitamins"],
  other: ["Blankets", "Pillows", "Food Supplies", "Cleaning Supplies", "Hand Sanitizer"]
}

const conditions = [
  { id: "new", label: "New / Sealed", color: "emerald" },
  { id: "good", label: "Good Condition", color: "cyan" },
  { id: "fair", label: "Fair / Used", color: "amber" }
]

export function InventoryForm() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [currentItem, setCurrentItem] = useState<Partial<InventoryItem>>({
    category: "",
    name: "",
    quantity: 1,
    unit: "units",
    expiryDate: "",
    condition: "new"
  })
  const [pickupLocation, setPickupLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showItemDropdown, setShowItemDropdown] = useState(false)

  const addItem = () => {
    if (!currentItem.category || !currentItem.name || !currentItem.quantity) {
      toast.error("Please fill in all item details")
      return
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      category: currentItem.category!,
      name: currentItem.name!,
      quantity: currentItem.quantity!,
      unit: currentItem.unit || "units",
      expiryDate: currentItem.expiryDate || "",
      condition: currentItem.condition as "new" | "good" | "fair"
    }

    setItems([...items, newItem])
    setCurrentItem({
      category: currentItem.category,
      name: "",
      quantity: 1,
      unit: "units",
      expiryDate: "",
      condition: "new"
    })

    toast.success("Item added to donation list")
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Please add at least one item")
      return
    }

    if (!pickupLocation) {
      toast.error("Please enter a pickup location")
      return
    }

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast.success("Donation listed successfully!", {
      description: `${items.length} item(s) are now available for matching`
    })

    setItems([])
    setPickupLocation("")
    setPickupDate("")
    setNotes("")
    setIsSubmitting(false)
  }

  const selectedCategory = categories.find(c => c.id === currentItem.category)
  const availableItems = currentItem.category ? itemOptions[currentItem.category] : []

  return (
    <GlassCard>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
          <Package className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">List Donation</h3>
          <p className="text-sm text-muted-foreground">Add items you want to donate</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Item Form */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <h4 className="text-sm font-medium text-foreground">Add Item</h4>
          
          {/* Category Select */}
          <div className="relative">
            <label className="text-xs text-muted-foreground mb-1 block">Category</label>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-left flex items-center justify-between hover:bg-white/10 transition-colors"
            >
              <span className={selectedCategory ? "text-foreground" : "text-muted-foreground"}>
                {selectedCategory?.label || "Select category"}
              </span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showCategoryDropdown && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showCategoryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 w-full mt-1 bg-card border border-white/20 rounded-lg overflow-hidden shadow-xl"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCurrentItem({ ...currentItem, category: cat.id, name: "" })
                        setShowCategoryDropdown(false)
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors text-foreground"
                    >
                      {cat.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Item Select */}
          <div className="relative">
            <label className="text-xs text-muted-foreground mb-1 block">Item</label>
            <button
              type="button"
              onClick={() => currentItem.category && setShowItemDropdown(!showItemDropdown)}
              disabled={!currentItem.category}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-left flex items-center justify-between hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={currentItem.name ? "text-foreground" : "text-muted-foreground"}>
                {currentItem.name || "Select item"}
              </span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showItemDropdown && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showItemDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 w-full mt-1 bg-card border border-white/20 rounded-lg overflow-hidden shadow-xl max-h-48 overflow-y-auto"
                >
                  {availableItems.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCurrentItem({ ...currentItem, name: item })
                        setShowItemDropdown(false)
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors text-foreground"
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quantity and Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
              <input
                type="number"
                min={1}
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Expiry Date (optional)</label>
              <input
                type="date"
                value={currentItem.expiryDate}
                onChange={(e) => setCurrentItem({ ...currentItem, expiryDate: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Condition</label>
            <div className="grid grid-cols-3 gap-2">
              {conditions.map((cond) => (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => setCurrentItem({ ...currentItem, condition: cond.id as "new" | "good" | "fair" })}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                    currentItem.condition === cond.id
                      ? cond.color === "emerald" && "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10",
                    currentItem.condition === cond.id && cond.color === "cyan" && "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
                    currentItem.condition === cond.id && cond.color === "amber" && "bg-amber-500/20 border-amber-500/30 text-amber-400"
                  )}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="w-full py-2.5 rounded-lg bg-white/10 text-foreground font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to List
          </button>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Items to Donate ({items.length})</h4>
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      item.condition === "new" && "bg-emerald-400",
                      item.condition === "good" && "bg-cyan-400",
                      item.condition === "fair" && "bg-amber-400"
                    )} />
                    <div>
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">x{item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pickup Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Pickup Details</h4>
          
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter address or location name"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Preferred Pickup Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or details..."
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || items.length === 0}
          className={cn(
            "w-full py-3 rounded-lg font-semibold transition-all duration-200",
            "flex items-center justify-center gap-2",
            "bg-rose-500 text-white hover:bg-rose-600",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              List Donation
            </>
          )}
        </button>
      </div>
    </GlassCard>
  )
}
