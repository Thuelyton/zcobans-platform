/**
 * Página de Consultas
 * Integração com CPFHub API
 */

'use client'

import { useState } from 'react'
import { createConsultation } from './actions'

type QueryType = 'cpf' | 'inss' | 'telefone' | 'limpa_nome'

interface ConsultationResult {
  success: boolean
  data?: {
    nome?: string
    cpf?: string
    sexo?: string
    dataNascimento?: string
    [key: string]: unknown
  }
  error?: string
  provider?: string
}

export default function ConsultasPage() {
  const [clientName, setClientName] = useState('')
  const [clientDocument, setClientDocument] = useState('')
  const [queryType, setQueryType] = useState<QueryType>('cpf')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ConsultationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await createConsultation({
        client_name: clientName,
        client_document: clientDocument.replace(/\D/g, ''),
        document_type: 'cpf',
        query_type: queryType,
      })

      if (response.success) {
        setResult({
          success: true,
          data: response.data,
          provider: response.provider,
        })
      } else {
        setError(response.error || 'Erro ao realizar consulta')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Consultas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Consulta */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nova Consulta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Cliente
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF
              </label>
              <input
                type="text"
                value={formatCPF(clientDocument)}
                onChange={(e) => setClientDocument(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Consulta
              </label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value as QueryType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cpf">CPF (Dados Cadastrais) ✅</option>
                <option value="inss">INSS (Benefícios) - Em breve</option>
                <option value="telefone">Telefone - Em breve</option>
                <option value="limpa_nome">Limpa Nome (Restrições) - Em breve</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !clientName || !clientDocument}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </form>
        </div>

        {/* Resultado da Consulta */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Resultado</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {result && result.success && (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <p className="text-green-800 font-medium">Consulta realizada com sucesso!</p>
                {result.provider && (
                  <p className="text-green-600 text-sm mt-1">
                    Provider: {result.provider}
                  </p>
                )}
              </div>

              {result.data && (
                <div className="space-y-2">
                  {result.data.nome && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-medium">{result.data.nome}</span>
                    </div>
                  )}
                  {result.data.cpf && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">CPF:</span>
                      <span className="font-medium">{result.data.cpf}</span>
                    </div>
                  )}
                  {result.data.sexo && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Sexo:</span>
                      <span className="font-medium">{result.data.sexo}</span>
                    </div>
                  )}
                  {result.data.dataNascimento && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Data de Nascimento:</span>
                      <span className="font-medium">{result.data.dataNascimento}</span>
                    </div>
                  )}
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Ver dados brutos
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded-md text-xs overflow-auto max-h-64">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {!result && !error && (
            <p className="text-gray-500 text-center py-8">
              Preencha o formulário e clique em "Consultar" para ver o resultado.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
