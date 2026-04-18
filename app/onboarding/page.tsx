"use client";

import { useEffect, useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Activity, Building2, Heart, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { cn } from "@/lib/utils";
import { GlobalMeshBackground } from "@/components/global-mesh-background";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { setUserRole } from "@/app/actions";

const roles = [
  {
    id: "frontline",
    title: "Healthcare Frontline",
    description: "Nurses, doctors, and medical staff",
    icon: Activity,
    color: "emerald",
  },
  {
    id: "command",
    title: "Hospital Command",
    description: "Administrators and coordinators",
    icon: Building2,
    color: "cyan",
  },
  {
    id: "benefactor",
    title: "Donor Network",
    description: "NGOs, donors, and suppliers",
    icon: Heart,
    color: "rose",
  },
] as const;

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isLoaded && user) {
      // Check publicMetadata first (new), then fall back to unsafeMetadata (legacy)
      const role =
        (user.publicMetadata?.role as string) ||
        (user.unsafeMetadata?.role as string);
      if (role) {
        router.push(`/${role}`);
      }
    } else if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    startTransition(async () => {
      try {
        await setUserRole(role as "frontline" | "command" | "benefactor");
        // Reload user to pick up updated publicMetadata
        await user?.reload();
        toast.success(`Role set to ${role}`, {
          description: "Routing you to your dashboard…",
        });
        router.push(`/${role}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to set role. Please try again.");
        setSelectedRole(null);
      }
    });
  };

  const isUpdating = isPending;

  if (!isLoaded || !user || user.publicMetadata?.role || user.unsafeMetadata?.role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Initializing Mission Parameters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <GlobalMeshBackground isHighBurnout={false} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-lg mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Welcome to RescueShield
          </h1>
          <p className="text-lg text-muted-foreground">
            Please select your operational role to enter Mission Control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          {roles.map((r, i) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard
                  onClick={() => !isUpdating && handleRoleSelect(r.id)}
                  className={cn(
                    "cursor-pointer h-full transition-all duration-300",
                    isUpdating && !isSelected && "opacity-50 grayscale",
                    isSelected && "ring-2 ring-primary scale-105"
                  )}
                  glowColor={r.color as "emerald" | "cyan" | "red"}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                      r.color === "emerald" && "bg-emerald-500/20",
                      r.color === "cyan" && "bg-cyan-500/20",
                      r.color === "rose" && "bg-rose-500/20"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6",
                        r.color === "emerald" && "text-emerald-400",
                        r.color === "cyan" && "text-cyan-400",
                        r.color === "rose" && "text-rose-400"
                      )}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {r.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {r.description}
                  </p>

                  <div
                    className={cn(
                      "flex items-center gap-2 font-medium transition-colors",
                      r.color === "emerald" && "text-emerald-400",
                      r.color === "cyan" && "text-cyan-400",
                      r.color === "rose" && "text-rose-400"
                    )}
                  >
                    {isSelected ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Authenticating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Select Role
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
