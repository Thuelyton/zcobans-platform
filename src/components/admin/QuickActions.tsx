'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import {
  FileSearch,
  CreditCard,
  UserPlus,
  Database,
  Phone,
  Shield,
  ArrowRight,
} from 'lucide-react'

export interface QuickAction {
  name: string
  description: string
  href: string
  icon: React.ReactNode
  color: 'emerald' | 'blue' | 'purple' | 'amber'
  enabled?: boolean
}

const defaultActions: QuickAction[] = [
  {
    name: 'Consulta CPF',
    description: 'Consultar CPF/CNPJ',
    href: '/admin/consultas?tipo=cpf',
    icon: <FileSearch className="h-5 w-5" />,
    color: 'emerald',
    enabled: true,
  },
  {
    name: 'Consulta INSS',
    description: 'Consultar benefícios INSS',
    href: '/admin/consultas?tipo=inss',
    icon: <Database className="h-5 w-5" />,
    color: 'blue',
    enabled: true,
  },
  {
    name: 'Consulta FGTS',
    description: 'Consultar saldo FGTS',
    href: '/admin/consultas?tipo=fgts',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'purple',
    enabled: true,
  },
  {
    name: 'Limpa Nome',
    description: 'Consulta de restrições',
    href: '/admin/limpa-nome',
    icon: <Shield className="h-5 w-5" />,
    color: 'amber',
    enabled: true,
  },
  {
    name: 'Novo Cliente',
    description: 'Cadastrar cliente',
    href: '/admin/clientes/novo',
    icon: <UserPlus className="h-5 w-5" />,
    color: 'emerald',
    enabled: true,
  },
  {
    name: 'Consulta Telefone',
    description: 'Consulta por telefone',
    href: '/admin/consultas?tipo=telefone',
    icon: <Phone className="h-5 w-5" />,
    color: 'blue',
    enabled: true,
  },
]

const colorMap = {
  emerald: {
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    icon: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10 hover:bg-blue-500/20',
    icon: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10 hover:bg-purple-500/20',
    icon: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10 hover:bg-amber-500/20',
    icon: 'text-amber-400',
    border: 'border-amber-500/20',
  },
}

export function QuickActions({ actions = defaultActions }: { actions?: QuickAction[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827] p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {actions
          .filter((action) => action.enabled !== false)
          .map((action) => {
            const colors = colorMap[action.color]
            return (
              <Link
                key={action.name}
                href={action.href}
                className={clsx(
                  'group flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-all duration-200',
                  colors.bg,
                  colors.border,
                  'hover:scale-[1.02] hover:shadow-lg'
                )}
              >
                <div className={clsx('rounded-lg bg-slate-800/50 p-3', colors.icon)}>
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{action.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            )
          })}
      </div>
    </div>
  )
}
