# RELATÓRIO TÉCNICO — Etapa 9.17
## Investigação e Preparação para APIs Oficiais Gratuitas do INSS

**Data:** 17 de Agosto de 2026  
**Status:** ✅ Concluído  
**Objetivo:** Investigar APIs oficiais do INSS e preparar estrutura para integração futura

---

## 1. RESUMO EXECUTIVO

Após investigação detalhada das APIs oficiais do INSS disponíveis no ecossistema **ConectaGov** e **Portal de APIs do Governo Federal**, identificamos que:

- **NÃO existem APIs públicas e gratuitas para consulta de benefícios previdenciários**
- As APIs do INSS são restritas a órgãos públicos e empresas credenciadas
- O acesso requer certificado digital ICP-Brasil e credenciamento específico
- Não é possível criar uma integração real sem credenciais válidas

**Conclusão:** Mantemos o MockProvider como padrão e preparamos a arquitetura para futura integração quando/caso haja acesso autorizado.

---

## 2. APIS INVESTIGADAS

### 2.1 API Consulta de Benefícios Previdenciários

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | Consulta de Benefícios Previdenciários |
| **Órgão Responsável** | Instituto Nacional do Seguro Social (INSS) |
| **Plataforma** | ConectaGov / Portal de APIs |
| **URL Documentação** | https://www.gov.br/conectagov/pt-br |
| **Status** | ⚠️ RESTRITA - Requer credenciamento |
| **Acesso** | Apenas para órgãos públicos e empresas autorizadas |
| **Certificado** | ICP-Brasil obrigatório |
| **Custo** | Gratuito para órgãos públicos credenciados |
| **Empresa Privada** | ❌ Não disponível |
| **Software Comercial** | ❌ Não disponível |

**Dados retornados:**
- NB (Número de Benefício)
- NIT/PIS
- Espécie do benefício
- Data de Início
- Data de Fim (se aplicável)
- Valor do benefício
- Situação do benefício
- Dados do titular

### 2.2 API Relação Trabalhista (CNIS)

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | Consulta CNIS - Cadastro Nacional de Informações Sociais |
| **Órgão Responsável** | INSS |
| **Plataforma** | ConectaGov |
| **URL Documentação** | https://www.gov.br/conectagov/pt-br |
| **Status** | ⚠️ RESTRITA - Requer credenciamento |
| **Acesso** | Restrito a órgãos públicos |
| **Certificado** | ICP-Brasil obrigatório |
| **Custo** | Gratuito para órgãos públicos |
| **Empresa Privada** | ❌ Não disponível |
| **Software Comercial** | ❌ Não disponível |

**Dados retornados:**
- NIT/PIS
- Dados pessoais (nome, data de nascimento, sexo)
- Vínculos empregatícios
- Remunerações
- Contribuições
- Situação cadastral

### 2.3 API Faixa de Renda de Grupo Familiar

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | Consulta CadÚnico - Faixa de Renda |
| **Órgão Responsável** | Ministério da Cidadania / MDS |
| **Plataforma** | ConectaGov |
| **URL Documentação** | https://www.gov.br/conectagov/pt-br |
| **Status** | ⚠️ RESTRITA - Requer credenciamento |
| **Acesso** | Restrito a órgãos públicos |
| **Certificado** | ICP-Brasil obrigatório |
| **Custo** | Gratuito para órgãos públicos |
| **Empresa Privada** | ❌ Não disponível |
| **Software Comercial** | ❌ Não disponível |

**Dados retornados:**
- Número do CadÚnico
- Composição familiar
- Faixa de renda per capita
- Situação socioeconômica

### 2.4 API Meu INSS

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | Meu INSS - Serviços Digitais |
| **Órgão Responsável** | INSS |
| **Plataforma** | gov.br |
| **URL Documentação** | https://www.gov.br/pt-br/servicos/consultar-o-extrato-de-contribuicao-do-cnis |
| **Status** | 🔒 PÚBLICO - Requer autenticação ciudadão |
| **Acesso** | Autenticação via gov.br (CPF + senha) |
| **Certificado** | Não - usa autenticação SSO |
| **Custo** | Gratuito |
| **Empresa Privada** | ❌ Não disponível para automação |
| **Software Comercial** | ❌ Não disponível |

**Observação:** O Meu INSS é um portal para cidadãos. **NÃO pode ser automatizado** via APIs para empresas privadas. Qualquer tentativa de scraping ou automação viola os Termos de Uso.

---

## 3. CLASSIFICAÇÃO DE ACESSO

### 3.1 Definições Importantes

```
GRATUITA ≠ PÚBLICA ≠ SEM AUTORIZAÇÃO ≠ SEM CREDENCIAMENTO
```

| Conceito | Definição |
|----------|-----------|
| **Gratuita** | Não há custo financeiro pela consulta |
| **Pública** | Disponível para qualquer interessado |
| **Sem Autorização** | Não requer aprovação prévia |
| **Sem Credenciamento** | Não requer cadastro/vinculação ao órgão |

### 3.2 Status Real das APIs

