# ETAPA 9.18 - Arquitetura de Providers do Motor de Consultas

**Data:** 17 de Agosto de 2026
**Status:** Concluído

---

## RESUMO

A ETAPA 9.18 fortaleceu o Motor de Consultas do ZCobans com:

1. **MockProvider determinístico** - Sem Math.random() em testes
2. **ProviderRegistry** - Registry central para múltiplos providers
3. **QueryProviderFactory** - Factory com fallback inteligente por ambiente
4. **Sistema de créditos** - Estrutura preparada para cobrança futura
5. **Testes determinísticos** - Todos passando 100%

---

## ARQUITETURA FINAL

```
src/lib/consultations/
├── types.ts                    # Tipos centrais
├── constants.ts                # Constantes
├── consultation.service.ts     # Service layer
├── consultation.actions.ts     # Server Actions
├── credits.ts                  # Sistema de créditos (novo)
├── index.ts                    # exports
│
└── providers/
    ├── index.ts                # exports
    ├── query-provider.interface.ts  # Interface base
    ├── query-provider.factory.ts    # Factory (atualizado)
    ├── provider-registry.ts         # Registry (novo)
    ├── query-provider.types.ts      # Tipos
    │
    ├── mock/
    │   ├── mock-query.provider.ts   # Mock determinístico (atualizado)
    │   ├── mock-data.ts             # Dados determinísticos (atualizado)
    │   └── mock-document.ts
    │
    └── inss-conecta/
        ├── inss-conecta.provider.ts
        ├── inss-conecta.config.ts
        ├── inss-conecta.types.ts
        └── index.ts
```

---

## COMPONENTES

### 1. ProviderRegistry

Registry central para gerenciar múltiplos providers.

```typescript
import { ProviderRegistry } from '@/lib/consultations/providers'

const registry = ProviderRegistry.getInstance()

// Registrar provider
registry.register({
  id: 'serasa-cpf',
  name: 'Serasa CPF',
  type: 'serasa',
  provider: serasaProvider,
  supportedQueryTypes: ['cpf'],
  enabled: true,
  priority: 10, // Menor = maior prioridade
  environments: ['production'],
  isMock: false,
  costPerQuery: 100, // R$ 1,00
})

// Buscar provider
const result = registry.findProvider({
  queryType: 'cpf',
  environment: 'production',
  includeMock: false,
})

if (result) {
  const queryResult = await result.provider.execute(request)
}
```

**Features:**
- Seleção por tipo de consulta
- Seleção por ambiente (development/test/production)
- Prioridade entre providers
- Controle de mock em produção
- Estatísticas de uso

---

### 2. QueryProviderFactory (Atualizada)

Factory com comportamento inteligente por ambiente.

```typescript
import { QueryProviderFactory } from '@/lib/consultations/providers'

// Em desenvolvimento
const devFactory = QueryProviderFactory.getInstance({ mode: 'development' })
// Usa mock como fallback

// Em produção
const prodFactory = QueryProviderFactory.getInstance({ mode: 'production' })
// SEM fallback para mock
// Retorna erro se não houver provider real

// Executar consulta
const result = await factory.execute({
  document: '12345678901',
  documentType: 'cpf',
  queryType: 'cpf',
})

// Verificar se usou mock
if (result.wasFallback) {
  console.log('Usando dados simulados')
}
```

**Comportamento por ambiente:**

| Ambiente | Mock Provider | Fallback | Erro sem provider real |
|----------|---------------|----------|------------------------|
| development | ✅ Sim | ✅ Auto | ❌ Não |
| test | ✅ Sim | ✅ Auto | ❌ Não |
| production | ❌ Não (padrão) | ❌ Não | ✅ Sim |

---

### 3. MockProvider Determinístico

Provider mock que sempre retorna os mesmos resultados para os mesmos inputs.

```typescript
import { MockQueryProvider } from '@/lib/consultations/providers'

// Sucesso (padrão)
const successProvider = new MockQueryProvider({ scenario: 'success' })

// Erro
const errorProvider = new MockQueryProvider({ scenario: 'error' })

// Timeout
const timeoutProvider = new MockQueryProvider({ scenario: 'timeout' })

// Resposta inválida
const invalidProvider = new MockQueryProvider({ scenario: 'invalid_response' })
```

**Cenários disponíveis:**
- `success` - Retorna dados simulados
- `error` - Retorna erro simulado
- `timeout` - Retorna timeout
- `invalid_response` - Retorna dados malformados

