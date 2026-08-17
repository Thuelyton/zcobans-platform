# RELATÓRIO DE INVESTIGAÇÃO: APIs Reais para Consultas CPF/INSS/Benefícios
## Análise Técnica para Integração no ZCobans

**Data:** 17 de Agosto de 2026
**Status:** Investigação Concluída
**Recomendação:** Aguardar decisão antes de implementar

---

## RESUMO EXECUTIVO

Após investigação detalhada de APIs brasileiras para consultas relacionadas a CPF, INSS e benefícios previdenciários, apresento as conclusões abaixo.

### Classificação das APIs Encontradas

| Classificação | Quantidade | Descrição |
|---------------|------------|-----------|
| 🟢 Pode ser integrada agora | 0 | Nenhuma API disponível imediatamente |
| 🟡 Pode ser integrada com cadastro | 2-3 | Requerem processo de aprovação |
| 🔴 Não pode ser usada | 5+ | Restrições de acesso para empresas privadas |

---

## 1. APIs DO GOVERNO FEDERAL

### 1.1 ConectaGov - Portal de APIs

| Campo | Informação |
|-------|------------|
| **Nome** | ConectaGov |
| **Responsável** | Ministério da Gestão e Inovação em Serviços Públicos |
| **Site** | https://www.conectagov.gov.br |
| **Catálogo** | https://www.conectagov.gov.br/catalogo-de-api |
| **Acesso** | Restrito a órgãos públicos federais |
| **Custo** | Gratuito (para órgãos autorizados) |
| **Status** | 🔴 Não disponível para empresas privadas |

**Documentação Encontrada:**
- Portal principal disponível
- Catálogo de APIs listado
- Documentação detalhada apenas após credenciamento

**Limitações para ZCobans:**
- Exige ser órgão público federal
- Requer certificado ICP-Brasil institucional
- Aprovação case a case pelo INSS
- Não existe caminho legal para empresa privada

**Evidência:**
- https://www.conectagov.gov.br (portal público)
- https://www.conectagov.gov.br/catalogo-de-api (catálogo público)
- Documentação completa restrita a credenciados

---

### 1.2 API Consulta CPF - Receita Federal

| Campo | Informação |
|-------|------------|
| **Nome** | API de Consulta de CPF/CNPJ |
| **Responsável** | Receita Federal do Brasil |
| **Site** | https://www.gov.br/receitafederal |
| **Acesso** | Restrito a órgãos públicos |
| **Custo** | Gratuito (para órgãos autorizados) |
| **Status** | 🔴 Não disponível para empresas privadas |

**O que consulta:**
- Situação cadastral do CPF
- Dados cadastrais básicos
- Validade do documento

**Limitações para ZCobans:**
- API interna do governo
- Acesso restrito a órgãos de controle
- Não disponível via ConectaGov para terceiros
- Requer autorização específica

**Evidência:**
- https://www.gov.br/receitafederal (portal oficial)
- Documentação interna (não pública)

---

### 1.3 API Meu INSS

| Campo | Informação |
|-------|------------|
| **Nome** | Meu INSS (portal) |
| **Responsável** | INSS |
| **Site** | https://www.gov.br/inss/pt-br |
| **Acesso** | Apenas para o próprio cidadão (login gov.br) |
| **Custo** | Gratuito |
| **Status** | 🔴 Não é API - é portal para cidadão |

**Limitações para ZCobans:**
- NÃO é uma API para integração
- Exige login com conta gov.br do próprio beneficiário
- Não permite consulta de terceiros
- Automatizar uso viola termos de uso

**Evidência:**
- https://meu.inss.gov.br (portal público)
- Termos de uso explícitos

---

### 1.4 API Bolsa Família / CadÚnico

| Campo | Informação |
|-------|------------|
| **Nome** | APIs do CadÚnico e Bolsa Família |
| **Responsável** | Ministério da Cidadania |
| **Acesso** | Restrito a órgãos públicos |
| **Custo** | Gratuito (para órgãos autorizados) |
| **Status** | 🔴 Não disponível para empresas privadas |

**O que consulta:**
- Faixa de renda familiar
- Enquadramento em programas sociais
- Composição familiar

**Limitações para ZCobans:**
- Dados sensíveis de populações vulneráveis
- Acesso exclusivo para gestão de programas sociais
- Não há uso comercial permitido
- LGPD exige autorização específica

**Evidência:**
- Portais governamentais (não públicos para API)

---

## 2. APIs PRIVADAS COMERCIAIS

### 2.1 Serasa Experian - APIs de Consulta

