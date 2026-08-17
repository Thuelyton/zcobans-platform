'use client'

import { useState, useEffect, useCallback } from 'react'
import { ConsultationStats, StatCard } from '@/components/admin/ConsultationStats'
import { QuickActions } from '@/components/admin/QuickActions'
import { RecentConsultations, type Consultation } from '@/components/admin/RecentConsultations'
import { ConsultaRequestModal } from '@/components/admin/ConsultaRequestModal'
import {
  Wallet,
  FileSearch,
  Users,
  CreditCard,
  Clock,
  Loader2,
} from 'lucide-react'
import { listConsultations, getConsultationStats } from '@/lib/consultations/consultation.actions'

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | undefined>()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar consultas do banco
  const loadConsultations = useCallback(async () => {
    try {
      const result = await listConsultations({ limit: 10 })
      if (result.success) {
        setConsultations(
          result.data.consultations.map((c) => ({
            id: c.id,
            clientDocument: c.clientDocument,
            type: c.queryType as Consultation['type'],
            status: c.status.toUpperCase() as Consultation['status'],
            creditsUsed: c.creditsUsed,
            createdAt: c.createdAt,
            pdfUrl: null, // PDF será implementado futuramente
          }))
        )
      }
    } catch (err) {
      console.error('Erro ao carregar consultas:', err)
    }
  }, [])

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      const result = await getConsultationStats()
      if (result.success) {
        setStats([
          {
            name: 'Total Consultas',
            value: result.data.total.toString(),
            icon: <FileSearch className="h-6 w-6" />,
            change: 'Todas as consultas',
            changeType: 'neutral',
            color: 'blue',
          },
          {
            name: 'Pendentes',
            value: result.data.pending.toString(),
            icon: <Clock className="h-6 w-6" />,
            change: 'Aguardando processamento',
            changeType: 'neutral',
            color: 'amber',
          },
          {
            name: 'Concluídas',
            value: result.data.completed.toString(),
            icon: <Wallet className="h-6 w-6" />,
            change: 'Consultas finalizadas',
            changeType: 'positive',
            color: 'emerald',
          },
          {
            name: 'Com Erro',
            value: result.data.error.toString(),
            icon: <CreditCard className="h-6 w-6" />,
            change: 'Requer atenção',
            changeType: result.data.error > 0 ? 'negative' : 'neutral',
            color: 'red',
          },
        ])
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    }
  }, [])

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([loadConsultations(), loadStats()])
      setLoading(false)
    }
    loadData()
  }, [loadConsultations, loadStats])

  // Recarregar após criar consulta
  const handleRefresh = useCallback(async () => {
    await Promise.all([loadConsultations(), loadStats()])
  }, [loadConsultations, loadStats])

  const handleOpenModal = (type?: string) => {
    if (type) {
      setSelectedType(type)
    } else {
      setSelectedType(undefined)
    }
    setModalOpen(true)
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Bem-vindo de volta!</h1>
            <p className="mt-1 text-sm text-slate-400">
              Carregando dados...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta!</h1>
          <p className="mt-1 text-sm text-slate-400">
            Aqui está o resumo da sua plataforma de consultas
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="h-4 w-4" />
          <span>Último acesso: {new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <ConsultationStats stats={stats} />

      {/* Quick Actions */}
      <QuickActions onOpenModal={handleOpenModal} />

      {/* Recent Consultations */}
      <RecentConsultations consultations={consultations} loading={loading} />

      {/* Consultation Request Modal */}
      <ConsultaRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={handleRefresh}
        defaultQueryType={selectedType as any}
      />
    </div>
  )
}