**Dados determinísticos:**
- Mesmo input = mesmo output
- Não usa Math.random()
- Timestamps fixos
- Scores determinísticos

---

### 4. Sistema de Créditos

Estrutura para controle de créditos (não implementa cobrança real).

```typescript
import { CreditsService } from '@/lib/consultations/credits'

const credits = new CreditsService()

// Verificar saldo
const check = await credits.checkBalance(userId, 'cpf', 'serasa')
if (!check.sufficient) {
  throw new Error('Créditos insuficientes')
}

// Debitar créditos
const transaction = await credits.debit(userId, {
  consultationId: '123',
  queryType: 'cpf',
  providerType: 'serasa',
  amount: 100, // R$ 1,00
})

// Refund em caso de erro
await credits.refund(transaction.id, 'Erro no provider')
```

**Regras:**
- Mock queries são gratuitas (não debitam)
- Consulta que falha antes de processamento não consome crédito
- Refund disponível para erros após processamento

---

## COMO ADICIONAR UM NOVO PROVIDER REAL

### Passo 1: Criar o Provider

```typescript
// src/lib/consultations/providers/serasa/serasa.provider.ts

import type { IQueryProvider } from '../query-provider.interface'
import type { QueryRequest, QueryResult, ProviderCapability } from '../../types'

export class SerasaProvider implements IQueryProvider {
  readonly name = 'Serasa Provider'
  readonly type = 'serasa'
  readonly active = true

  async execute(request: QueryRequest): Promise<QueryResult> {
    // Implementar chamada à API Serasa
    // ...
  }

  validate(request: QueryRequest): boolean {
    // Implementar validação
    // ...
  }

  getCapabilities(): ProviderCapability[] {
    return [
      {
        queryType: 'cpf',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta CPF via Serasa',
      },
      {
        queryType: 'limpa_nome',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta restrições via Serasa',
      },
    ]
  }
}
```

### Passo 2: Criar Config

```typescript
// src/lib/consultations/providers/serasa/serasa.config.ts

export interface SerasaConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
  baseUrl: string
  timeout: number
}

export function getSerasaConfig(): SerasaConfig {
  return {
    enabled: process.env.SERASA_ENABLED === 'true',
    clientId: process.env.SERASA_CLIENT_ID || '',
    clientSecret: process.env.SERASA_CLIENT_SECRET || '',
    baseUrl: process.env.SERASA_BASE_URL || 'https://api.serasa.com.br',
    timeout: parseInt(process.env.SERASA_TIMEOUT_MS || '30000'),
  }
}
```

### Passo 3: Registrar no Factory

```typescript
// Em algum lugar da inicialização

import { QueryProviderFactory } from '@/lib/consultations/providers'
import { SerasaProvider } from '@/lib/consultations/providers/serasa'
import { getSerasaConfig } from '@/lib/consultations/providers/serasa'

const config = getSerasaConfig()

if (config.enabled) {
  const factory = QueryProviderFactory.getInstance()
  const serasaProvider = new SerasaProvider()

  factory.register('serasa', serasaProvider, {
    id: 'serasa-001',
    slug: 'serasa',
    type: 'serasa',
    active: true,
    priority: 10, // Alta prioridade
    environments: ['production'],
    costPerQuery: 100, // R$ 1,00
  })
}
```

### Passo 4: Configurar Variáveis de Ambiente

```env
# .env.local
SERASA_ENABLED=true
SERASA_CLIENT_ID=seu_client_id
SERASA_CLIENT_SECRET=seu_client_secret
SERASA_BASE_URL=https://api.serasa.com.br
SERASA_TIMEOUT_MS=30000
```

### Passo 5: Criar Testes

```typescript
// src/__tests__/consultations/providers/serasa.provider.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { SerasaProvider } from '@/lib/consultations/providers/serasa'

describe('SerasaProvider', () => {
  let provider: SerasaProvider

  beforeEach(() => {
    provider = new SerasaProvider()
  })

  it('should have correct name', () => {
    expect(provider.name).toBe('Serasa Provider')
  })

  it('should validate CPF', () => {
    expect(provider.validate({
      document: '12345678901',
      documentType: 'cpf',
      queryType: 'cpf',
    })).toBe(true)
  })
})
```

---

## EXEMPLO: INTEGRAÇÃO FUTURA COM INSS CONECTA

