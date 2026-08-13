'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { FormModal } from '@/components/admin/FormModal'
import { PromotionForm } from './PromotionForm'
import { deletePromotion } from './actions'

export function PromotionList({ initialPromotions }: { initialPromotions: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<any | null>(null)

  const handleOpenNew = () => {
    setEditingPromotion(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (promo: any) => {
    setEditingPromotion(promo)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta promoção?')) {
      await deletePromotion(id)
    }
  }

  const columns = [
    { header: 'Título', accessor: 'title' },
    { 
      header: 'Desconto', 
      accessor: (row: any) => row.discount_type === 'percentage' 
        ? `${row.discount_value}%` 
        : `R$ ${row.discount_value.toFixed(2)}` 
    },
    { header: 'Código', accessor: (row: any) => row.code || '-' },
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
        title="Promoções" 
        description="Gerencie ofertas e descontos da plataforma." 
        actions={
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Nova Promoção
          </button>
        }
      />

      <DataTable 
        data={initialPromotions} 
        columns={columns} 
        keyExtractor={(item) => item.id} 
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingPromotion ? "Editar Promoção" : "Nova Promoção"}
      >
        <PromotionForm 
          promotion={editingPromotion} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </FormModal>
    </div>
  )
}
