'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import {
  INSS_QUERY_LABELS,
  INSS_QUERY_DESCRIPTIONS,
  INSS_CATEGORIES,
  CONSULTATION_COST,
  type INSSQueryType,
} from '@/lib/consultations/constants'
import {
  maskDocumentForDisplay,
  detectDocumentType,
  supportsQRCode,
} from '@/lib/consultations/inss-types'
import { createConsultation } from '@/lib/consultations/consultation.actions'

interface ConsultaRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  /** Tipo pré-selecionado (opcional) */
  defaultQueryType?: INSSQueryType
}

// ============================================================================
// OPTIONS FOR SELECT
// ============================================================================

const queryTypeOptions = [
  // Extratos CNIS
  { value: '', label: 'Selecione o tipo de consulta...' },
  { value: '---', label: '─── Extratos CNIS ───', disabled: true },
  ...INSS_CATEGORIES.EXTRATOS_CNIS.types.map((type) => ({
    value: type,
    label: INSS_QUERY_LABELS[type],
  })),
  { value: '---', label: '─── Documentos INSS ───', disabled: true },
  ...INSS_CATEGORIES.DOCUMENTOS_INSS.types.map((type) => ({
    value: type,
    label: INSS_QUERY_LABELS[type],
  })),
  { value: '---', label: '─── Outros Serviços ───', disabled: true },
  ...INSS_CATEGORIES.OUTROS_SERVICOS.types.map((type) => ({
    value: type,
    label: INSS_QUERY_LABELS[type],
  })),
]

// ============================================================================
// COMPONENT
// ============================================================================

export function ConsultaRequestModal({
  isOpen,
  onClose,
  onComplete,
  defaultQueryType,
}: ConsultaRequestModalProps) {
  const [document, setDocument] = useState('')
  const [clientName, setClientName] = useState('')
  const [queryType, setQueryType] = useState<INSSQueryType | ''>(defaultQueryType || '')
  const [qrCode, setQrCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDocument('')
      setClientName('')
      setQueryType(defaultQueryType || '')
      setQrCode(false)
      setLoading(false)
      setError(null)
      setSuccess(false)
    }
  }, [isOpen, defaultQueryType])

  // Check if QR Code should be shown
  const showQRCode = queryType && supportsQRCode(queryType as INSSQueryType)

  // Format document input
  const handleDocumentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 14)
    setDocument(value)
    setError(null)
  }, [])

  // Format document for display
  const formatDocumentDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 11) {
      // CPF format: 000.000.000-00
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    // CNPJ format: 00.000.000/0000-00
    return digits
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }

  // Validate and submit
  const handleSubmit = async () => {
    setError(null)

    // Validate document
    const digits = document.replace(/\D/g, '')
    if (digits.length < 11) {
      setError('CPF/CNPJ inválido')
      return
    }

    if (!clientName.trim()) {
      setError('Nome do cliente é obrigatório')
      return
    }

    if (!queryType) {
      setError('Selecione o tipo de consulta')
      return
    }

    setLoading(true)

    try {
      const result = await createConsultation({
        clientName: clientName.trim(),
        clientDocument: digits,
        documentType: detectDocumentType(digits),
        queryType: queryType as INSSQueryType,
        metadata: showQRCode ? { qrCode } : undefined,
      })

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onComplete?.()
          onClose()
        }, 1500)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar consulta')
    } finally {
      setLoading(false)
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-xl border border-slate-700 bg-[#111827] px-6 pb-6 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            {/* Close button */}
            <button
              type="button"
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              onClick={onClose}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h3
                className="text-lg font-semibold text-white"
                id="modal-title"
              >
                Solicitar Consulta
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Preencha os dados para solicitar a consulta
              </p>
            </div>

            {/* Success state */}
            {success ? (
              <div className="flex flex-col items-center py-8">
                <CheckCircle className="h-16 w-16 text-emerald-400 mb-4" />
                <p className="text-lg font-medium text-white">Consulta solicitada!</p>
                <p className="mt-2 text-sm text-slate-400">
                  Sua consulta foi registrada com sucesso.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Client name input */}
                <Input
                  label="Nome do cliente"
                  placeholder="Nome completo do cliente"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value)
                    setError(null)
                  }}
                  disabled={loading}
                />

                {/* Document input */}
                <Input
                  label="CPF / CNPJ do cliente"
                  placeholder="Digite o CPF ou CNPJ"
                  value={formatDocumentDisplay(document)}
                  onChange={handleDocumentChange}
                  error={error && !queryType ? error : undefined}
                  maxLength={18}
                  disabled={loading}
                  aria-describedby={error ? 'document-error' : undefined}
                />

                {/* Query type select */}
                <Select
                  label="Tipo de consulta"
                  options={queryTypeOptions}
                  value={queryType}
                  onChange={(e) => {
                    setQueryType(e.target.value as INSSQueryType | '')
                    setQrCode(false)
                    setError(null)
                  }}
                  disabled={loading}
                />

                {/* QR Code toggle (only for CNIS types) */}
                {showQRCode && (
                  <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#0d1117] p-4">
                    <input
                      type="checkbox"
                      id="qrCode"
                      checked={qrCode}
                      onChange={(e) => setQrCode(e.target.checked)}
                      disabled={loading}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    <label htmlFor="qrCode" className="text-sm text-slate-300">
                      Incluir QR Code
                    </label>
                  </div>
                )}

                {/* Credit cost indicator */}
                <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                    <span className="text-sm font-bold text-amber-400">C</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-400">
                      Custo: {CONSULTATION_COST} Crédito{CONSULTATION_COST > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-slate-500">
                      {queryType && INSS_QUERY_DESCRIPTIONS[queryType as INSSQueryType]}
                    </p>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !document || !queryType || !clientName.trim()}
                    isLoading={loading}
                    className="min-w-[140px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Solicitando...
                      </>
                    ) : (
                      'Solicitar Consulta'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