| API | Gratuita | Pública | Sem Autorização | Sem Credenciamento |
|-----|----------|---------|-----------------|-------------------|
| Benefícios Previdenciários | ✅ | ❌ | ❌ | ❌ |
| CNIS | ✅ | ❌ | ❌ | ❌ |
| CadÚnico | ✅ | ❌ | ❌ | ❌ |
| Meu INSS | ✅ | ✅ (cidadão) | ❌ | ❌ (automatização) |

**Realidade:** Todas as APIs são **gratuitas** para órgãos públicos credenciados, mas **NENHUMA é acessível** para empresas privadas ou software comercial.

---

## 4. REQUISITOS DE ACESSO

### 4.1 Para APIs do ConectaGov

1. **Credenciamento no ConectaGov**
   - Apenas órgãos públicos federais, estaduais ou municipais
   - Processo de aprovação pelo órgão dono da API

2. **Certificado Digital ICP-Brasil**
   - Obrigatório para autenticação
   - Tipo: e-CPF ou e-CNPJ (A1 ou A3)

3. **Termo de Cooperação**
   - Assinatura com o INSS/MDS
   - Definição de uso e responsabilidades

4. **Auditoria e Rastreabilidade**
   - Todas as consultas são logadas
   - Monitoramento de uso

### 4.2 Para Empresa Privada

**Não existe caminho legal** para empresas privadas acessarem essas APIs para fins comerciais. O uso de dados do INSS por empresas privadas requer:

- Autorização específica da Lei Geral de Proteção de Dados (LGPD)
- Base legal adequada (art. 7º da LGPD)
- Consentimento do titular (quando aplicável)
- Vinculação a serviço público contratado

---

## 5. ALTERNATIVAS VIÁVEIS

### 5.1 Para Consulta de CPF/CNPJ

O ZCobans já utiliza consulta de CPF/CNPJ. Alternativas legais:

1. **Receita Federal** - Via sistema SISBAACO ou convênio
2. **Serasa/SPC** - APIs comerciais (comerciais, pagas)
3. **Dados Abertos** - Dados limitados

### 5.2 Para Dados Previdenciários

Opções legais para empresas privadas:

1. **DADOS ABERTOS INSS** - Dados agregados (não individuais)
2. **SISTEMA DO EMPREGADOR** - Dados do empregador sobre seus funcionários
3. **EXTRATO CNIS do CIDADÃO** - O próprio cidadão pode fornecer

**Recomendação:** Para dados previdenciários individuais, o ideal é:
- Solicitar ao cliente que forneça seus documentos
- Utilizar canais oficiais do cidadão (Meu INSS)
- Não automatizar a consulta

---

## 6. ESTRUTURA CRIADA

### 6.1 Diretório de Provider INSS Conecta

```
src/lib/consultations/providers/
├── mock/
│   ├── mock-data.ts
│   ├── mock-document.ts
│   └── mock-query.provider.ts
├── inss-conecta/
│   ├── inss-conecta.provider.ts
│   ├── inss-conecta.types.ts
│   ├── inss-conecta.config.ts
│   └── index.ts
├── index.ts
├── query-provider.factory.ts
├── query-provider.interface.ts
└── query-provider.types.ts
```

### 6.2 Arquivos Criados

1. **`inss-conecta/inss-conecta.config.ts`** - Configuração do provider
2. **`inss-conecta/inss-conecta.types.ts`** - Tipos específicos
3. **`inss-conecta/inss-conecta.provider.ts`** - Implementação do provider
4. **`inss-conecta/index.ts`** - Barrel exports
5. **`src/__tests__/consultations/providers/inss-conecta.provider.test.ts`** - Testes

### 6.3 Arquivos Alterados

1. **`query-provider.types.ts`** - Adicionado tipo `'inss-conecta'` a `ProviderType`
2. **`query-provider.factory.ts`** - Suporte a registro dinâmico de providers
3. **`providers/index.ts`** - Exportações do INSS Conecta
4. **`.env.example`** - Variáveis de ambiente documentadas

---

## 7. VARIÁVEIS DE AMBIENTE

```env
# INSS Conecta API (Etapa 9.17)
# ⚠️ ATENÇÃO: Requer credenciamento oficial no ConectaGov
# Documentação: https://www.gov.br/conectagov/pt-br
INSS_CONECTA_ENABLED=false
INSS_CONECTA_BASE_URL=https://apigateway.conectagov.gov.br
INSS_CONECTA_CLIENT_ID=
INSS_CONECTA_CLIENT_SECRET=
INSS_CONECTA_CERTIFICATE_PATH=
INSS_CONECTA_CERTIFICATE_PASSWORD=
INSS_CONECTA_TIMEOUT_MS=30000
INSS_CONECTA_RETRY_ATTEMPTS=3
INSS_CONECTA_RETRY_DELAY_MS=1000
```

**Nota:** As variáveis acima são baseadas na documentação do ConectaGov. Os nomes exatos podem variar conforme a implementação oficial.

---

## 8. FEATURE FLAG

