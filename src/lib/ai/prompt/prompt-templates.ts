/**
 * Prompt Templates
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Templates de prompt para geração de landing pages.
 * Estes templates definem como a IA deve ser instruída.
 */

/**
 * System prompt para geração de landing pages
 */
export const GENERATION_SYSTEM_PROMPT = `Você é um especialista em criação de landing pages otimizadas para conversão.

Suas responsabilidades:
1. Analisar o briefing do usuário
2. Criar a estrutura completa da landing page em JSON
3. Seguir EXATAMENTE o schema fornecido
4. Criar conteúdo persuasivo e profissional
5. Otimizar para conversão (CTAs claros, hierarquia visual)

REGRAS OBRIGATÓRIAS:
- NUNCA gere HTML, CSS ou código React
- APENAS gere dados estruturados em JSON válido
- Sempre comece com uma seção do tipo "hero"
- Inclua pelo menos 3 seções diferentes
- Cada seção deve ter pelo menos 1 elemento
- Use textos persuasivos em português brasileiro
- IDs devem ser UUIDs válidos (use crypto.randomUUID())
- O JSON deve ser válido e parseável

TIPOS DE SEÇÃO DISPONÍVEIS:
- hero: Seção principal com título, subtítulo e CTA
- features: Lista de características/diferenciais
- testimonial: Depoimentos de clientes
- cta: Chamada para ação
- faq: Perguntas frequentes
- contact: Formulário de contato
- pricing: Planos e preços
- gallery: Galeria de imagens
- about: Sobre a empresa

TIPOS DE ELEMENTO DISPONÍVEIS:
- heading: Título
- text: Texto/parágrafo
- image: Imagem (use URLs placeholder)
- button: Botão com link
- input: Campo de formulário
- divider: Divisor visual
- spacer: Espaçador
- icon: Ícone

CONFIGURAÇÕES DE COR:
- primary: Azul profundo (#1e40af)
- secondary: Verde (#16a34a)
- accent: Âmbar (#f59e0b)
- dark: Escuro (#0a0f1a)
- light: Claro (#f8fafc)
- gradient: Gradiente

RESPONDA APENAS COM O JSON DA LANDING PAGE, SEM TEXTO ADICIONAL.`

/**
 * Schema JSON que a IA deve seguir (instrução para o prompt)
 */
export const SCHEMA_INSTRUCTION = `
O JSON retornado deve seguir EXATAMENTE esta estrutura:

{
  "title": "Título da Landing Page",
  "description": "Descrição opcional",
  "sections": [
    {
      "type": "hero",
      "title": "Título da Seção",
      "subtitle": "Subtítulo opcional",
      "elements": [
        {
          "type": "heading",
          "content": "Texto do elemento"
        }
      ],
      "settings": {
        "backgroundColor": "primary",
        "alignment": "center",
        "padding": "lg"
      }
    }
  ],
  "settings": {
    "title": "Título para SEO",
    "description": "Meta descrição",
    "primaryColor": "#1e40af",
    "secondaryColor": "#16a34a"
  }
}
`

/**
 * Estilos de landing page
 */
export const STYLE_INSTRUCTIONS: Record<string, string> = {
  modern: `Estilo Moderno:
- Use cores vibrantes e gradientes
- Seções com fundo escuro e claro alternados
- Botões arredondados com sombras
- Tipografia bold e Impactante
- Animações sutis descritas nas configurações`,

  classic: `Estilo Clássico:
- Use cores sóbrias e profissionais
- Seções com fundo branco e bordas suaves
- Botões retos e tradicionais
- Tipografia serifada elegante
- Layout mais conservador e tradicional`,

  minimal: `Estilo Minimalista:
- Use espaço em branco generosamente
- Seções com fundo neutro
- Botões simples sem sombra
- Tipografia limpa e sans-serif
- Foco no conteúdo, poucos elementos`,
}

/**
 * Prompt com exemplos de landing pages prontas
 */
export const EXAMPLE_LANDING_PAGE = `
EXEMPLO DE LANDING PAGE BEM ESTRUTURADA:

{
  "title": "Clínica Saúde+",
  "description": "Clínica médica com atendimento humanizado",
  "sections": [
    {
      "type": "hero",
      "title": "Sua Saúde em Boas Mãos",
      "subtitle": "Atendimento médico humanizado e de qualidade",
      "elements": [
        { "type": "heading", "content": "Agende Sua Consulta Hoje" },
        { "type": "text", "content": "Equipe médica qualificada e infraestrutura moderna para cuidar de você e sua família." },
        { "type": "button", "content": "Agendar Consulta", "props": { "url": "#contato", "variant": "primary" } }
      ],
      "settings": { "backgroundColor": "primary", "alignment": "center", "padding": "lg" }
    },
    {
      "type": "features",
      "title": "Nossos Diferenciais",
      "elements": [
        { "type": "heading", "content": "Por que Escolher a Saúde+?" },
        { "type": "text", "content": "• Equipe com mais de 20 anos de experiência\n• Atendimento no mesmo dia\n• Convênios e particular\n• Localização privilegiada" }
      ],
      "settings": { "backgroundColor": "light", "alignment": "center", "padding": "md" }
    },
    {
      "type": "cta",
      "title": "Não Deixe para Amanhã",
      "subtitle": "Cuide da sua saúde agora",
      "elements": [
        { "type": "button", "content": "Fale Conosco pelo WhatsApp", "props": { "url": "https://wa.me/5511999999999", "variant": "secondary" } }
      ],
      "settings": { "backgroundColor": "gradient", "alignment": "center", "padding": "lg" }
    }
  ],
  "settings": {
    "title": "Clínica Saúde+ | Atendimento Médico Humanizado",
    "description": "Clínica médica com atendimento humanizado e equipe qualificada",
    "primaryColor": "#0ea5e9",
    "secondaryColor": "#16a34a"
  }
}
`
