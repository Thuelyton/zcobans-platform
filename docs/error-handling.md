# Tratamento de Erros - Documentação

## Visão Geral

O projeto implementa um sistema padronizado de tratamento de erros via `ActionResult` e funções utilitárias em `src/lib/errors.ts`.

---

## Tipo Principal: ActionResult

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }
```

### Uso
- **Server Actions** retornam `ActionResult` para operações de escrita
- **Queries** throw errors que são capturados pelo caller
- **Formulários** verificam `result.success` para mostrar erros

---

## Códigos de Erro

```typescript
const ErrorCode = {
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DATABASE: 'DATABASE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
}
```

---

## Funções Utilitárias

### success()
```typescript
function success<T>(data: T): ActionResult<T>
```
Retorna resultado de sucesso.

### createError()
```typescript
function createError(message: string, code?: ErrorCode): ActionResult<never>
```
Retorna resultado de erro.

---

## Funções de Tratamento

### handleValidationError()
```typescript
function handleValidationError(result: z.ZodError): ActionResult<never>
```

**Formato da mensagem:**
```
campo: mensagem, campo2: mensagem2
```

### handleSupabaseError()
```typescript
function handleSupabaseError(err: { message: string; code?: string }): ActionResult<never>
```

**Sanitiza** mensagens do Supabase para mensagens amigáveis.

### sanitizeErrorMessage()
Mapeia erros do Supabase:

| Erro Original | Mensagem Sanitizada |
|---------------|---------------------|
| `relation "..." does not exist` | Recurso não encontrado |
| `duplicate key value violates unique constraint` | Já existe um registro com este valor |
| `violates foreign key constraint` | Referência inválida |
| `violates not-null constraint` | Campo obrigatório não preenchido |
| `invalid input syntax for type` | Formato de dados inválido |
| `permission denied for table` | Sem permissão para acessar este recurso |
| `permission denied for function` | Sem permissão para executar esta operação |

**Em produção:** Erros desconhecidos retornam "Erro interno do servidor"
**Em desenvolvimento:** Erros desconhecidos retornam a mensagem original

---

## Funções de Validação

### validateData()
```typescript
function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ActionResult<T>
```

**Uso:**
```typescript
const result = validateData(schema, data)
if (!result.success) return result
```

---

## Funções Supabase

### executeSupabaseOperation()
```typescript
async function executeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: ... }>
): Promise<ActionResult<T>>
```

**Uso para queries:**
```typescript
const result = await executeSupabaseOperation(async () =>
  await supabase.from('table').select('*')
)
```

### executeSupabaseMutation()
```typescript
async function executeSupabaseMutation(
  operation: () => Promise<{ error: ... }>
): Promise<ActionResult<void>>
```

**Uso para mutations:**
```typescript
const result = await executeSupabaseMutation(async () =>
  await supabase.from('table').insert(data)
)
```

---

## Fluxo de Erro

### Server Action → Formulário

```
1. Formulário chama Server Action
2. Server Action valida dados
3. Se erro de validação → retorna ActionResult com erro
4. Se sucesso, executa Supabase
5. Se erro do Supabase → sanitiza e retorna ActionResult
6. Formulário recebe resultado
7. Se !result.success → mostra erro
```

### Exemplo Completo

```typescript
// Server Action
export async function createEntity(data: FormData) {
  const supabase = await createClient()
  
  // 1. Validação
  const validation = validateData(schema, data)
  if (!validation.success) return validation
  
  // 2. Mutations
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('table').insert(validation.data)
  )
  
  // 3. Revalidação
  if (result.success) revalidatePath('/admin/entities')
  
  return result
}

// Formulário
async function onSubmit(data: FormData) {
  const result = await createEntity(data)
  
  if (!result.success) {
    setError(result.error)  // Mostra erro
  } else {
    onSuccess()  // Sucesso
  }
}
```

---

## Tratamento de Erros nas Páginas

### Dashboard
```typescript
try {
  const data = await getDashboardStats()
  // Usa dados
} catch (error) {
  // Fallback para dados vazios
  stats = emptyStats
}
```

### Queries com Throw
```typescript
export async function getEntities() {
  const result = await executeSupabaseOperation(...)
  if (!result.success) throw new Error(result.error)
  return result.data
}
```

---

## Testes

| Arquivo | Testes |
|---------|--------|
| `errors.test.ts` | 19 |
| `slug.test.ts` | 30 |
| **Total** | **49** |

### Cenários Testados
- Criação de success/error
- Validação Zod
- Sanitização de erros Supabase
- Operações Supabase (sucesso/erro)
- Mutations (sucesso/erro)
- Erros inesperados

---

## Notas

1. **Sem Error Boundaries** - Erros não são capturados granularmente na UI
2. **Sem retry automático** - Operações falhadas não são retentadas
3. **Sem logging** - Erros não são logados (apenas retornados)
4. **Mensagens em PT-BR** - Todas as mensagens são em português