| Campo | Informação |
|-------|------------|
| **Nome** | Serasa APIs |
| **Responsável** | Serasa Experian |
| **Site** | https://www.serasa.com.br |
| **Portal APIs** | https://developer.serasa.com.br |
| **Acesso** | Comercial (contrato necessário) |
| **Custo** | Pago (por consulta) |
| **Status** | 🟡 Requer contrato e cadastro |

**O que consulta:**
- Score de crédito
- Restrições e negativações
- Dados cadastrais
- Informações trabalhistas (limitado)

**Requisitos:**
- CNPJ ativo
- Contrato comercial
- Cadastro no portal de desenvolvedores
- Análise de crédito da empresa

**Preço:**
- Planos variados
- Custo por consulta
- Sem plano gratuito significativo

**Sandbox:**
- Ambiente de testes disponível para desenvolvedores
- Dados simulados em sandbox

**Restrições LGPD:**
- Exige finalidade legítima
- Base legal obrigatória
- Contrato de处理amento de dados

**Evidência:**
- https://developer.serasa.com.br (portal público)
- https://www.serasa.com.br/lopsi/api-serasa (documentação)
- APIs documentadas publicamente

---

### 2.2 Boa Vista SCPC - APIs

| Campo | Informação |
|-------|------------|
| **Nome** | Boa Vista APIs |
| **Responsável** | Boa Vista SCPC |
| **Site** | https://www.boavistaservicos.com.br |
| **Acesso** | Comercial |
| **Custo** | Pago |
| **Status** | 🟡 Requer contrato |

**O que consulta:**
- Consulta de CPF/CNPJ
- Score de crédito
- Restrições

**Limitações:**
- Focado em crédito
- Não retorna dados específicos INSS
- Não retorna benefícios previdenciários

**Evidência:**
- Site oficial disponível
- APIs documentadas para clientes

---

### 2.3 Quod (antigo DP Digital)

| Campo | Informação |
|-------|------------|
| **Nome** | Quod |
| **Responsável** | Quod (joint venture bancária) |
| **Site** | https://www.quod.com.br |
| **Acesso** | Comercial |
| **Custo** | Pago |
| **Status** | 🟡 Requer contrato |

**O que consulta:**
- Consulta de CPF/CNPJ
- Score de crédito
- Dados cadastrais

**Limitações:**
- Focado em crédito
- Não retorna dados INSS/benefícios
- Mercado de crédito

**Evidência:**
- Site oficial público

---

## 3. APIs DE DADOS PÚBLICOS

### 3.1 Dados.gov.br

| Campo | Informação |
|-------|------------|
| **Nome** | Dados Abertos do Governo Federal |
| **Responsável** | Comitê de Governança em Dados |
| **Site** | https://dados.gov.br |
| **Acesso** | Público (dados abertos) |
| **Custo** | Gratuito |
| **Status** | 🟡 Disponível mas com limitações |

**O que oferece:**
- Dados agregados e estatísticos
- Dados de políticas públicas
- Indicadores sociais

**Limitações para ZCobans:**
- Dados agregados (não individuais)
- Não permite consulta por CPF específico
- Estatísticas gerais
- Não substitui consulta individual

**Evidência:**
- https://dados.gov.br (portal público)
- https://dados.gov.br/dados/conjuntos-dados (catálogo)
- APIs de dados abertos documentadas

---

### 3.2 IBGE APIs

| Campo | Informação |
|-------|------------|
| **Nome** | APIs do IBGE |
| **Responsável** | Instituto Brasileiro de Geografia e Estatística |
| **Site** | https://www.ibge.gov.br |
| **Acesso** | Público |
| **Custo** | Gratuito |
| **Status** | 🟢 Disponível (mas não atende necessidade) |

**O que oferece:**
- Dados demográficos agregados
- Censos e pesquisas
- Indicadores por município/UF

**Limitações para ZCobans:**
- Dados agregados apenas
- Não consulta CPF individual
- Não retorna dados INSS

**Evidência:**
- https://servicodados.ibge.gov.br/api/docs (API pública)
- https://www.ibge.gov.br/apis (portal de APIs)

---

### 3.3 APIs de CEP/Endereço

| Campo | Informação |
|-------|------------|
| **Nome** | ViaCEP, BrasilAPI, etc. |
| **Responsável** | Diversos provedores |
| **Acesso** | Público |
| **Custo** | Gratuito |
| **Status** | 🟢 Disponível (mas não atende necessidade) |

**Limitações para ZCobans:**
- Apenas dados de endereço
- Não consulta CPF/INSS

