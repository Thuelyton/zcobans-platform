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
  Download,
  FileDown,
  FileText,
  RefreshCw,
  Layers,
  UserCheck,
  Lock,
  Unlock,
  MoreHorizontal,
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
import { INSS_QUERY_LABELS, type INSSQueryType, type ConsultationStatus } from '@/lib/consultations/constants'
import { maskDocumentForDisplay } from '@/lib/consultations/inss-types'

export interface Consultation {
  id: string
  clientName?: string
  clientDocument: string
  type: 'cpf' | 'inss' | 'fgts' | 'telefone' | 'limpa_nome' | 'outro' | INSSQueryType
  status: ConsultationStatus | 'concluida' | 'pendente' | 'erro' | 'cancelada'
  creditsUsed: number
  createdAt: string
  pdfUrl?: string | null
}

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  cpf: { label: 'CPF/CNPJ', icon: <FileSearch className="h-4 w-4" />, color: 'text-emerald-400' },
  inss: { label: 'INSS', icon: <Database className="h-4 w-4" />, color: 'text-blue-400' },
  fgts: { label: 'FGTS', icon: <CreditCard className="h-4 w-4" />, color: 'text-purple-400' },
  telefone: { label: 'Telefone', icon: <Phone className="h-4 w-4" />, color: 'text-cyan-400' },
  limpa_nome: { label: 'Limpa Nome', icon: <Shield className="h-4 w-4" />, color: 'text-amber-400' },
  outro: { label: 'Outro', icon: <FileSearch className="h-4 w-4" />, color: 'text-slate-400' },
  // INSS/CNIS types
  cnis_online: { label: 'CNIS Online', icon: <Download className="h-4 w-4" />, color: 'text-blue-400' },
  cnis_online_qr: { label: 'CNIS c/ QR', icon: <RefreshCw className="h-4 w-4" />, color: 'text-blue-400' },
  cnis_online_sem_qr: { label: 'CNIS s/ QR', icon: <FileDown className="h-4 w-4" />, color: 'text-blue-400' },
  cnis_offline_cpf: { label: 'CNIS Offline', icon: <Database className="h-4 w-4" />, color: 'text-blue-400' },
  consulta_cnis: { label: 'Consulta CNIS', icon: <FileSearch className="h-4 w-4" />, color: 'text-blue-400' },
  atualizacao_cnis: { label: 'Atual. CNIS', icon: <RefreshCw className="h-4 w-4" />, color: 'text-blue-400' },
  in100: { label: 'IN100', icon: <FileText className="h-4 w-4" />, color: 'text-cyan-400' },
  hiscre: { label: 'HISCRE', icon: <FileText className="h-4 w-4" />, color: 'text-cyan-400' },
  hismed: { label: 'HISMED', icon: <FileText className="h-4 w-4" />, color: 'text-cyan-400' },
  hisatu: { label: 'HISATU', icon: <FileText className="h-4 w-4" />, color: 'text-cyan-400' },
  titula: { label: 'TITULA', icon: <FileText className="h-4 w-4" />, color: 'text-cyan-400' },
  infben: { label: 'INFBEN', icon: <FileText className="h-4 w-4" />, color: 'text-cyan-400' },
  carta_concessao: { label: 'Carta Concessão', icon: <FileText className="h-4 w-4" />, color: 'text-cyan-400' },
  cras: { label: 'CRAS', icon: <Layers className="h-4 w-4" />, color: 'text-purple-400' },
  prova_vida: { label: 'Prova de Vida', icon: <UserCheck className="h-4 w-4" />, color: 'text-purple-400' },
  subida_nivel: { label: 'Subida Nível', icon: <CreditCard className="h-4 w-4" />, color: 'text-purple-400' },
  desbloqueio_nb: { label: 'Desbloq. NB', icon: <Unlock className="h-4 w-4" />, color: 'text-purple-400' },
  retirada_duas_etapas: { label: 'Retirada 2E', icon: <MoreHorizontal className="h-4 w-4" />, color: 'text-purple-400' },
}

const statusConfig: Record<string, { label: string; color: string }> = {
  CONCLUIDO: { label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400' },
  concluida: { label: 'Concluída', color: 'bg-emerald-500/10 text-emerald-400' },
  PENDENTE: { label: 'Pendente', color: 'bg-amber-500/10 text-amber-400' },
  pendente: { label: 'Pendente', color: 'bg-amber-500/10 text-amber-400' },
  PROCESSANDO: { label: 'Processando', color: 'bg-blue-500/10 text-blue-400' },
  ERRO: { label: 'Erro', color: 'bg-red-500/10 text-red-400' },
  erro: { label: 'Erro', color: 'bg-red-500/10 text-red-400' },
  CANCELADO: { label: 'Cancelado', color: 'bg-slate-500/10 text-slate-400' },
  cancelada: { label: 'Cancelada', color: 'bg-slate-500/10 text-slate-400' },
}

function getTypeInfo(type: string) {
  return typeConfig[type] || typeConfig.outro
}

function getStatusInfo(status: string) {
  return statusConfig[status] || statusConfig.pendente
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
          <TableHead>Data/Hora</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Créditos</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ação</TableHead>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-700" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-700" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-700" />
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
              const typeInfo = getTypeInfo(consultation.type)
              const statusInfo = getStatusInfo(consultation.status)
              const isCompleted = consultation.status === 'CONCLUIDO' || consultation.status === 'concluida'
              const hasPdf = consultation.pdfUrl && consultation.pdfUrl.length > 0
              
              return (
                <TableRow key={consultation.id}>
                  <TableCell>
                    <span className="text-sm text-slate-300">
                      {format(new Date(consultation.createdAt), "dd/MM/yy HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      {consultation.clientName ? (
                        <p className="font-medium text-white">{consultation.clientName}</p>
                      ) : null}
                      <p className="text-xs text-slate-500">
                        {maskDocumentForDisplay(consultation.clientDocument)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={clsx('flex items-center gap-2', typeInfo.color)}>
                      {typeInfo.icon}
                      <span>{typeInfo.label}</span>
                    </div>
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
                        statusInfo.color
                      )}
                    >
                      {statusInfo.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isCompleted ? (
                      hasPdf ? (
                        <a
                          href={consultation.pdfUrl || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Baixar PDF
                        </a>
                      ) : (
                        <span className="text-sm text-slate-500">PDF indisponível</span>
                      )
                    ) : consultation.status === 'PROCESSANDO' ? (
                      <span className="flex items-center gap-1.5 text-sm text-blue-400">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processando...
                      </span>
                    ) : consultation.status === 'PENDENTE' || consultation.status === 'pendente' ? (
                      <span className="text-sm text-amber-400">Aguardando...</span>
                    ) : (
                      <span className="text-sm text-slate-500">-</span>
                    )}
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
