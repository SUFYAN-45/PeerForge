"use server"

import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { clerkClient } from "@clerk/nextjs/server"

// ─── Role Management ──────────────────────────────────────────────────────────

export async function setUserRole(role: "frontline" | "command" | "benefactor") {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, { publicMetadata: { role } })
  return { success: true }
}

// ─── Daily Pulse ──────────────────────────────────────────────────────────────

export async function submitDailyPulse(mood: number, stress: number, sleep: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized: Must be logged in to submit a daily pulse.")
  const { error } = await supabase.from("daily_pulse").insert([{
    clerk_user_id: userId,
    mood_score: mood * 20,
    stress_score: stress * 20,
    sleep_score: sleep * 20,
  }])
  if (error) { console.error("Supabase Error [Daily Pulse]:", error); throw new Error("Failed to submit daily pulse") }
  return { success: true }
}

// ─── Whistleblower ────────────────────────────────────────────────────────────

export async function submitWhistleblowerReport(reportText: string, wardId?: string) {
  const { error } = await supabase.from("whistleblower_reports").insert([{
    report_text: reportText,
    ward_id: wardId || null,
  }])
  if (error) { console.error("Supabase Error [Whistleblower]:", error); throw new Error("Failed to submit anonymous report") }
  return { success: true }
}

// ─── Command Center ────────────────────────────────────────────────────────────

export async function getWhistleblowerCount(): Promise<number> {
  const { count, error } = await supabase
    .from("whistleblower_reports")
    .select("*", { count: "exact", head: true })
  if (error) { console.error("Supabase Error [WB Count]:", error); return 0 }
  return count ?? 0
}

export interface PulseMapMarker {
  ward_id: string
  lat: number
  lng: number
  avg_stress: number
  report_count: number
}

const WARD_COORDS: Record<string, { lat: number; lng: number }> = {
  "ICU":        { lat: 51.505,  lng: -0.09  },
  "Emergency":  { lat: 51.508,  lng: -0.094 },
  "Pediatrics": { lat: 51.502,  lng: -0.085 },
  "Oncology":   { lat: 51.499,  lng: -0.079 },
  "Surgery":    { lat: 51.512,  lng: -0.1   },
}

export async function getPulseMapData(): Promise<PulseMapMarker[]> {
  const demoData = Object.entries(WARD_COORDS).map(([ward, coords], i) => ({
    ward_id: ward, ...coords,
    avg_stress: [35, 68, 82, 45, 55][i],
    report_count: [12, 8, 5, 15, 9][i],
  }))
  const { data, error } = await supabase.from("daily_pulse").select("stress_score")
  if (error || !data || data.length === 0) return demoData
  return demoData
}

// ─── Donations ────────────────────────────────────────────────────────────────

export async function submitDonation(
  donation_type: string,
  amount_or_quantity: string,
  message: string
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized: Must be logged in to submit a donation.")

  const { error } = await supabase.from("donations").insert([{
    clerk_user_id: userId,
    donation_type,
    amount_or_quantity,
    message: message || null,
  }])

  if (error) {
    console.error("Supabase Error [Donation]:", error)
    throw new Error("Failed to submit donation")
  }

  return { success: true }
}
