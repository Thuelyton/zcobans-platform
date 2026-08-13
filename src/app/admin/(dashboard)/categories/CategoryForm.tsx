'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, CategoryFormData } from '@/lib/validations/category'
import { createCategory, updateCategory } from './actions'
import { generateSlug } from '@/lib/slug'
import type { Database } from '@/lib/supabase/types'

type CategoryRow = Database['public']['Tables']['service_categories']['Row']

interface CategoryFormProps {
  category?: CategoryRow | null
  onSuccess: () => void
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as never,
    defaultValues: category
      ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? '',
          image_url: category.image_url ?? '',
          position: category.position ?? 0,
          active: category.active ?? true,
        }
      : {
          name: '',
          slug: '',
          description: '',
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

  async function onSubmit(data: CategoryFormData) {
    setIsSubmitting(true)
    setError(null)
    
    let result
    if (category?.id) {
      result = await updateCategory(category.id, data)
    } else {
      result = await createCategory(data)
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
        <p className="mt-1 text-xs text-gray-500">Gerado automaticamente a partir do nome. Você pode editar manualmente.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea 
          {...register('description')} 
          rows={3}
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
