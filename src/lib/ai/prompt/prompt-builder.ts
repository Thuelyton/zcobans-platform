/**
 * Prompt Builder
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Constrói os prompts otimizados para envio ao provedor de IA.
 */

import type { ChatMessage, LPStyle, SectionType } from '../types'
import {
  GENERATION_SYSTEM_PROMPT,
  SCHEMA_INSTRUCTION,
  STYLE_INSTRUCTIONS,
  EXAMPLE_LANDING_PAGE,
} from './prompt-templates'

/**
 * Parâmetros para construção do prompt
 */
export interface PromptBuilderParams {
  /** Briefing do usuário */
  userPrompt: string
  /** Estilo visual desejado */
  style?: LPStyle
  /** Seções específicas a incluir */
  sections?: SectionType[]
}

/**
 * Resultado da construção do prompt
 */
export interface BuiltPrompt {
  /** Mensagens para enviar ao provider */
  messages: ChatMessage[]
  /** Configurações de resposta */
  responseFormat: { type: 'json_object' }
  /** Temperatura recomendada */
  temperature: number
}

/**
 * Constrói o prompt completo para geração de landing page
 *
 * @param params - Parâmetros para construção
 * @returns Prompt pronto para envio
 *
 * @example
 * ```typescript
 * const prompt = buildGenerationPrompt({
 *   userPrompt: 'Crie uma landing page para clínica de estética',
 *   style: 'modern',
 * })
 *
 * const response = await provider.generate(prompt)
 * ```
 */
export function buildGenerationPrompt(
  params: PromptBuilderParams
): BuiltPrompt {
  const { userPrompt, style, sections } = params

  // System message com instruções
  let systemContent = GENERATION_SYSTEM_PROMPT

  // Adiciona instrução de schema
  systemContent += '\n\n' + SCHEMA_INSTRUCTION

  // Adiciona instrução de estilo se especificado
  if (style && STYLE_INSTRUCTIONS[style]) {
    systemContent += '\n\n' + STYLE_INSTRUCTIONS[style]
  }

  // Adiciona restrição de seções se especificado
  if (sections && sections.length > 0) {
    systemContent += `\n\nSEÇÕES OBRIGATÓRIAS: Inclua apenas os seguintes tipos de seção: ${sections.join(', ')}`
  }

  // Adiciona exemplo para melhorar qualidade
  systemContent += '\n\n' + EXAMPLE_LANDING_PAGE

  // User message com o briefing
  const userMessage = `BRIEFING DO USUÁRIO:
"${userPrompt}"

Gere uma landing page completa e profissional baseada neste briefing. Responda APENAS com o JSON válido.`

  return {
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userMessage },
    ],
    responseFormat: { type: 'json_object' },
    temperature: 0.7,
  }
}

/**
 * Constrói um prompt de correção para quando a IA retorna JSON inválido
 *
 * @param invalidResponse - A resposta inválida da IA
 * @param originalPrompt - O prompt original do usuário
 * @returns Prompt de correção
 */
export function buildCorrectionPrompt(
  invalidResponse: string,
  originalPrompt: string
): BuiltPrompt {
  const systemContent = `Você é um assistente que corrige JSONs de landing pages.

O JSON anterior estava inválido ou não seguia o schema correto.
Corrija o JSON mantendo a intenção original, mas garantindo:
1. Todos os IDs são UUIDs válidos
2. Todos os campos obrigatórios estão presentes
3. O JSON é parseável
4. A estrutura segue o schema definido

RESPONDA APENAS COM O JSON CORRIGIDO, SEM TEXTO ADICIONAL.`

  const userMessage = `JSON INVÁLIDO ANTERIOR:
${invalidResponse}

BRIEFING ORIGINAL:
"${originalPrompt}"

Corrija o JSON e retorne a versão válida.`

  return {
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userMessage },
    ],
    responseFormat: { type: 'json_object' },
    temperature: 0.3, // Temperatura mais baixa para correções
  }
}
