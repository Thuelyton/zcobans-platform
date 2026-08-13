'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import { clsx } from 'clsx'

// Tabs Context
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

// Tabs Root
export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string
  children: ReactNode
  className?: string
}) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

// Tabs List
export function TabsList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'flex gap-1 rounded-lg bg-[#0d1117] p-1',
        className
      )}
    >
      {children}
    </div>
  )
}

// Tabs Trigger
export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={clsx(
        'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
          : 'text-slate-400 hover:text-slate-200',
        className
      )}
    >
      {children}
    </button>
  )
}

// Tabs Content
export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  const { activeTab } = context

  if (activeTab !== value) return null

  return <div className={className}>{children}</div>
}
