"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function submitDailyPulse(mood: number, stress: number, sleep: number) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized: Must be logged in to submit a daily pulse.");
  }

  // Multiply by 20 to map the 1-5 slider values to the 0-100 check constraint
  const { error } = await supabase
    .from("daily_pulse")
    .insert([
      {
        clerk_user_id: userId,
        mood_score: mood * 20,
        stress_score: stress * 20,
        sleep_score: sleep * 20,
      }
    ]);

  if (error) {
    console.error("Supabase Error [Daily Pulse]:", error);
    throw new Error("Failed to submit daily pulse");
  }

  return { success: true };
}

export async function submitWhistleblowerReport(reportText: string, wardId?: string) {
  // Explicitly NOT grabbing the userId to maintain anonymity
  
  const { error } = await supabase
    .from("whistleblower_reports")
    .insert([
      {
        report_text: reportText,
        ward_id: wardId || null,
      }
    ]);

  if (error) {
    console.error("Supabase Error [Whistleblower]:", error);
    throw new Error("Failed to submit anonymous report");
  }

  return { success: true };
}
