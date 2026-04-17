"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface CrisisContextType {
  isCrisisMode: boolean
  isHighBurnout: boolean
  toggleCrisisMode: () => void
  setHighBurnout: (value: boolean) => void
}

const CrisisContext = createContext<CrisisContextType | undefined>(undefined)

export function CrisisProvider({ children }: { children: ReactNode }) {
  const [isCrisisMode, setIsCrisisMode] = useState(false)
  const [isHighBurnout, setIsHighBurnout] = useState(false)

  const toggleCrisisMode = useCallback(() => {
    setIsCrisisMode(prev => !prev)
  }, [])

  const setHighBurnout = useCallback((value: boolean) => {
    setIsHighBurnout(value)
  }, [])

  return (
    <CrisisContext.Provider value={{ isCrisisMode, isHighBurnout, toggleCrisisMode, setHighBurnout }}>
      <div className={isCrisisMode ? "crisis-mode" : ""}>
        {children}
      </div>
    </CrisisContext.Provider>
  )
}

export function useCrisis() {
  const context = useContext(CrisisContext)
  if (context === undefined) {
    throw new Error("useCrisis must be used within a CrisisProvider")
  }
  return context
}
