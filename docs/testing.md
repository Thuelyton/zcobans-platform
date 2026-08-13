# Testes - Documentação

## Visão Geral

O projeto utiliza **Vitest** para testes unitários, com **@testing-library/react** para testes de componentes.

---

## Stack de Testes

| Pacote | Versão | Uso |
|--------|--------|-----|
| vitest | 4.1.0 | Test runner |
| @testing-library/react | 16.3.2 | Testes de componentes |
| @testing-library/jest-dom | 6.9.1 | Matchers de DOM |
| jsdom | 29.0.1 | Ambiente de teste |

---

## Estrutura

```
src/__tests__/
├── actions/
│   └── service.test.ts         # Testes de Server Actions
├── lib/
│   ├── errors.test.ts          # Testes de error handling
│   └── slug.test.ts            # Testes de geração de slug
├── validations/
│   ├── banner.test.ts          # Testes de validação banner
│   ├── category.test.ts        # Testes de validação category
│   ├── lead.test.ts            # Testes de validação lead
│   ├── service.test.ts         # Testes de validação service
│   └── status.test.ts          # Testes de validação status
└── setup.ts                    # Setup dos testes
```

---

## Configuração

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### setup.ts
```typescript
import '@testing-library/jest-dom'
```

---

## Cobertura

### Resumo

| Categoria | Arquivos | Testes |
|-----------|----------|--------|
| Validações | 5 | 77 |
| Utilitários | 2 | 49 |
| Actions | 1 | 2 |
| **Total** | **8** | **125** |

### Detalhamento

| Arquivo | Testes | Descrição |
|---------|--------|-----------|
| `banner.test.ts` | 17 | Validação de banners |
| `category.test.ts` | 5 | Validação de categorias |
| `lead.test.ts` | 25 | Validação de leads |
| `service.test.ts` | 5 | Validação de serviços |
| `status.test.ts` | 25 | Validação de status |
| `errors.test.ts` | 19 | Sistema de erros |
| `slug.test.ts` | 30 | Geração de slugs |
| `service.test.ts` (actions) | 2 | Server Actions |

---

## Cenários Testados

### Validações

#### Banner
- ✅ Banner válido
- ✅ Banner sem datas
- ✅ Datas vazias
- ✅ Datas válidas
- ✅ Apenas starts_at
- ✅ Apenas ends_at
- ✅ Datas invertidas (erro)
- ✅ Datas inválidas
- ✅ Título ausente
- ✅ URL inválida
- ✅ Título > 255 chars
- ✅ Subtítulo > 255 chars
- ✅ Botão > 100 chars
- ✅ Posição negativa
- ✅ Formatos de data
- ✅ Todos os campos

#### Category
- ✅ Categoria válida
- ✅ Nome ausente
- ✅ Slug ausente
- ✅ Slug inválido
- ✅ Dados válidos

#### Lead
- ✅ Lead válido
- ✅ Campos obrigatórios ausentes
- ✅ Email inválido
- ✅ Telefone inválido
- ✅ Valores de enum inválidos
- ✅ Strings vazias
- ✅ Limites de tamanho
- ✅ Campos opcionais

#### Service
- ✅ Serviço válido
- ✅ Nome ausente
- ✅ Slug inválido
- ✅ Categoria inválida
- ✅ Dados válidos

#### Status
- ✅ Status válido
- ✅ Campos obrigatórios ausentes
- ✅ UUID inválido
- ✅ Status inválido
- ✅ Todos os status
- ✅ Mensagem > 1000 chars
- ✅ Mensagens null/undefined

### Utilitários

#### Errors
- ✅ Criação de success
- ✅ Criação de error
- ✅ Formatação de erros Zod
- ✅ Sanitização de erros Supabase
- ✅ validateData
- ✅ executeSupabaseOperation
- ✅ executeSupabaseMutation
- ✅ Erros inesperados

#### Slug
- ✅ Slug simples
- ✅ Conversão para lowercase
- ✅ Múltiplos espaços
- ✅ Acentos
- ✅ Caracteres especiais
- ✅ Hífens múltiplos
- ✅ Hífens no início/fim
- ✅ String vazia
- ✅ Null/undefined
- ✅ Apenas caracteres inválidos
- ✅ Conteúdo misto
- ✅ Caracteres portugueses
- ✅ Números
- ✅ Slug já válido
- ✅ Trim de espaços
- ✅ Validação de slug válido
- ✅ Slug com números
- ✅ Slug vazio
- ✅ Slug com uppercase
- ✅ Slug com espaços
- ✅ Slug com caracteres especiais
- ✅ Slug começando com hífen
- ✅ Slug terminando com hífen
- ✅ Hífens consecutivos
- ✅ Null/undefined
- ✅ Slug com acentos
- ✅ Slug de palavra única
- ✅ Slug só com números

### Actions
- ✅ Erro de validação
- ✅ Insert no Supabase

---

## Executar Testes

```bash
# Executar todos os testes
npm test

# Executar em watch mode
npm run test:watch

# Executar com coverage
npm run test:coverage
```

---

## Adicionar Novos Testes

### Estrutura Básica
```typescript
import { describe, it, expect } from 'vitest'
import { functionToTest } from '@/path/to/module'

describe('Module Name', () => {
  it('should do something', () => {
    const result = functionToTest(input)
    expect(result).toBe(expected)
  })
})
```

### Testando Validação Zod
```typescript
import { schema } from '@/lib/validations/entity'

describe('Entity Validation', () => {
  it('should validate correct data', () => {
    const result = schema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should fail with invalid data', () => {
    const result = schema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
```

---

## Notas

1. **Sem testes E2E** - Apenas testes unitários
2. **Sem testes de componente** - Componentes não são testados
3. **Sem coverage configurado** - Script de coverage não definido
4. **Mock limitado** - Apenas Supabase client é mockado