**Evidência:**
- https://viacep.com.br (API pública)
- https://brasilapi.com.br (agregador)

---

## 4. APIs ESPECÍFICAS PARA INSS/BENEFÍCIOS

### 4.1 Consulta de Benefícios - Sem API Pública

**Conclusão:** Não existe API pública para consulta individual de benefícios INSS por terceiros.

**O que existe:**
- API interna do INSS (ConectaGov) - restrita a órgãos públicos
- Portal Meu INSS - apenas para o próprio beneficiário
- Consulta via CNIS - apenas no portal ou via empregador

**Motivo da restrição:**
- Dados pessoais sensíveis (LGPD)
- Risco de fraude previdenciária
- Política de proteção ao beneficiário

---

### 4.2 Consulta de NIT/PIS - Sem API Pública

**Conclusão:** Não existe API pública para consulta de NIT/PIS por terceiros.

**O que existe:**
- Consulta no portal do CNIS
- Através do empregador
- No Meu INSS (para o próprio beneficiário)

---

### 4.3 Consulta de CNIS - Sem API Pública

**Conclusão:** Não existe API pública para consulta de CNIS por terceiros.

**O que existe:**
- Portal CNIS (para empresas via eSocial)
- Meu INSS (para o próprio beneficiário)
- Não há acesso para consultas externas

---

## 5. FORNecedores DE TERCEIROS (DADOS TRABALHISTAS)

### 5.1 eSocial APIs

| Campo | Informação |
|-------|------------|
| **Nome** | APIs do eSocial |
| **Responsável** | Governo Federal |
| **Site** | https://www.gov.br/esocial |
| **Acesso** | Restrito a empregadores/representantes |
| **Custo** | Gratuito (para envio de dados) |
| **Status** | 🔴 Não é API de consulta para terceiros |

**O que faz:**
- Envio de dados trabalhistas
- Consulta de eventos enviados pelo próprio empregador
- Não permite consulta de dados de outros empregadores

**Limitações para ZCobans:**
- Apenas consulta dos próprios dados
- Não permite consulta de terceiros
- Finalidade de regularização fiscal

---

### 5.2 Consulta de Empregados (CAGED/eSocial)

| Campo | Informação |
|-------|------------|
| **Nome** | Consulta de vínculos |
| **Acesso** | Restrito ao empregador |
| **Status** | 🔴 Não disponível para consulta externa |

---

## 6. SERVIÇOS DE CONSULTA PAGOS (SEM FOCO INSS)

### 6.1 Dataku / Soluções de Dados

| Campo | Informação |
|-------|------------|
| **Nome** | Dataku (exemplo) |
| **Tipo** | Plataforma de dados |
| **Acesso** | Comercial |
| **Foco** | Análise de dados, não consulta individual |
| **Status** | 🔴 Não atende necessidade |

---

### 6.2 APIs de Verificação de Identidade

Diversas empresas oferecem verificação de identidade:
- Validar se CPF existe
- Verificar situação cadastral
- Confirmar nome associado

**Porém:** Nenhuma retorna dados de benefícios INSS.

---

## 7. ANÁLISE COMPARATIVA

### 7.1 APIs que retornam dados INSS/Benefícios

| API | Dados INSS | Dados Benefício | Acesso Empresa |
|-----|------------|-----------------|----------------|
| ConectaGov/INSS | ✅ Completo | ✅ NB, NIT, Valor | ❌ Não |
| Serasa | ❌ Não | ❌ Não | ✅ Sim |
| Boa Vista | ❌ Não | ❌ Não | ✅ Sim |
| Quod | ❌ Não | ❌ Não | ✅ Sim |

**Conclusão:** Nenhuma API comercial retorna dados específicos de benefícios INSS.

---

### 7.2 APIs que retornam dados de CPF

| API | Situação Cadastral | Dados Cadastrais | Acesso Empresa |
|-----|-------------------|------------------|----------------|
| Receita Federal | ✅ | ✅ | ❌ Órgãos públicos |
| Serasa | ✅ | ✅ | ✅ Sim |
| Boa Vista | ✅ | ✅ | ✅ Sim |
| Quod | ✅ | ✅ | ✅ Sim |

**Observação:** APIs comerciais retornam dados básicos do CPF, mas não dados INSS.

---

## 8. RECOMENDAÇÕES

### 8.1 Classificação Final

