"use client"

import { type ReactNode } from "react"
import { CrisisProvider, useCrisis } from "@/lib/crisis-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { GlobalMeshBackground } from "@/components/global-mesh-background"

function CommandLayoutContent({ children }: { children: ReactNode }) {
  const { isHighBurnout } = useCrisis()

  return (
    <div className="min-h-screen">
      <GlobalMeshBackground isHighBurnout={isHighBurnout} />
      <DashboardSidebar role="command" />
      <main className="pl-0 md:pl-[72px] lg:pl-[260px] pb-16 md:pb-0 min-h-screen transition-all duration-300">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function CommandLayout({ children }: { children: ReactNode }) {
  return (
    <CrisisProvider>
      <CommandLayoutContent>{children}</CommandLayoutContent>
    </CrisisProvider>
  )
}
