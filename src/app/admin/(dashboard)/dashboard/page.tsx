import { ConsultationStats, StatCard } from '@/components/admin/ConsultationStats'
import { QuickActions } from '@/components/admin/QuickActions'
import { RecentConsultations } from '@/components/admin/RecentConsultations'
import {
  Wallet,
  FileSearch,
  Users,
  TrendingUp,
  CreditCard,
  Clock,
} from 'lucide-react'
import { getDashboardStats } from './actions'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let consultationStats: StatCard[] = []
  let dashboardData = null

  try {
    dashboardData = await getDashboardStats()
    
    consultationStats = [
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
  } catch (error) {
    consultationStats = [
      {
        name: 'Créditos Disponíveis',
        value: '0',
        icon: <Wallet className="h-6 w-6" />,
        color: 'emerald',
      },
      {
        name: 'Total Consultas',
        value: '0',
        icon: <FileSearch className="h-6 w-6" />,
        color: 'blue',
      },
      {
        name: 'Clientes Cadastrados',
        value: '0',
        icon: <Users className="h-6 w-6" />,
        color: 'purple',
      },
      {
        name: 'Créditos Utilizados',
        value: '0',
        icon: <CreditCard className="h-6 w-6" />,
        color: 'amber',
      },
    ]
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
      <QuickActions />

      {/* Recent Consultations */}
      <RecentConsultations consultations={[]} loading={false} />
    </div>
  )
}
