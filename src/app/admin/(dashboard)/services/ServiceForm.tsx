'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, ServiceFormData } from '@/lib/validations/service'
import { createService, updateService } from './actions'
import { generateSlug } from '@/lib/slug'
import type { Database } from '@/lib/supabase/types'

type ServiceRow = Database['public']['Tables']['services']['Row']
type CategoryRow = Database['public']['Tables']['service_categories']['Row']

interface ServiceFormProps {
  service?: ServiceRow | null
  categories: CategoryRow[]
  onSuccess: () => void
}

export function ServiceForm({ service, categories, onSuccess }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema) as never,
    defaultValues: service
      ? {
          id: service.id,
          name: service.name,
          slug: service.slug,
          category_id: service.category_id,
          description: service.description ?? '',
          short_description: service.short_description ?? '',
          features: (service.features as string[]) ?? [],
          price: service.price ?? 0,
          image_url: service.image_url ?? '',
          position: service.position ?? 0,
          active: service.active ?? true,
        }
      : {
          name: '',
          slug: '',
          category_id: null,
          description: '',
          short_description: '',
          features: [],
          price: 0,
          image_url: '',
          position: 0,
          active: true,
        }
  })

  const watchName = watch('name')

  // Auto-generate slug from name when not manually edited
  useEffect(() => {
    if (!isSlugManuallyEdited && watchName) {
      const generatedSlug = generateSlug(watchName)
      setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [watchName, isSlugManuallyEdited, setValue])

  const handleSlugChange = () => {
    setIsSlugManuallyEdited(true)
  }

  async function onSubmit(data: ServiceFormData) {
    setIsSubmitting(true)
    setError(null)
    
    let result
    if (service?.id) {
      result = await updateService(service.id, data)
    } else {
      result = await createService(data)
    }

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input 
            {...register('name')} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input 
            {...register('slug')} 
            onChange={(e) => {
              handleSlugChange()
              register('slug').onChange(e)
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          <p className="mt-1 text-xs text-gray-500">Gerado automaticamente a partir do nome.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Categoria</label>
        <select 
          {...register('category_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição Curta</label>
        <input 
          {...register('short_description')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição Completa</label>
        <textarea 
          {...register('description')} 
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (Opcional)</label>
          <input 
            {...register('price')} 
            type="number" 
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
          <input 
            {...register('image_url')} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Posição</label>
          <input 
            {...register('position')} 
            type="number" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
        </div>
        <div className="flex items-center mt-6">
          <input 
            {...register('active')} 
            type="checkbox" 
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
          />
          <label className="ml-2 block text-sm text-gray-900">Ativo</label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:col-start-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={() => onSuccess()}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
