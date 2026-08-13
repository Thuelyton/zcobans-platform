'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { FormModal } from '@/components/admin/FormModal'
import { TrustForm } from './TrustForm'
import { deleteTrustIndicator } from './actions'

export function TrustList({ initialIndicators }: { initialIndicators: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState<any | null>(null)

  const handleOpenNew = () => {
    setEditingIndicator(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (indicator: any) => {
    setEditingIndicator(indicator)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este indicador de confiança?')) {
      await deleteTrustIndicator(id)
    }
  }

  const columns = [
    { 
      header: 'Tipo', 
      accessor: (row: any) => {
        const labels: Record<string, string> = {
          testimonial: 'Depoimento',
          partner: 'Parceiro',
          award: 'Prêmio',
          metric: 'Métrica'
        }
        return labels[row.type] || row.type
      }
    },
    { header: 'Título/Nome', accessor: 'title' },
    { 
      header: 'Status', 
      accessor: (row: any) => <StatusBadge status={row.active ? 'active' : 'inactive'} /> 
    },
    { 
      header: 'Ações', 
      className: 'text-right',
      accessor: (row: any) => (
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
        title="Indicadores de Confiança" 
        description="Gerencie depoimentos, logos de parceiros e certificações." 
        actions={
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Novo Indicador
          </button>
        }
      />

      <DataTable 
        data={initialIndicators} 
        columns={columns} 
        keyExtractor={(item) => item.id} 
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingIndicator ? "Editar Indicador" : "Novo Indicador"}
      >
        <TrustForm 
          indicator={editingIndicator} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </FormModal>
    </div>
  )
}
