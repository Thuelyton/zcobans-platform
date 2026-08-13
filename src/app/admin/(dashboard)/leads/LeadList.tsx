'use client'

import { SectionHeader } from '@/components/admin/SectionHeader'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Trash2, CheckCircle2 } from 'lucide-react'
import { updateLeadStatus, deleteLead } from './actions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Database } from '@/lib/supabase/types'

type Lead = Database['public']['Tables']['leads']['Row']

export function LeadList({ initialLeads }: { initialLeads: Lead[] }) {
  
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'new' ? 'contacted' : 'new'
    await updateLeadStatus(id, nextStatus)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este lead?')) {
      await deleteLead(id)
    }
  }

  const columns = [
    { 
      header: 'Data', 
      accessor: (row: Lead) => format(new Date(row.created_at ?? new Date()), "dd/MM 'às' HH:mm", { locale: ptBR }) 
    },
    { header: 'Nome', accessor: 'name' as const },
    { header: 'Email', accessor: 'email' as const },
    { header: 'Telefone', accessor: (row: Lead) => row.phone || '-' },
    { 
      header: 'Status', 
      accessor: (row: Lead) => {
        const statusMap: Record<string, 'pending' | 'active' | 'inactive'> = {
          new: 'pending',
          contacted: 'active',
          qualified: 'active',
          closed: 'inactive'
        }
        const labelMap: Record<string, string> = {
          new: 'Novo',
          contacted: 'Contatado',
          qualified: 'Qualificado',
          closed: 'Fechado'
        }
        const status = row.status ?? 'new'
        return <StatusBadge status={statusMap[status] || 'inactive'} label={labelMap[status] || status} />
      }
    },
    { 
      header: 'Ações', 
      className: 'text-right',
      accessor: (row: Lead) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => handleToggleStatus(row.id, row.status ?? 'new')} 
            className="text-green-600 hover:text-green-900"
            title="Marcar como contatado"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      <SectionHeader 
        title="Leads Recebidos" 
        description="Acompanhe as mensagens enviadas pelos clientes interessados." 
      />

      <DataTable 
        data={initialLeads} 
        columns={columns} 
        keyExtractor={(item) => item.id} 
      />
    </div>
  )
}
