'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { FormModal } from '@/components/admin/FormModal'
import { ContentForm } from './ContentForm'
import { deleteContentSection } from './actions'

export function ContentList({ initialSections }: { initialSections: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<any | null>(null)

  const handleOpenNew = () => {
    setEditingSection(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (section: any) => {
    setEditingSection(section)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir esta seção de conteúdo?')) {
      await deleteContentSection(id)
    }
  }

  const columns = [
    { header: 'Identificador', accessor: 'identifier' },
    { header: 'Título', accessor: 'title' },
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
        title="Seções de Conteúdo" 
        description="Gerencie textos institucionais e banners de conteúdo da plataforma." 
        actions={
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Nova Seção
          </button>
        }
      />

      <DataTable 
        data={initialSections} 
        columns={columns} 
        keyExtractor={(item) => item.id} 
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingSection ? "Editar Seção" : "Nova Seção de Conteúdo"}
      >
        <ContentForm 
          section={editingSection} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </FormModal>
    </div>
  )
}
