import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatCard {
  name: string
  value: string | number
  icon: ReactNode
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'red'
}

const colorMap = {
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-400',
    glow: 'shadow-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
    glow: 'shadow-amber-500/20',
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-400',
    glow: 'shadow-red-500/20',
  },
}

function TrendIcon({ type }: { type: 'positive' | 'negative' | 'neutral' }) {
  if (type === 'positive') return <TrendingUp className="h-4 w-4 text-emerald-400" />
  if (type === 'negative') return <TrendingDown className="h-4 w-4 text-red-400" />
  return <Minus className="h-4 w-4 text-slate-500" />
}

export function ConsultationStats({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const colors = colorMap[stat.color || 'emerald']
        return (
          <div
            key={stat.name}
            className={clsx(
              'stat-card rounded-xl p-6 transition-all duration-200',
              'hover:scale-[1.02] hover:shadow-lg',
              colors.glow
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={clsx('rounded-lg p-3', colors.bg)}>
                <div className={clsx('h-6 w-6', colors.icon)}>{stat.icon}</div>
              </div>
            </div>
            {stat.change && (
              <div className="mt-4 flex items-center gap-2">
                <TrendIcon type={stat.changeType || 'neutral'} />
                <span
                  className={clsx(
                    'text-xs font-medium',
                    stat.changeType === 'positive' && 'text-emerald-400',
                    stat.changeType === 'negative' && 'text-red-400',
                    stat.changeType === 'neutral' && 'text-slate-500'
                  )}
                >
                  {stat.change}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
