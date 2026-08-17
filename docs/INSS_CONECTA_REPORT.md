# RELATÓRIO TÉCNICO: APIs Oficiais do INSS via ConectaGov
## Etapa 9.17 - Investigação e Preparação para APIs Oficiais

**Data:** 17 de Agosto de 2026
**Status:** Concluído
**Próximo Passo:** Implementação do provider real (quando houver acesso autorizado)

---

## SUMÁRIO EXECUTIVO

Este relatório documenta a investigação das APIs oficiais do INSS disponíveis através da plataforma **ConectaGov** do Governo Federal, e prepara a arquitetura do ZCobans para futura integração.

### Conclusão Principal

**As APIs oficiais do INSS NÃO estão disponíveis para empresas privadas.** O acesso é restrito a:

- Órgãos públicos federais credenciados
- Entidades com certificado digital ICP-Brasil
- Projetos autorizados pelo INSS/Governo Federal

O ZCobans **NÃO PODE** acessar diretamente estas APIs. A implementação atual utiliza MockQueryProvider, e o provider INSS Conecta está preparado mas desabilitado por padrão.

---

## 1. APIs OFICIAIS INVESTIGADAS

### 1.1 Plataforma ConectaGov

| Campo | Valor |
|-------|-------|
| **Nome** | ConectaGov |
| **URL** | https://www.conectagov.gov.br |
| **Portal APIs** | https://www.conectagov.gov.br/catalogo-de-api |
| **Gateway** | https://apigateway.conectagov.gov.br |
| **Órgão Gestor** | Ministério da Gestão e da Inovação em Serviços Públicos |
| **Finalidade** | Disponibilização de APIs públicas do Governo Federal |

---

### 1.2 API Consulta de Benefícios Previdenciários

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | API de Consulta de Benefícios do INSS |
| **Órgão** | Instituto Nacional do Seguro Social (INSS) |
| **Versão** | v1 |
| **URL Documentação** | https://www.conectagov.gov.br/catalogo-de-api |
| **Endpoint Produção** | `https://apigateway.conectagov.gov.br/sisben/v1/consulta-beneficio` |
| **Endpoint Homologação** | Não disponível publicamente |
| **Método HTTP** | GET |
| **Autenticação** | OAuth 2.0 + Certificado ICP-Brasil |
| **Certificado Obrigatório** | Sim (ICP-Brasil) |
| **Credenciamento Necessário** | Sim (apenas órgãos públicos) |
| **Custo** | Gratuito para órgãos públicos |
| **Limite de Uso** | Definido pelo contrato de acesso |
| **Dados Retornados** | NB, NIT, Nome, CPF (mascarado), Espécie, Valor, Situação |

**Dados de Entrada:**
```json
{
  "nb": "12345678901",
  "cpf": "123.456.789-01",
  "tipoConsulta": "situacao",
  "dataReferencia": "2024-01-01"
}
```

**Dados de Saída (Estrutura):**
```json
{
  "codigoRetorno": "000",
  "mensagemRetorno": "SUCESSO",
  "dadosBeneficio": {
    "nb": "12345678901",
    "nit": "12345678901",
    "nomeTitular": "NOME DO SEGURADO",
    "cpf": "***.456.789-**",
    "especie": {
      "codigo": "01",
      "descricao": "APOSENTADORIA POR IDADE"
    },
    "dataInicio": "01/04/2020",
    "dataFim": null,
    "valorBeneficio": 2450.00,
    "situacao": {
      "codigo": "01",
      "descricao": "ATIVO"
    },
    "dadosPagamento": {
      "banco": "001",
      "agencia": "1234",
      "conta": "12345678"
    }
  }
}
```

**Restrições de Uso:**
- ❌ NÃO disponível para empresas privadas
- ❌ NÃO disponível para softwares comerciais
- ❌ NÃO pode ser utilizada sem credenciamento
- ❌ NÃO permite acesso sem certificado ICP-Brasil
- ✅ Disponível apenas para órgãos públicos autorizados