| Classificação | API | Motivo |
|---------------|-----|--------|
| 🔴 | ConectaGov/INSS | Restrito a órgãos públicos |
| 🔴 | Receita Federal | Restrito a órgãos públicos |
| 🔴 | Meu INSS | Apenas para o próprio cidadão |
| 🔴 | CadÚnico/Bolsa Família | Restrito a gestão de programas |
| 🔴 | eSocial | Apenas consulta própria |
| 🟡 | Serasa | Comercial, sem dados INSS |
| 🟡 | Boa Vista | Comercial, sem dados INSS |
| 🟡 | Quod | Comercial, sem dados INSS |
| 🟢 | Dados.gov.br | Público, dados agregados apenas |
| 🟢 | IBGE | Público, dados demográficos |

---

### 8.2 Melhor API Encontrada

**Nenhuma API encontrada atende 100% ao que o ZCobans precisa.**

A melhor alternativa para dados básicos de CPF (sem dados INSS) seria:
- **Serasa** (se o foco for crédito/consulta básica)

Para dados INSS especificamente:
- **Nenhuma API disponível** para empresas privadas

---

### 8.3 Segunda Melhor Alternativa

**Não aplicável** - não há segunda opção para dados INSS.

Para consultas gerais de CPF:
- Boa Vista ou Quod (similares ao Serasa)

---

### 8.4 Menor Custo

| API | Custo | Plano Gratuito |
|-----|-------|----------------|
| ConectaGov | Gratuito | Sim (mas restrito) |
| Serasa | Pago | Não significativo |
| Boa Vista | Pago | Não |
| Quod | Pago | Não |
| Dados.gov.br | Gratuito | Sim |

---

### 8.5 Permite Testes/Sandbox

| API | Sandbox | Observação |
|-----|---------|------------|
| ConectaGov | Não público | Só após credenciamento |
| Serasa | Sim | Para desenvolvedores credenciados |
| Boa Vista | Sim | Para clientes |
| Quod | Sim | Para clientes |

---

### 8.6 Permite Uso Comercial

| API | Uso Comercial | Restrições |
|-----|---------------|------------|
| ConectaGov | ❌ Não | Apenas órgãos públicos |
| Serasa | ✅ Sim | Contrato necessário |
| Boa Vista | ✅ Sim | Contrato necessário |
| Quod | ✅ Sim | Contrato necessário |
| Dados.gov.br | ⚠️ Limitado | Dados agregados apenas |

---

### 8.7 Dados Mais Próximos do INSS

**Nenhuma API comercial** retorna dados específicos de benefícios INSS (NB, NIT, valor, situação).

O mais próximo são APIs de consulta básica de CPF:
- Situação cadastral
- Dados cadastrais
- Score de crédito

---

## 9. O QUE PRECISAMOS FAZER PARA OBTER ACESSO

### 9.1 Para APIs do Governo (ConectaGov)

1. **Ser órgão público federal** (não é o caso do ZCobans)
2. **Ter certificado ICP-Brasil institucional**
3. **Fazer credenciamento no ConectaGov**
4. **Submeter projeto para aprovação**
5. **Assinar termo de responsabilidade**

**Conclusão:** Impossível para empresa privada.

---

### 9.2 Para APIs Comerciais (Serasa, etc.)

1. **Cadastrar CNPJ no portal de desenvolvedores**
2. **Aprovação de crédito pela empresa**
3. **Assinar contrato comercial**
4. **Selecionar plano de consultas**
5. **Integrar com API (documentação disponível)**

**Conclusão:** Possível, mas sem dados INSS.

---

## 10. COMPARAÇÃO COM QUERYPROVIDERFACTORY ATUAL

### 10.1 Interfaces Atuais

```typescript
// Nossos tipos atuais
interface IQueryProvider {
  execute(request: QueryRequest): Promise<QueryResult>
  validate(request: QueryRequest): boolean
  getCapabilities(): ProviderCapability[]
}

// Tipos de consulta suportados
type QueryType = 'cpf' | 'inss' | 'fgts' | 'telefone' | 'limpa_nome'
```

### 10.2 O que APIs comerciais podem oferecer

| QueryType Nossa | Dado Disponível | API Comercial |
|-----------------|-----------------|---------------|
| cpf | Situação cadastral | ✅ Serasa/Boa Vista |
| cpf | Dados cadastrais | ⚠️ Limitado |
| inss | Dados benefício | ❌ Não disponível |
| inss | NB/NIT | ❌ Não disponível |
| inss | Valor benefício | ❌ Não disponível |
| fgts | Dados FGTS | ❌ Não disponível |
| telefone | Dados telefone | ⚠️ Algumas APIs |
| limpa_nome | Restrições | ✅ Serasa/Boa Vista |

### 10.3 Adapters Necessários

**Para Serasa (exemplo):**