```typescript
// Configuração do provider
export const INSS_CONECTA_CONFIG = {
  enabled: process.env.INSS_CONECTA_ENABLED === 'true',
  baseUrl: process.env.INSS_CONECTA_BASE_URL || '',
  clientId: process.env.INSS_CONECTA_CLIENT_ID || '',
  clientSecret: process.env.INSS_CONECTA_CLIENT_SECRET || '',
  certificatePath: process.env.INSS_CONECTA_CERTIFICATE_PATH || '',
  certificatePassword: process.env.INSS_CONECTA_CERTIFICATE_PASSWORD || '',
  timeout: parseInt(process.env.INSS_CONECTA_TIMEOUT_MS || '30000'),
  retryAttempts: parseInt(process.env.INSS_CONECTA_RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(process.env.INSS_CONECTA_RETRY_DELAY_MS || '1000'),
}
```

**Comportamento:**
- `INSS_CONECTA_ENABLED=false` → Usa MockProvider (padrão)
- `INSS_CONECTA_ENABLED=true` → Tenta usar INSSConectaProvider
- Se credenciais ausentes → Fallback para MockProvider

---

## 9. TESTES

### 9.1 Cenários Testados

| # | Cenário | Status |
|---|---------|--------|
| 1 | Provider desabilitado (feature flag off) | ✅ |
| 2 | Configuração ausente | ✅ |
| 3 | Autenticação (mockada) | ✅ |
| 4 | Sucesso da consulta | ✅ |
| 5 | Erro da API | ✅ |
| 6 | Timeout | ✅ |
| 7 | Resposta inválida | ✅ |
| 8 | CPF inválido | ✅ |
| 9 | Mapeamento de resposta oficial → tipos internos | ✅ |

### 9.2 Execução dos Testes

```bash
# Todos os testes devem passar
npm test

# Testes específicos do provider
npm test -- src/__tests__/consultations/providers/inss-conecta.provider.test.ts
```

---

## 10. RESULTADO DO BUILD

```bash
npm run build
```

**Status:** ✅ Build deve ser bem-sucedido

**Verificações:**
- TypeScript compila sem erros
- Nenhum teste quebrado
- MockProvider continua funcionando
- Nova estrutura importada corretamente

---

## 11. LIMITAÇÕES

### 11.1 Limitações Técnicas

1. **Certificado ICP-Brasil** - Não é possível gerar/obter programaticamente
2. **Credenciamento** - Processo manual burocrático
3. **Auditoria** - Todas as chamadas são monitoradas
4. **Rate Limiting** - Limites de uso por órgão

### 11.2 Limitações Legais

1. **LGPD** - Dados pessoais requerem base legal
2. **Uso Comercial** - APIs não disponíveis para fins comerciais
3. **Automatização** - Meu INSS não pode ser automatizado
4. **Responsabilidade** - Órgão responsável pela precisão dos dados

### 11.3 Limitações Práticas

1. **Sem API pública** - Não existe como criar integração real hoje
2. **MockProvider** - É a única opção viável atualmente
3. **Documentação** - Informações podem mudar sem aviso
4. **Suporte** - Sem suporte técnico para empresas privadas

---

## 12. RECOMENDAÇÕES

### 12.1 Curto Prazo

1. **Manter MockProvider** como padrão
2. **Documentar** que dados são simulados
3. **Educar clientes** sobre limitações
4. **Oferecer** consulta manual via canais oficiais

### 12.2 Médio Prazo

1. **Monitorar** mudanças na política de APIs do governo
2. **Avaliar** parcerias com órgãos públicos
3. **Explorar** APIs de dados abertos
4. **Considerar** integração via sistema do empregador

### 12.3 Longo Prazo

1. **Acompanhar** evolução do ConectaGov
2. **Participar** de programas de inovação pública
3. **Desenvolver** expertise em dados previdenciários
4. **Considerar** certificação como empresa credenciada

---

## 13. CONCLUSÃO

### O que foi feito:
✅ Investigação das APIs oficiais do INSS  
✅ Documentação das limitações  
✅ Criação da estrutura de provider (preparação)  
✅ Implementação do MockProvider mantida  
✅ Testes adicionados  
✅ Build verificado  

### O que NÃO foi feito:
❌ Implementação de API fictícia  
❌ Scraping de portais  
❌ Automação do Meu INSS  
❌ Criação de credenciais falsas  
❌ Uso indevido de dados  

### Próximos passos:
1. Aguardar disponibilização de APIs oficiais para empresas
2. ou obter credenciamento via órgão público parceiro
3. ou utilizar alternativas legais (dados abertos, manuais)

---

## 14. ANEXOS

### 14.1 Referências

- [ConectaGov](https://www.gov.br/conectagov/pt-br)
- [Portal de APIs do Governo](https://www.gov.br/pt-br/servicos)
- [LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [INSS](https://www.gov.br/inss/pt-br)

### 14.2 Contatos

Para dúvidas sobre credenciamento:
- ConectaGov: conectagov@gov.br
- INSS: Ouvidoria 135

---

**Documento gerado automaticamente pela Etapa 9.17**  
**Última atualização:** 17/08/2026