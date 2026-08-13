'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trustIndicatorSchema, TrustIndicatorFormData } from '@/lib/validations/trust'
import { createTrustIndicator, updateTrustIndicator } from './actions'

interface TrustFormProps {
  indicator?: any | null
  onSuccess: () => void
}

export function TrustForm({ indicator, onSuccess }: TrustFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<TrustIndicatorFormData>({
    resolver: zodResolver(trustIndicatorSchema) as any,
    defaultValues: (indicator as any) || {
      type: 'testimonial',
      title: '',
      subtitle: '',
      image_url: '',
      position: 0,
      active: true,
    }
  })

  async function onSubmit(data: TrustIndicatorFormData) {
    setIsSubmitting(true)
    setError(null)
    
    let result
    if (indicator?.id) {
      result = await updateTrustIndicator(indicator.id, data)
    } else {
      result = await createTrustIndicator(data)
    }

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
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select 
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        >
          <option value="testimonial">Depoimento</option>
          <option value="partner">Parceiro / Logo</option>
          <option value="award">Prêmio / Certificação</option>
          <option value="metric">Métrica (ex: +10k clientes)</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Título / Nome</label>
        <input 
          {...register('title')} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subtítulo / Descrição</label>
        <textarea 
          {...register('subtitle')} 
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL da Imagem / Logo</label>
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