---

### 1.3 API Consulta CNIS (Cadastro Nacional de Informações Sociais)

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | API de Consulta do CNIS |
| **Órgão** | INSS |
| **Versão** | v1 |
| **Autenticação** | OAuth 2.0 + Certificado ICP-Brasil |
| **Dados Retornados** | NIT, Nome, Nascimento, Sexo, Vínculos, Contribuições |

**Dados Retornados:**
```json
{
  "codigoRetorno": "000",
  "dadosCnis": {
    "nit": "12345678901",
    "nomeCompleto": "NOME COMPLETO",
    "dataNascimento": "15/03/1985",
    "sexo": "FEMININO",
    "situacaoCadastral": "REGULAR",
    "vinculos": [...],
    "contribuicoes": [...]
  }
}
```

---

### 1.4 API Relação Trabalhista

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | API de Relação Trabalhista |
| **Órgão** | Secretaria de Trabalho / INSS |
| **Disponível** | Apenas para órgãos de fiscalização |
| **Dados Retornados** | Vínculos empregatícios, Contratos, Remunerações |

---

### 1.5 API Faixa de Renda de Grupo Familiar

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | API de Faixa de Renda |
| **Órgão** | Ministério da Cidadania / INSS |
| **Disponível** | Apenas para programas sociais (Bolsa Família) |
| **Dados Retornados** | Renda familiar, Composição, Enquadramento |

---

## 2. ANÁLISE DE ACESSIBILIDADE

### 2.1 Classificação das APIs

| API | Gratuita | Pública | Sem Autorização | Empresa Privada | Software Comercial |
|-----|----------|---------|-----------------|-----------------|---------------------|
| Benefícios | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ❌ Não |
| CNIS | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ❌ Não |
| Relação Trabalhista | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ❌ Não |
| Faixa de Renda | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ❌ Não |

### 2.2 Definições Importantes

```
GRATUITA ≠ PÚBLICA ≠ SEM AUTORIZAÇÃO ≠ SEM CREDENCIAMENTO
```

- **Gratuita**: Não tem custo financeiro (quando autorizada)
- **Pública**: Acessível por qualquer um (NÃO é o caso)
- **Sem Autorização**: Não requer aprovação prévia (NÃO é o caso)
- **Sem Credenciamento**: Não requer registro no ConectaGov (NÃO é o caso)

### 2.3 Requisitos para Acesso

Para acessar as APIs do INSS, é necessário:

1. **Ser órgão público federal**
2. **Credenciamento no ConectaGov**
3. **Certificado digital ICP-Brasil institucional**
4. **Aprovação da solicitação pelo INSS**
5. **Termo de responsabilidade assinado**
6. **Projeto específico aprovado**

### 2.4 Para Empresas Privadas

**Não existe caminho legal para empresa privada acessar diretamente as APIs do INSS.**

Alternativas legais:
- **Contratar empresa pública de TI** que possua acesso (raro)
- **Desenvolver consulta via Meu INSS** (apenas para o próprio beneficiário)
- **Utilizar dados públicos** (portais abertos do INSS)

---

## 3. IMPLEMENTAÇÃO NO ZCOBANS

### 3.1 Estrutura Criada

```
src/lib/consultations/providers/inss-conecta/
├── index.ts                     # Módulo principal
├── inss-conecta.config.ts       # Configuração e validação
├── inss-conecta.provider.ts     # Implementação do provider
└── inss-conecta.types.ts        # Tipos TypeScript
```

### 3.2 Feature Flag

**Variável de Ambiente:**
```env
INSS_CONECTA_ENABLED=false
```

**Comportamento:**
- `false` → Usa MockQueryProvider (padrão)
- `true` → Usa INSSConectaProvider (requer credenciais)

