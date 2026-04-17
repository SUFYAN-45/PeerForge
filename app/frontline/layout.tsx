"use client"

import { type ReactNode } from "react"
import { CrisisProvider, useCrisis } from "@/lib/crisis-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { GlobalMeshBackground } from "@/components/global-mesh-background"

function FrontlineLayoutContent({ children }: { children: ReactNode }) {
  const { isHighBurnout } = useCrisis()

  return (
    <div className="min-h-screen">
      <GlobalMeshBackground isHighBurnout={isHighBurnout} />
      <DashboardSidebar role="frontline" />
      <main className="pl-[72px] md:pl-[260px] min-h-screen transition-all duration-300">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function FrontlineLayout({ children }: { children: ReactNode }) {
  return (
    <CrisisProvider>
      <FrontlineLayoutContent>{children}</FrontlineLayoutContent>
    </CrisisProvider>
  )
}
