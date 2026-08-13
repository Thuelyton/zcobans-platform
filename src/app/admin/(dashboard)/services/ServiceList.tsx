'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { FormModal } from '@/components/admin/FormModal'
import { ServiceForm } from './ServiceForm'
import { deleteService } from './actions'

export function ServiceList({ initialServices, categories }: { initialServices: any[], categories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<any | null>(null)

  const handleOpenNew = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (svc: any) => {
    setEditingService(svc)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      await deleteService(id)
    }
  }

  const columns = [
    { header: 'Nome', accessor: 'name' },
    { 
      header: 'Categoria', 
      accessor: (row: any) => row.category?.name || 'Sem categoria' 
    },
    { 
      header: 'Preço', 
      accessor: (row: any) => row.price ? `R$ ${row.price.toFixed(2)}` : '-' 
    },
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
        title="Serviços" 
        description="Gerencie os serviços oferecidos na plataforma." 
        actions={
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Novo Serviço
          </button>
        }
      />

      <DataTable 
        data={initialServices} 
        columns={columns} 
        keyExtractor={(item) => item.id} 
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingService ? "Editar Serviço" : "Novo Serviço"}
      >
        <ServiceForm 
          service={editingService} 
          categories={categories}
          onSuccess={() => setIsModalOpen(false)} 
        />
      </FormModal>
    </div>
  )
}
