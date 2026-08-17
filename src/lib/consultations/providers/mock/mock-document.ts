/**
 * Mock Document Generator
 * Etapa 9.16 - Motor de Consultas
 *
 * Gera documento de teste para desenvolvimento.
 * 
 * ⚠️ IMPORTANTE:
 * - Este é um DOCUMENTO DE TESTE
 * - NÃO é documento oficial do INSS
 * - NÃO utilize em produção
 * - Identificado claramente como MOCK
 */

import type { QueryType } from '../../types'

/**
 * Dados do documento mock
 */
export interface MockDocument {
  /** ID do documento */
  id: string
  /** Tipo de consulta */
  queryType: QueryType
  /** Conteúdo do documento (texto) */
  content: string
  /** Metadados */
  metadata: {
    mock: true
    environment: 'development'
    generatedAt: string
    warning: string
  }
}

/**
 * Gera um documento de teste para a consulta
 * 
 * @param consultationId - ID da consulta
 * @param queryType - Tipo de consulta
 * @param clientDocument - Documento do cliente (mascarado)
 * @returns Documento de teste
 */
export function generateMockDocument(
  consultationId: string,
  queryType: QueryType,
  clientDocument: string
): MockDocument {
  const now = new Date().toISOString()
  const maskedDoc = maskDocumentForDocument(clientDocument)

  const content = generateDocumentContent(queryType, maskedDoc, now)

  return {
    id: `doc_${consultationId}`,
    queryType,
    content,
    metadata: {
      mock: true,
      environment: 'development',
      generatedAt: now,
      warning: 'DOCUMENTO DE TESTE — ZCOBANS — MOCK — NÃO É DOCUMENTO OFICIAL',
    },
  }
}

/**
 * Gera conteúdo do documento baseado no tipo de consulta
 */
function generateDocumentContent(
  queryType: QueryType,
  maskedDocument: string,
  generatedAt: string
): string {
  const header = `
================================================================================
                    DOCUMENTO DE TESTE — ZCOBANS — MOCK
================================================================================
ATENÇÃO: Este é um documento simulado para desenvolvimento.
         NÃO é um documento oficial do INSS ou qualquer órgão público.
         NÃO utilize como prova de consulta real.
================================================================================

Tipo de Consulta: ${queryType.toUpperCase()}
Documento: ${maskedDocument}
Data de Geração: ${generatedAt}
ID do Documento: DOC-MOCK-${Date.now()}

================================================================================
                           CONTEÚDO SIMULADO
================================================================================
`

  const body = generateQuerySpecificContent(queryType)

  const footer = `
================================================================================
                    FIM DO DOCUMENTO DE TESTE
================================================================================
Este documento foi gerado pelo MockProvider do ZCobans.
Ambiente: Desenvolvimento
Data: ${generatedAt}
================================================================================
`

  return header + body + footer
}

/**
 * Gera conteúdo específico por tipo de consulta
 */
function generateQuerySpecificContent(queryType: QueryType): string {
  switch (queryType) {
    case 'cpf':
      return `
DADOS CADASTRAIS SIMULADOS
--------------------------
Nome: [DADOS SIMULADOS]
Data de Nascimento: [DADOS SIMULADOS]
Situação Cadastral: [DADOS SIMULADOS]

NOTA: Estes são dados fictícios para teste.
`
    case 'inss':
      return `
DADOS DE BENEFÍCIO SIMULADOS
-----------------------------
Tipo de Benefício: [DADOS SIMULADOS]
Número do Benefício: [DADOS SIMULADOS]
Data de Início: [DADOS SIMULADOS]
Valor do Benefício: [DADOS SIMULADOS]
Situação: [DADOS SIMULADOS]

NOTA: Estes são dados fictícios para teste.
`
    case 'fgts':
      return `
SALDO FGTS SIMULADO
--------------------
Empresa: [DADOS SIMULADOS]
Saldo Atual: [DADOS SIMULADOS]
Data do Saldo: [DADOS SIMULADOS]

NOTA: Estes são dados fictícios para teste.
`
    case 'telefone':
      return `
DADOS TELEFÔNICOS SIMULADOS
-----------------------------
Número: [DADOS SIMULADOS]
Operadora: [DADOS SIMULADOS]
Tipo: [DADOS SIMULADOS]

NOTA: Estes são dados fictícios para teste.
`
    case 'limpa_nome':
      return `
DADOS DE RESTRIÇÕES SIMULADOS
------------------------------
Possui Restrições: [DADOS SIMULADOS]
Quantidade: [DADOS SIMULADOS]
Valor Total: [DADOS SIMULADOS]

NOTA: Estes são dados fictícios para teste.
`
    default:
      return `
DADOS SIMULADOS
----------------
Tipo de consulta não especificado.

NOTA: Estes são dados fictícios para teste.
`
  }
}

/**
 * Mascara documento para exibição no documento
 */
function maskDocumentForDocument(document: string): string {
  const digits = document.replace(/\D/g, '')
  if (digits.length === 11) {
    return `***.***.${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  if (digits.length === 14) {
    return `**.***.***/${digits.slice(8, 12)}-${digits.slice(12)}`
  }
  return '***'
}
