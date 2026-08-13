'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contentSchema, ContentFormData } from '@/lib/validations/content'
import { upsertContentSection } from './actions'

interface ContentFormProps {
  section?: any | null
  onSuccess: () => void
}

export function ContentForm({ section, onSuccess }: ContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema) as any,
    defaultValues: (section as any) || {
      identifier: '',
      title: '',
      content: '',
      active: true,
    }
  })

  async function onSubmit(data: ContentFormData) {
    setIsSubmitting(true)
    setError(null)
    
    const result = await upsertContentSection(data)

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Identificador (Slug)</label>
        <input 
          {...register('identifier')} 
          disabled={!!section}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100" 
        />
        {errors.identifier && <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input 
          {...register('title')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Conteúdo (HTML/Markdown)</label>
        <textarea 
          {...register('content')} 
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
      </div>

      <div className="flex items-center">
        <input 
          {...register('active')} 
          type="checkbox" 
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
        />
        <label className="ml-2 block text-sm text-gray-900">Ativo</label>
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
