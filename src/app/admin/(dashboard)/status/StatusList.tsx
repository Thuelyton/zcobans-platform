'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { FormModal } from '@/components/admin/FormModal'
import { StatusForm } from './StatusForm'
import { deleteStatus } from './actions'
import type { Database } from '@/lib/supabase/types'

type ServiceStatusRow = Database['public']['Tables']['service_status']['Row']
type ServiceRow = Database['public']['Tables']['services']['Row']

// The Supabase query returns a joined result that TypeScript can't fully infer
// due to missing foreign key relationship in schema. We use a compatible type.
interface ServiceStatusWithService {
  id: string
  service_id: string | null
  status: string
  message: string | null
  created_at: string | null
  updated_at: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any
}

interface ServiceStatusListProps {
  initialStatuses: ServiceStatusWithService[]
  services: ServiceRow[]
}

export function StatusList({ initialStatuses, services }: ServiceStatusListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<ServiceStatusWithService | null>(null)

  const handleOpenNew = () => {
    setEditingStatus(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (status: ServiceStatusWithService) => {
    setEditingStatus(status)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de status?')) {
      await deleteStatus(id)
    }
  }

  const columns = [
    { 
      header: 'Serviço', 
      accessor: (row: ServiceStatusWithService) => row.service?.name || 'Desconhecido' 
    },
    { 
      header: 'Status', 
      accessor: (row: ServiceStatusWithService) => {
        const statusMap: Record<string, 'active' | 'warning' | 'error' | 'pending'> = {
          operational: 'active',
          degraded: 'warning',
          outage: 'error',
          maintenance: 'pending'
        }
        const labelMap: Record<string, string> = {
          operational: 'Operacional',
          degraded: 'Lentidão',
          outage: 'Fora do Ar',
          maintenance: 'Manutenção'
        }
        return <StatusBadge status={statusMap[row.status] || 'pending'} label={labelMap[row.status] || row.status} />
      }
    },
    { header: 'Mensagem', accessor: 'message' as const },
    { 
      header: 'Ações', 
      className: 'text-right',
      accessor: (row: ServiceStatusWithService) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleOpenEdit(row)} className="text-blue-600 hover:text-blue-900">
            <Edit2 className="h-4 w-4" />
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
        title="Status dos Serviços" 
        description="Atualize o estado operacional de cada serviço." 
        actions={
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Nova Atualização
          </button>
        }
      />

      <DataTable 
        data={initialStatuses} 
        columns={columns} 
        keyExtractor={(item) => item.id} 
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingStatus ? "Editar Status" : "Nova Atualização de Status"}
      >
        <StatusForm 
          statusRecord={editingStatus} 
          services={services}
          onSuccess={() => setIsModalOpen(false)} 
        />
      </FormModal>
    </div>
  )
}