```typescript
// Adapter necessário
class SerasaQueryAdapter implements IQueryProvider {
  readonly name = 'Serasa Provider'
  readonly type: ProviderType = 'serasa'

  async execute(request: QueryRequest): Promise<QueryResult> {
    // 1. Mapear QueryRequest para formato Serasa
    // 2. Chamar API Serasa
    // 3. Mapear resposta Serasa para QueryResult
    // 4. Retornar apenas dados permitidos por LGPD
  }

  // O que poderia retornar:
  // - Situação cadastral do CPF
  // - Score de crédito (se disponível)
  // - Restrições/negativações
  //
  // O que NÃO poderia retornar:
  // - Dados INSS
  // - Benefícios
  // - NB/NIT
  // - Valor de benefício
}
```

### 10.4 Limitação Fundamental

**O QueryProviderFactory foi projetado para consultar dados de benefícios.**

APIs comerciais **NÃO retornam esses dados**.

**Opções:**

1. **Adaptar o provider** para retornar apenas dados disponíveis (CPF básico)
2. **Criar provider híbrido** (mock para INSS, real para CPF)
3. **Manter MockProvider** até existir API adequada
4. **Remover consulta INSS** do escopo inicial

---

## 11. CONCLUSÕES

### 11.1 Realidade do Mercado

1. **Não existe API pública** para consulta de benefícios INSS por empresas privadas
2. **APIs governamentais** são restritas a órgãos públicos
3. **APIs comerciais** retornam dados de crédito, não dados previdenciários
4. **O Meu INSS** é apenas para o próprio cidadão
5. **Scraping/automação** viola termos de uso e pode ser crime

### 11.2 Opções para o ZCobans

| Opção | Viabilidade | Impacto |
|-------|-------------|---------|
| A) Usar Serasa para dados de CPF | 🟡 Média | Perde consulta INSS |
| B) Manter MockProvider | 🟢 Alta | Sem dados reais |
| C) Criar consulta via Meu INSS (login cidadão) | 🔴 Baixa | Complexo e frágil |
| D) Esperar mudança governamental | 🔴 Incerto | Sem prazo |
| E) Parceria com órgão público | 🟡 Média | Depende de parceiro |

### 11.3 Recomendação

**Manter MockProvider para desenvolvimento e demonstração.**

**Avaliar Serasa/Boa Vista** apenas para consulta básica de CPF (situação cadastral).

**Não implementar provider real para INSS** até que:
- Existam APIs governamentais acessíveis a empresas privadas
- Ou haja parceria com órgão público autorizado

---

## 12. PRÓXIMOS PASSOS SUGERIDOS

1. **Decidir se consulta INSS é essencial** para MVP
2. **Se não for essencial**, focar em consultas de CPF básico
3. **Avaliar custo-benefício** de APIs comerciais (Serasa)
4. **Definir modelo de negócio** que sustente custos de API
5. **Monitorar** possíveis mudanças em APIs governamentais
6. **Manter MockProvider** para demonstrações

---

## 13. FONTES CONSULTADAS

| Fonte | URL | Status |
|-------|-----|--------|
| ConectaGov | https://www.conectagov.gov.br | Acessado |
| ConectaGov Catálogo | https://www.conectagov.gov.br/catalogo-de-api | Acessado |
| Receita Federal | https://www.gov.br/receitafederal | Acessado |
| INSS | https://www.gov.br/inss | Acessado |
| Meu INSS | https://meu.inss.gov.br | Acessado |
| Dados.gov.br | https://dados.gov.br | Acessado |
| IBGE | https://www.ibge.gov.br/apis | Acessado |
| Serasa Developer | https://developer.serasa.com.br | Acessado |
| Boa Vista | https://www.boavistaservicos.com.br | Acessado |
| Quod | https://www.quod.com.br | Acessado |

---

## 14. EVIDÊNCIA E DOCUMENTAÇÃO

### 14.1 Evidência de Restrição - ConectaGov

- Portal público: https://www.conectagov.gov.br
- Documentação detalhada: Restrita após credenciamento
- Termos: Exigem ser órgão público federal

### 14.2 Evidência - APIs Comerciais

- Serasa Developer Portal: https://developer.serasa.com.br (público)
- Documentação de APIs disponível para desenvolvedores
- Requer cadastro e contrato para acesso

### 14.3 Evidência - Meu INSS

- Portal público: https://meu.inss.gov.br
- Requer login gov.br do próprio beneficiário
- Não permite acesso de terceiros

---

**Fim do Relatório de Investigação**

**Data:** 17 de Agosto de 2026
**Autor:** Assistente Técnico ZCobans
