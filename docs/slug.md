# Slug - Documentação

## Visão Geral

O sistema de slugs gera URLs amigáveis a partir de nomes/títulos, com validação e tratamento de caracteres especiais.

## Localização

- **Utilitário:** `src/lib/slug.ts`
- **Validação:** Integrada nos schemas `categorySchema` e `serviceSchema`
- **Formulários:** Auto-geração em `CategoryForm.tsx` e `ServiceForm.tsx`

---

## Funções

### generateSlug()

```typescript
function generateSlug(input: string): string
```

Gera um slug válido a partir de uma string.

**Regras:**
1. Converte para minúsculas
2. Remove acentos
3. Substitui espaços por hífens
4. Remove caracteres especiais
5. Colapsa hífens duplicados
6. Remove hífens no início/fim
7. Retorna string vazia se não houver caracteres válidos

**Exemplos:**

| Entrada | Resultado |
|---------|-----------|
| `Hello World` | `hello-world` |
| `HELLO WORLD` | `hello-world` |
| `Multiple   Spaces` | `multiple-spaces` |
| `Serviço de Qualidade` | `servico-de-qualidade` |
| `Café com Açúcar` | `cafe-com-acucar` |
| `João da Silva` | `joao-da-silva` |
| `Hello---World` | `hello-world` |
| `-Hello World-` | `hello-world` |
| `Hello! @World#` | `hello-world` |
| `  Hello World  ` | `hello-world` |
| `100% Profissional` | `100-profissional` |
| `São Paulo` | `sao-paulo` |
| `Florianópolis` | `florianopolis` |
| `!@#$%^&*()` | *(string vazia)* |

---

### isValidSlug()

```typescript
function isValidSlug(slug: string): boolean
```

Valida se um slug está no formato correto.

**Regras:**
1. Não pode ser vazio
2. Apenas letras minúsculas, números e hífens
3. Não pode começar ou terminar com hífen
4. Não pode ter hífens consecutivos

**Exemplos:**

| Slug | Válido |
|------|--------|
| `hello-world` | ✅ |
| `hello-world-123` | ✅ |
| `hello` | ✅ |
| `123` | ✅ |
| `` | ❌ |
| `Hello-World` | ❌ |
| `hello world` | ❌ |
| `hello!world` | ❌ |
| `-hello-world` | ❌ |
| `hello-world-` | ❌ |
| `hello--world` | ❌ |
| `serviço` | ❌ |
| `null` | ❌ |
| `undefined` | ❌ |

---

## Mapa de Acentos

```typescript
const ACCENT_MAP = {
  'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
  'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
  'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
  'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
  'ç': 'c', 'ñ': 'n',
  // ... maiúsculas também
}
```

---

## Integração com Validação

### Schemas
```typescript
import { isValidSlug } from '@/lib/slug'

const categorySchema = z.object({
  slug: z.string().min(1).refine(isValidSlug, {
    message: 'Slug inválido. Use apenas letras minúsculas, números e hífens.',
  }),
})
```

---

## Auto-Geração nos Formulários

### CategoryForm
```typescript
const watchName = watch('name')
const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

useEffect(() => {
  if (!isSlugManuallyEdited && watchName) {
    const generatedSlug = generateSlug(watchName)
    setValue('slug', generatedSlug, { shouldValidate: true })
  }
}, [watchName, isSlugManuallyEdited, setValue])
```

### Comportamento
1. Slug é gerado automaticamente ao digitar o nome
2. Usuário pode editar o slug manualmente
3. Após edição manual, auto-geração é desativada
4. Em edição, slug existente é preservado

---

## Campos Slug no Projeto

| Tabela | Campo | Schema |
|--------|-------|--------|
| `service_categories` | `slug` | `categorySchema` |
| `services` | `slug` | `serviceSchema` |

---

## Testes

| Teste | Descrição |
|-------|-----------|
| Slug simples | `Hello World` → `hello-world` |
| Lowercase | `HELLO` → `hello` |
| Múltiplos espaços | `a   b` → `a-b` |
| Acentos | `Serviço` → `servico` |
| Caracteres especiais | `a!@b` → `a-b` |
| Hífens múltiplos | `a---b` → `a-b` |
| Hífens no início/fim | `-a-` → `a` |
| String vazia | `''` → `''` |
| Null/undefined | `null` → `''` |
| Só especiais | `!@#` → `''` |
| Números | `123` → `123` |
| Português | `São Paulo` → `sao-paulo` |

**Total de testes:** 30

---

## Notas

1. **Sem slug unique check** - A validação de unicidade é feita pelo banco (constraint UNIQUE)
2. **Sem debounce** - Geração é imediata a cada tecla
3. **Sem preview** - Usuário não vê a URL final
4. **Sem histórico** - Slug não pode ser recuperado após alteração
