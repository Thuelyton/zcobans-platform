'use client'

/**
 * Device Toggle
 * ZCobans Visual Designer
 *
 * Toggle para alternar entre Desktop, Tablet e Mobile.
 */

import { clsx } from 'clsx'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { useDesigner } from '@/lib/designer/store'
import type { DeviceType } from '@/lib/designer/types'

const devices: { type: DeviceType; icon: typeof Monitor; label: string }[] = [
  { type: 'desktop', icon: Monitor, label: 'Desktop' },
  { type: 'tablet', icon: Tablet, label: 'Tablet' },
  { type: 'mobile', icon: Smartphone, label: 'Mobile' },
]

export function DeviceToggle() {
  const { state, setDevice } = useDesigner()

  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-800/50 p-1">
      {devices.map((device) => {
        const Icon = device.icon
        const isActive = state.device === device.type

        return (
          <button
            key={device.type}
            onClick={() => setDevice(device.type)}
            className={clsx(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            )}
            title={device.label}
            aria-label={device.label}
            aria-pressed={isActive}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{device.label}</span>
          </button>
        )
      })}
    </div>
  )
}
