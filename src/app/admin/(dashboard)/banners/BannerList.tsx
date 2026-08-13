'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { FormModal } from '@/components/admin/FormModal'
import { BannerForm } from './BannerForm'

type BannerRow = any // Use specific type when fully typed

export function BannerList({ initialBanners }: { initialBanners: BannerRow[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerRow | null>(null)

  const handleOpenNew = () => {
    setEditingBanner(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (banner: BannerRow) => {
    setEditingBanner(banner)
    setIsModalOpen(true)
  }

  const columns = [
    { header: 'Imagem', accessor: (row: any) => (
       <img src={row.image_url} alt={row.title} className="h-10 w-20 object-cover rounded" />
    )},
    { header: 'Título', accessor: 'title' },
    { header: 'Posição', accessor: 'position' },
    { 
      header: 'Status', 
      accessor: (row: any) => <StatusBadge status={row.active ? 'active' : 'inactive'} /> 
    },
    { 
      header: 'Ações', 
      className: 'text-right',
      accessor: (row: any) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => handleOpenEdit(row)} 
            className="text-blue-600 hover:text-blue-900 p-1"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            className="text-red-600 hover:text-red-900 p-1"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir?')) {
                // calls import { deleteBanner } from './actions'
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      <SectionHeader 
        title="Banners" 
        description="Gerencie os banners exibidos na página principal." 
        actions={
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Novo Banner
          </button>
        }
      />

      <DataTable 
        data={initialBanners} 
        columns={columns} 
        keyExtractor={(item) => item.id} 
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBanner ? "Editar Banner" : "Novo Banner"}
      >
        <BannerForm 
          banner={editingBanner} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </FormModal>
    </div>
  )
}
