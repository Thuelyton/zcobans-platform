'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { bannerFormSchema, BannerFormData } from '@/lib/validations/banner'
import { createBanner, updateBanner } from './actions'
import { useForm } from 'react-hook-form'
import type { Database } from '@/lib/supabase/types'

type BannerRow = Database['public']['Tables']['banners']['Row']

interface BannerFormProps {
  banner?: BannerRow | null
  onSuccess: () => void
}

export function BannerForm({ banner, onSuccess }: BannerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: banner
      ? {
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle ?? '',
          image_url: banner.image_url,
          link_url: banner.link_url ?? '',
          button_text: banner.button_text ?? '',
          position: banner.position ?? 0,
          active: banner.active ?? true,
          starts_at: banner.starts_at ?? '',
          ends_at: banner.ends_at ?? '',
        }
      : {
          title: '',
          subtitle: '',
          image_url: '',
          link_url: '',
          button_text: '',
          position: 0,
          active: true,
          starts_at: '',
          ends_at: '',
        }
  })

  async function onSubmit(data: BannerFormData) {
    setIsSubmitting(true)
    setError(null)
    
    let result
    if (banner?.id) {
      result = await updateBanner(banner.id, data)
    } else {
      result = await createBanner(data)
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
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input 
          {...register('title')} 
          type="text" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subtítulo</label>
        <input 
          {...register('subtitle')} 
          type="text" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
        <input 
          {...register('image_url')} 
          type="url" 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
        {errors.image_url && <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Link de Destino</label>
        <input 
          {...register('link_url')} 
          type="url" 
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Início</label>
          <input 
            {...register('starts_at')} 
            type="datetime-local" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
          {errors.starts_at && <p className="mt-1 text-sm text-red-600">{errors.starts_at.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Término</label>
          <input 
            {...register('ends_at')} 
            type="datetime-local" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
          {errors.ends_at && <p className="mt-1 text-sm text-red-600">{errors.ends_at.message}</p>}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-50"
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
