'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { statusSchema, StatusFormData } from '@/lib/validations/status'
import { updateServiceStatus } from './actions'
import type { Database } from '@/lib/supabase/types'

type ServiceStatus = Database['public']['Tables']['service_status']['Row']
type Service = Database['public']['Tables']['services']['Row']

interface StatusFormProps {
  statusRecord?: ServiceStatus | null
  services: Service[]
  onSuccess: () => void
}

export function StatusForm({ statusRecord, services, onSuccess }: StatusFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: statusRecord
      ? {
          id: statusRecord.id,
          service_id: statusRecord.service_id ?? '',
          status: statusRecord.status as StatusFormData['status'],
          message: statusRecord.message ?? '',
        }
      : {
          service_id: '',
          status: 'operational',
          message: '',
        }
  })

  async function onSubmit(data: StatusFormData) {
    setIsSubmitting(true)
    setError(null)
    
    const result = await updateServiceStatus(data)

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
        <label className="block text-sm font-medium text-gray-700">Serviço</label>
        <select 
          {...register('service_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        >
          <option value="">Selecione um serviço</option>
          {services.map((svc) => (
            <option key={svc.id} value={svc.id}>{svc.name}</option>
          ))}
        </select>
        {errors.service_id && <p className="mt-1 text-sm text-red-600">{errors.service_id.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select 
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        >
          <option value="operational">Operacional</option>
          <option value="degraded">Performance Reduzida</option>
          <option value="outage">Instabilidade</option>
          <option value="maintenance">Manutenção</option>
        </select>
        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mensagem (Opcional)</label>
        <textarea 
          {...register('message')} 
          rows={3}
          placeholder="Ex: Estamos investigando uma lentidão nos servidores."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
        />
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
