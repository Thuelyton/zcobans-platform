'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { siteSettingsSchema, SiteSettingsFormData } from '@/lib/validations/settings'
import { updateSiteSettings } from './actions'

interface SettingsFormProps {
  settings: any | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema) as any,
    defaultValues: (settings as any) || {
      site_name: 'ZCobans Platform',
      site_description: '',
      logo_url: '',
      favicon_url: '',
      theme_color: '#3b82f6',
      maintenance_mode: false,
    }
  })

  async function onSubmit(data: SiteSettingsFormData) {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)
    
    const result = await updateSiteSettings(data)

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow ring-1 ring-gray-900/5">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Site</label>
          <input 
            {...register('site_name')} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
          {errors.site_name && <p className="mt-1 text-sm text-red-600">{errors.site_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição SEO</label>
          <textarea 
            {...register('site_description')} 
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo URL</label>
            <input 
              {...register('logo_url')} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cor Principal</label>
            <input 
              {...register('theme_color')} 
              type="color"
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border" 
            />
          </div>
        </div>

        <div className="flex items-center p-4 bg-yellow-50 rounded-md border border-yellow-100">
          <input 
            {...register('maintenance_mode')} 
            type="checkbox" 
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
          />
          <div className="ml-3">
            <label className="text-sm font-medium text-yellow-800">Modo de Manutenção</label>
            <p className="text-xs text-yellow-700">Quando ativado, o site público exibirá uma mensagem de indisponibilidade.</p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600 font-medium">Configurações salvas com sucesso!</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
}
