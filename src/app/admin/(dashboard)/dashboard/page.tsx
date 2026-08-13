'use client'

import { useState } from 'react'
import { ConsultationStats, StatCard } from '@/components/admin/ConsultationStats'
import { QuickActions } from '@/components/admin/QuickActions'
import { RecentConsultations, type Consultation } from '@/components/admin/RecentConsultations'
import { ConsultaRequestModal } from '@/components/admin/ConsultaRequestModal'
import {
  Wallet,
  FileSearch,
  Users,
  TrendingUp,
  CreditCard,
  Clock,
} from 'lucide-react'
import { getINSSService } from '@/lib/consultations/inss-service'
import type { INSSQueryType } from '@/lib/consultations/constants'

// Dados mockados para demonstração
const mockConsultations: Consultation[] = [
  {
    id: '1',
    clientDocument: '12345678901',
    type: 'cnis_online',
    status: 'CONCLUIDO',
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    pdfUrl: null,
  },
  {
    id: '2',
    clientDocument: '98765432100',
    type: 'in100',
    status: 'PROCESSANDO',
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '3',
    clientDocument: '11223344556',
    type: 'hiscre',
    status: 'PENDENTE',
    creditsUsed: 1,
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
]

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<INSSQueryType | undefined>()
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations)

  const consultationStats: StatCard[] = [
    {
      name: 'Créditos Disponíveis',
      value: '12.560',
      icon: <Wallet className="h-6 w-6" />,
      change: '+500 esta semana',
      changeType: 'positive',
      color: 'emerald',
    },
    {
      name: 'Total Consultas',
      value: '8.320',
      icon: <FileSearch className="h-6 w-6" />,
      change: '+124 hoje',
      changeType: 'positive',
      color: 'blue',
    },
    {
      name: 'Clientes Cadastrados',
      value: '1.248',
      icon: <Users className="h-6 w-6" />,
      change: '+18 esta semana',
      changeType: 'positive',
      color: 'purple',
    },
    {
      name: 'Créditos Utilizados',
      value: '4.280',
      icon: <CreditCard className="h-6 w-6" />,
      change: '34% do total',
      changeType: 'neutral',
      color: 'amber',
    },
  ]

  const handleOpenModal = (type?: string) => {
    if (type) {
      setSelectedType(type as INSSQueryType)
    } else {
      setSelectedType(undefined)
    }
    setModalOpen(true)
  }

  const handleRefresh = () => {
    // Em produção, buscaria do backend
    // Por enquanto, apenas recarrega os dados mock
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
          <span>Último acesso: Hoje, 14:30</span>
        </div>
      </div>

      {/* Stats Cards */}
      <ConsultationStats stats={consultationStats} />

      {/* Quick Actions */}
      <QuickActions onOpenModal={handleOpenModal} />

      {/* Recent Consultations */}
      <RecentConsultations consultations={consultations} loading={false} />

      {/* Consultation Request Modal */}
      <ConsultaRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={handleRefresh}
        defaultQueryType={selectedType}
      />
    </div>
  )
}