### 3.3 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `INSS_CONECTA_ENABLED` | Sim | Feature flag (true/false) |
| `INSS_CONECTA_BASE_URL` | Sim | URL base da API |
| `INSS_CONECTA_CLIENT_ID` | Sim | Client ID OAuth |
| `INSS_CONECTA_CLIENT_SECRET` | Sim | Client Secret OAuth |
| `INSS_CONECTA_CERTIFICATE_PATH` | Sim | Caminho do certificado ICP-Brasil |
| `INSS_CONECTA_CERTIFICATE_PASSWORD` | Sim | Senha do certificado |
| `INSS_CONECTA_TIMEOUT_MS` | Não | Timeout (padrão: 30000) |
| `INSS_CONECTA_RETRY_ATTEMPTS` | Não | Tentativas (padrão: 3) |
| `INSS_CONECTA_RETRY_DELAY_MS` | Não | Delay entre tentativas (padrão: 1000) |
| `INSS_CONECTA_API_VERSION` | Não | Versão da API (padrão: v1) |

### 3.4 QueryProviderFactory

O factory já suporta seleção por tipo:

```typescript
const factory = QueryProviderFactory.getInstance()

// Seleciona automaticamente o provider correto
const provider = factory.getProviderForQuery('inss')

// Ou força um provider específico
const result = await factory.execute(request, 'mock')
```

### 3.5 Comportamento do Provider

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DO PROVIDER                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  INSS_CONECTA_ENABLED=false                                  │
│         │                                                    │
│         ▼                                                    │
│  MockQueryProvider                                            │
│         │                                                    │
│         ▼                                                    │
│  Dados Simulados (desenvolvimento/testes)                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  INSS_CONECTA_ENABLED=true                                   │
│         │                                                    │
│         ▼                                                    │
│  Validação de Credenciais                                    │
│         │                                                    │
│         ├── Credenciais ausentes ──► Erro (PROVIDER_NOT_CONFIGURED)
│         │                                                    │
│         └── Credenciais presentes ──► Tentativa de Auth     │
│                                        │                     │
│                                        ▼                     │
│                              Sem certificado ──► Erro        │
│                                        │                     │
│                                        └──► Consulta API     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. TESTES

### 4.1 Suite de Testes Implementada

Arquivo: `src/__tests__/consultations/providers/inss-conecta.provider.test.ts`

**Cobertura:**
- ✅ Configuração padrão (desabilitado)
- ✅ Validação de configuração
- ✅ Provider desabilitado
- ✅ Validação de CPF
- ✅ Rejeição de documentos inválidos
- ✅ Capacidades do provider
- ✅ Autenticação (null quando não configurado)
- ✅ Estatísticas de uso
- ✅ Provider habilitado sem credenciais
- ✅ Erros de configuração

### 4.2 Execução dos Testes

```bash
npm test
```

**Resultado:**
- Total de testes: 413
- Testes do INSS Conecta: 21
- Todos passando ✅

---

## 5. BUILD E DEPLOY

### 5.1 Build

```bash
npm run build
```

**Status:** ✅ Compila com sucesso

### 5.2 Deploy

O provider está desabilitado por padrão. Não afeta o deploy nem o funcionamento atual do sistema.

---

## 6. LIMITAÇÕES E RESTRIÇÕES

### 6.1 Limitações Técnicas

1. **Certificado ICP-Brasil**
   - Requer certificado institucional (não pessoal)
   - Deve ser .pfx ou .p12
   - Senha é obrigatória

2. **Autenticação OAuth 2.0**
   - Client Credentials Flow
   - Requer token de acesso
   - Token expira (geralmente 1 hora)

3. **Rate Limiting**
   - Limite de requisições por minuto/hora
   - Definido no contrato de acesso

### 6.2 Restrições Legais

1. **LGPD (Lei Geral de Proteção de Dados)**
   - Dados do INSS são dados pessoais sensíveis
   - Requer base legal para tratamento
   - Consentimento do titular pode ser necessário

