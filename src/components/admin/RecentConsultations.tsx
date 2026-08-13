'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  FileSearch,
  Database,
  CreditCard,
  Phone,
  Shield,
  ArrowRight,
  Clock,
} from 'lucide-react'
import {
  TableContainer,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableEmptyState,
} from '@/components/ui/Table'

export interface Consultation {
  id: string
  clientName: string
  clientDocument: string
  type: 'cpf' | 'inss' | 'fgts' | 'telefone' | 'limpa_nome' | 'outro'
  status: 'concluida' | 'pendente' | 'erro' | 'cancelada'
  creditsUsed: number
  createdAt: string
}

const typeConfig = {
  cpf: { label: 'CPF/CNPJ', icon: <FileSearch className="h-4 w-4" />, color: 'text-emerald-400' },
  inss: { label: 'INSS', icon: <Database className="h-4 w-4" />, color: 'text-blue-400' },
  fgts: { label: 'FGTS', icon: <CreditCard className="h-4 w-4" />, color: 'text-purple-400' },
  telefone: { label: 'Telefone', icon: <Phone className="h-4 w-4" />, color: 'text-cyan-400' },
  limpa_nome: { label: 'Limpa Nome', icon: <Shield className="h-4 w-4" />, color: 'text-amber-400' },
  outro: { label: 'Outro', icon: <FileSearch className="h-4 w-4" />, color: 'text-slate-400' },
}

const statusConfig = {
  concluida: { label: 'Concluída', color: 'bg-emerald-500/10 text-emerald-400' },
  pendente: { label: 'Pendente', color: 'bg-amber-500/10 text-amber-400' },
  erro: { label: 'Erro', color: 'bg-red-500/10 text-red-400' },
  cancelada: { label: 'Cancelada', color: 'bg-slate-500/10 text-slate-400' },
}

export function RecentConsultations({
  consultations = [],
  loading = false,
}: {
  consultations?: Consultation[]
  loading?: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827]">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Consultas Recentes</h3>
        </div>
        <Link
          href="/admin/historico"
          className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Ver todas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <TableContainer>
        <TableHeader>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Créditos</TableHead>
          <TableHead>Status</TableHead>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-700" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-700" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
                </TableCell>
              </TableRow>
            ))
          ) : consultations.length === 0 ? (
            <TableEmptyState
              icon={<FileSearch className="h-6 w-6" />}
              title="Nenhuma consulta realizada"
              description="As consultas realizadas aparecerão aqui"
            />
          ) : (
            consultations.map((consultation) => {
              const type = typeConfig[consultation.type]
              const status = statusConfig[consultation.status]
              return (
                <TableRow
                  key={consultation.id}
                  onClick={() => {
                    // Navigate to consultation detail
                  }}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{consultation.clientName}</p>
                      <p className="text-xs text-slate-500">{consultation.clientDocument}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={clsx('flex items-center gap-2', type.color)}>
                      {type.icon}
                      <span>{type.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(consultation.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-amber-400">
                      {consultation.creditsUsed}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={clsx(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        status.color
                      )}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </TableContainer>
    </div>
  )
}