```typescript
// src/lib/consultations/providers/inss-conecta/inss-conecta.provider.ts

import { IQueryProvider } from '../query-provider.interface'

export class INSSConectaProvider implements IQueryProvider {
  readonly name = 'INSS Conecta Provider'
  readonly type = 'inss-conecta'
  readonly active = true

  async execute(request: QueryRequest): Promise<QueryResult> {
    // 1. Obter token de autenticação
    const token = await this.getAuthToken()

    // 2. Chamar API do ConectaGov
    const response = await fetch(
      `${this.config.baseUrl}/beneficios/consulta`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf: request.document }),
      }
    )

    // 3. Processar resposta
    const data = await response.json()

    return {
      success: data.codigoRetorno === '000',
      rawData: data,
      processedData: this.processData(data),
      score: 100,
    }
  }

  // ...
}

// Registro
const factory = QueryProviderFactory.getInstance()
factory.register('inss-conecta', new INSSConectaProvider(), {
  id: 'inss-conecta-001',
  slug: 'inss-conecta',
  type: 'inss-conecta',
  active: isINSSConectaProviderReady(),
  priority: 5, // Máxima prioridade
  environments: ['production'],
  costPerQuery: 0, // Gratuito para órgãos públicos
})
```

---

## SEGURANÇA

### Checklist

- [x] Autenticação obrigatória para executar consultas
- [x] RLS (Row Level Security) no Supabase
- [x] Isolamento por user_id
- [x] CPF mascarado em logs
- [x] Validação Zod em todos os inputs
- [x] Nenhuma credencial exposta no client
- [x] Providers externos somente no servidor
- [x] Mock bloqueado em produção (configurável)

### Regras de Segurança

1. **Nunca expor credenciais no client-side**
2. **Sempre mascarar CPF em logs**
3. **Usar Server Actions para operações**
4. **Validar todas as entradas com Zod**
5. **RLS configurado no Supabase**

---

## CRÉDITOS

### Estrutura

```typescript
interface CreditBalance {
  userId: string
  balance: number        // Saldo atual
  totalUsed: number      // Total utilizado
  totalGranted: number   // Total concedido
  totalRefunded: number  // Total devolvido
}

interface CreditTransaction {
  id: string
  userId: string
  consultationId?: string
  type: 'debit' | 'refund' | 'grant' | 'expiry'
  amount: number         // Negativo = débito, Positivo = crédito
  balanceAfter: number
  status: 'pending' | 'completed' | 'refunded'
}
```

### Regras

1. Mock queries = gratuito (não debitam)
2. Erro antes de processamento = não consome crédito
3. Erro após processamento = pode gerar refund
4. Custo configurável por provider

---

## TESTES

### Suite de Testes

| Arquivo | Testes | Status |
|---------|--------|--------|
| mock-query.provider.test.ts | 25 | ✅ |
| provider-registry.test.ts | 18 | ✅ |
| query-provider.factory.test.ts | 22 | ✅ |
| credits.test.ts | 16 | ✅ |
| inss-conecta.provider.test.ts | 21 | ✅ |
| **Total** | **467** | **✅ Todos passando** |

### Garantias

- Todos os testes são determinísticos
- Não dependem de Math.random()
- Não dependem de ordem de execução
- Não dependem de estado externo

---

## ARQUIVOS CRIADOS

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/consultations/providers/provider-registry.ts` | Registry central |
| `src/lib/consultations/credits.ts` | Sistema de créditos |
| `src/__tests__/consultations/providers/provider-registry.test.ts` | Testes do Registry |
| `src/__tests__/consultations/credits.test.ts` | Testes de créditos |
| `docs/ETAPA_9_18_PROVIDER_ARCHITECTURE.md` | Este documento |

## ARQUIVOS ALTERADOS

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/consultations/providers/mock/mock-query.provider.ts` | Determinístico + cenários |
| `src/lib/consultations/providers/mock/mock-data.ts` | Dados determinísticos |
| `src/lib/consultations/providers/query-provider.factory.ts` | Modo + fallback inteligente |
| `src/lib/consultations/providers/index.ts` | Novos exports |
| `src/lib/consultations/index.ts` | Novos exports |
| `src/__tests__/consultations/providers/mock-query.provider.test.ts` | Determinístico |
| `src/__tests__/consultations/providers/query-provider.factory.test.ts` | Atualizado |

---

## PRÓXIMOS PASSOS

1. **Decidir provider real** para implementar primeiro
2. **Cadastrar em API** (Serasa, Boa Vista, etc.)
3. **Implementar provider** seguindo guia acima
4. **Configurar variáveis** de ambiente
5. **Testar em homologação**
6. **Deploy em produção**

---

**Fim do documento - ETAPA 9.18 Concluída**