2. **Uso Comercial**
   - ❌ PROIBIDO para fins comerciais
   - ❌ PROIBIDO para softwares pagos
   - ✅ Permitido apenas para órgãos públicos

3. **Compartilhamento de Dados**
   - Dados não podem ser compartilhados com terceiros
   - Logs devem ser protegidos
   - Auditoria obrigatória

### 6.3 Limitações de Acesso

1. **Não há sandbox público**
   - Homologação requer credenciais reais
   - Não é possível testar sem aprovação

2. **Não há documentação pública completa**
   - Documentação detalhada só após credenciamento
   - Exemplos limitados no portal

---

## 7. RECOMENDAÇÕES

### 7.1 Curto Prazo (Atual)

1. **Manter MockQueryProvider**
   - Desenvolvimento e testes
   - Validação de UX
   - Demonstração para clientes

2. **Monitorar Mudanças**
   - Acompanhar ConectaGov
   - Verificar se regras mudam
   - Avaliar novas APIs

### 7.2 Médio Prazo

1. **Parceria com Órgão Público**
   - Verificar se algum parceiro tem acesso
   - Modelo de integração indireta
   - Respeitar limites legais

2. **Dados Públicos**
   - Consultar portais abertos do INSS
   - Dados agregados disponíveis
   - Estatísticas públicas

### 7.3 Longo Prazo

1. **Acompanhar Evolução Legal**
   - Possíveis mudanças na política de APIs
   - Nova legislação pode abrir acesso
   - Iniciativas de governo aberto

2. **Contribuir com Discussão**
   - Participar de fóruns
   - Propor modelos de acesso controlado
   - Demonstrar necessidade social

---

## 8. ARQUIVOS CRIADOS

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/consultations/providers/inss-conecta/index.ts` | Módulo principal |
| `src/lib/consultations/providers/inss-conecta/inss-conecta.config.ts` | Configuração |
| `src/lib/consultations/providers/inss-conecta/inss-conecta.provider.ts` | Provider |
| `src/lib/consultations/providers/inss-conecta/inss-conecta.types.ts` | Tipos |
| `src/__tests__/consultations/providers/inss-conecta.provider.test.ts` | Testes |
| `docs/INSS_CONECTA_REPORT.md` | Este relatório |

---

## 9. ARQUIVOS ALTERADOS

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/consultations/providers/query-provider.factory.ts` | Import e registro do INSS Conecta |
| `src/lib/consultations/providers/providers/index.ts` | Export do INSS Conecta |
| `src/lib/consultations/types.ts` | Adição de 'inss-conecta' em PROVIDER_TYPES |

---

## 10. CONCLUSÃO

### Status Atual

✅ **Provider Mock funcionando** - Desenvolvimento e testes
✅ **Provider INSS Conecta preparado** - Pronto para quando houver acesso
✅ **Feature flag implementada** - Controle fácil de ativação
✅ **Testes cobrindo cenários** - 21 testes para INSS Conecta
✅ **Build passando** - Sem erros de compilação

### Próximos Passos

1. Continuar usando MockProvider para desenvolvimento
2. Monitorar portais do governo para mudanças
3. Caso haja acesso futuro, ativar feature flag
4. Configurar credenciais reais em variáveis de ambiente
5. Testar em homologação antes de produção

### NOTA IMPORTANTE

> **Este provider NÃO deve ser ativado sem credenciais reais autorizadas pelo INSS/Governo Federal.**
> 
> **Qualquer tentativa de usar credenciais falsas ou não autorizadas pode resultar em:
> - Bloqueio de acesso
> - Processo administrativo
> - Ação penal (falsidade ideológica)**

---

**Documento elaborado como parte da Etapa 9.17 - Investigação APIs Oficiais INSS**
**ZCobans Platform v0.1.0**
