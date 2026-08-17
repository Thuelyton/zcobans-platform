# RELATÓRIO DE INVESTIGAÇÃO: Providers Reais para ZCobans
## Análise Detalhada por Categoria de Consulta

**Data:** 17 de Agosto de 2026
**Versão:** 2.0 (Segunda Investigação)
**Status:** Investigação Concluída

---

## OBJETIVO

Investigar separadamente cada tipo de consulta oferecida pelo ZCobans para identificar fontes REAIS e AUTORIZADAS de dados.

---

## CATEGORIA 1: INSS / BENEFÍCIOS PREVIDENCIÁRIOS

### 1.1 API Oficial - ConectaGov

| Campo | Informação |
|-------|------------|
| **Nome** | API de Consulta de Benefícios INSS |
| **Responsável** | INSS via ConectaGov |
| **Site** | https://www.conectagov.gov.br |
| **Documentação** | Restrita (após credenciamento) |
| **Tipo** | Consulta de benefício por NB ou CPF |
| **Dados** | NB, NIT, Nome, Valor, Situação, Data Início/Fim |
| **Entrada** | NB ou CPF |
| **Custo** | Gratuito (órgãos públicos) |
| **Free Tier** | Sim (órgãos públicos) |
| **Sandbox** | Não público |
| **Cadastro** | Credenciamento no ConectaGov |
| **CNPJ** | Não (órgão público) |
| **Contrato** | Termo de responsabilidade |
| **Uso Comercial** | ❌ Não permitido |
| **Limite** | Definido no credenciamento |
| **LGPD** | Dados sensíveis - exige autorização |

**Evidência:**
- https://www.conectagov.gov.br (portal público)
- https://www.conectagov.gov.br/catalogo-de-api (catálogo)
- Documentação completa: Restrita a credenciados

**Classificação:** 🔴 NÃO UTILIZÁVEL (restrito a órgãos públicos)

---

### 1.2 APIs Comerciais de Consulta INSS

**Investigação realizada em:**
- Serasa Experian
- Boa Vista SCPC
- Quod
- Detran (dados veiculares)
- SPC/CADIN

**Resultado:** NENHUMA oferece consulta de benefícios INSS.

**Motivo:** Dados previdenciários são dados pessoais sensíveis (LGPD Art. 20) e não são comercializados por empresas privadas.

**Evidência:**
- Portais oficiais de cada empresa consultados
- Nenhuma documentação pública menciona consulta INSS

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

### 1.3 Portais Governamentais para o Próprio Cidadão

| Portal | Acesso | Consulta INSS |
|--------|--------|---------------|
| Meu INSS | Login gov.br do beneficiário | ✅ Dados próprios |
| Portal INSS | Acesso restrito | ✅ Servidores |
| eSocial | Empregador | ❌ Não tem dados INSS |

**Classificação:** 🔴 NÃO UTILIZÁVEL (apenas para o próprio cidadão)

---

## CATEGORIA 2: CNIS (Cadastro Nacional de Informações Sociais)

### 2.1 API Oficial - ConectaGov

| Campo | Informação |
|-------|------------|
| **Nome** | API de Consulta CNIS |
| **Responsável** | INSS via ConectaGov |
| **Dados** | NIT, Vínculos, Contribuições, Remunerações |
| **Entrada** | CPF ou NIT |
| **Custo** | Gratuito (órgãos públicos) |
| **Uso Comercial** | ❌ Não permitido |

**Evidência:**
- Mesmo portal do ConectaGov
- Documentação: Restrita

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

### 2.2 eSocial - Dados do Próprio Empregador

| Campo | Informação |
|-------|------------|
| **Nome** | eSocial |
| **Site** | https://www.gov.br/esocial |
| **Dados** | Apenas dados enviados pelo próprio empregador |
| **Consulta** | Apenas eventos próprios |
| **Uso Comercial** | ❌ Não (apenas regularização fiscal) |

**Classificação:** 🔴 NÃO UTILIZÁVEL (apenas consulta própria)

---

## CATEGORIA 3: CPF / SITUAÇÃO CADASTRAL

### 3.1 API Oficial - Receita Federal

| Campo | Informação |
|-------|------------|
| **Nome** | Consulta de Situação Cadastral do CPF |
| **Responsável** | Receita Federal |
| **Site** | https://www.gov.br/receitafederal |
| **Dados** | Situação cadastral, Data de nascimento |
| **Entrada** | CPF |
| **Custo** | Gratuito (órgãos públicos) |
| **Uso Comercial** | ❌ Não permitido |

**Evidência:**
- Portal da Receita Federal
- Consulta disponível apenas via portal para cidadão ou órgãos públicos
- API interna não é pública

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

### 3.2 APIs Comerciais de Consulta CPF

#### 3.2.1 Serasa Experian

| Campo | Informação |
|-------|------------|
| **Nome** | Serasa APIs |
| **Site** | https://developer.serasa.com.br |
| **Documentação** | https://developer.serasa.com.br/docs |
| **Dados** | Situação cadastral, Score, Restrições |
| **Entrada** | CPF ou CNPJ |
| **Custo** | Pago (por consulta) |
| **Free Tier** | Não significativo |
| **Sandbox** | ✅ Sim |
| **Cadastro** | Sim (CNPJ) |
| **CNPJ** | ✅ Obrigatório |
| **Contrato** | ✅ Obrigatório |
| **Uso Comercial** | ✅ Sim |
| **Limite** | Definido no plano |
| **LGPD** | Requer base legal |

**Evidência:**
- Portal público: https://developer.serasa.com.br
- Documentação: https://developer.serasa.com.br/docs
- Sandbox disponível para desenvolvedores

**Classificação:** 🟡 IMPLEMENTÁVEL APÓS CADASTRO/CONTRATO

---

#### 3.2.2 Boa Vista SCPC

| Campo | Informação |
|-------|------------|
| **Nome** | Boa Vista APIs |
| **Site** | https://www.boavistaservicos.com.br |
| **Dados** | Situação cadastral, Score, Restrições |
| **Entrada** | CPF ou CNPJ |
| **Custo** | Pago |
| **Sandbox** | ✅ Sim (clientes) |
| **Cadastro** | Sim (CNPJ) |
| **CNPJ** | ✅ Obrigatório |
| **Contrato** | ✅ Obrigatório |
| **Uso Comercial** | ✅ Sim |

**Evidência:**
- Site oficial público
- APIs documentadas para clientes

**Classificação:** 🟡 IMPLEMENTÁVEL APÓS CADASTRO/CONTRATO

---

#### 3.2.3 Quod (antigo DP Digital)

| Campo | Informação |
|-------|------------|
| **Nome** | Quod |
| **Site** | https://www.quod.com.br |
| **Dados** | Situação cadastral, Score, Restrições |
| **Entrada** | CPF ou CNPJ |
| **Custo** | Pago |
| **Sandbox** | ✅ Sim |
| **Cadastro** | Sim (CNPJ) |
| **Contrato** | ✅ Obrigatório |
| **Uso Comercial** | ✅ Sim |

**Classificação:** 🟡 IMPLEMENTÁVEL APÓS CADASTRO/CONTRATO

---

### 3.3 APIs Gratuitas de Validação de CPF

#### 3.3.1 ReceitaWS

| Campo | Informação |
|-------|------------|
| **Nome** | ReceitaWS |
| **Site** | https://www.receitaws.com.br |
| **Documentação** | https://www.receitaws.com.br/v1/cnpj/docs |
| **Dados** | Dados cadastrais de CNPJ (NÃO CPF) |
| **Entrada** | CNPJ |
| **Custo** | Gratuito (com limites) |
| **Free Tier** | ✅ Sim (3 consultas/minuto) |
| **Sandbox** | Não (produção direta) |
| **Cadastro** | Não |
| **CNPJ** | Não (usa CNPJ como entrada) |
| **Uso Comercial** | ⚠️ Limitado (termos de uso) |
| **Limite** | 3 consultas/minuto |

** IMPORTANTE:** ReceitaWS é para CNPJ, NÃO para CPF.

**Evidência:**
- https://www.receitaws.com.br (site público)
- Documentação pública disponível

**Classificação:** 🔴 NÃO UTILIZÁVEL (apenas CNPJ)

---

#### 3.3.2 BrasilAPI

| Campo | Informação |
|-------|------------|
| **Nome** | BrasilAPI |
| **Site** | https://brasilapi.com.br |
| **Documentação** | https://brasilapi.com.br/docs |
| **Dados** | CEP, Banco, CNPJ, Feriados |
| **Consulta CPF** | ❌ Não disponível |
| **Custo** | Gratuito |

**Classificação:** 🔴 NÃO UTILIZÁVEL (não tem consulta CPF)

---

#### 3.3.3 ViaCEP

| Campo | Informação |
|-------|------------|
| **Nome** | ViaCEP |
| **Dados** | Endereço por CEP |
| **Consulta CPF** | ❌ Não |

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

## CATEGORIA 4: FGTS

### 4.1 API Oficial - Caixa Econômica Federal

| Campo | Informação |
|-------|------------|
| **Nome** | Consulta FGTS (app Caixa) |
| **Responsável** | Caixa Econômica Federal |
| **Site** | https://www.caixa.gov.br/beneficios-trabalhador/fgts |
| **Dados** | Saldo, Extrato, Movimentações |
| **Entrada** | CPF + NIS/PIS |
| **Acesso** | App FGTS (próprio trabalhador) |
| **Custo** | Gratuito |
| **Uso Comercial** | ❌ Não (apenas para o próprio trabalhador) |

**Evidência:**
- https://www.caixa.gov.br (portal oficial)
- App FGTS disponível em lojas de aplicativos

**Classificação:** 🔴 NÃO UTILIZÁVEL (apenas para o próprio trabalhador)

---

### 4.2 APIs Comerciais de Consulta FGTS

**Investigação realizada em:**
- Serasa
- Boa Vista
- Quod
- Empresas de consultoria trabalhista

**Resultado:** NENHUMA oferece consulta de saldo FGTS.

**Motivo:** Dados de FGTS são dados pessoais protegidos e não são comercializados.

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

## CATEGORIA 5: TELEFONE

### 5.1 APIs de Consulta de Telefone

#### 5.1.1 APIs de Validação de Telefone

| API | Dados | Custo | Uso Comercial |
|-----|-------|-------|---------------|
| Twilio Lookup | Validar se número existe | Pago | ✅ Sim |
| NumVerify | Validação de número | Freemium | ✅ Sim |
| Abstract API | Validação de telefone | Freemium | ✅ Sim |

**Dados retornados:**
- Se número é válido
- Operadora
- Tipo (móvel/fixo)
- País

**NÃO retornam:**
- Nome do titular
- CPF associado
- Endereço

**Classificação:** 🟡 IMPLEMENTÁVEL (validação apenas, sem dados do titular)

---

#### 5.1.2 APIs de Consulta de Titular

**Investigação:** Não encontrei API LEGAL para consulta de titular de telefone.

**Motivo:** Consulta de titular de telefone por terceiros pode violar LGPD.

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

## CATEGORIA 6: LIMPA NOME (Restrições/Negativações)

### 6.1 APIs Comerciais de Consulta

#### 6.1.1 Serasa - Limpa Nome

| Campo | Informação |
|-------|------------|
| **Nome** | Serasa Limpa Nome |
| **Site** | https://www.serasa.com.br/limpa-nome |
| **API** | Disponível via Serasa APIs |
| **Dados** | Restrições, Negativações, Valores |
| **Entrada** | CPF |
| **Custo** | Pago (API) / Gratuito (portal cidadão) |
| **Sandbox** | ✅ Sim (API) |
| **Cadastro** | Sim (CNPJ) para API |
| **Uso Comercial** | ✅ Sim (API) |

**Evidência:**
- https://developer.serasa.com.br
- Documentação de APIs disponível

**Classificação:** 🟡 IMPLEMENTÁVEL APÓS CADASTRO/CONTRATO

---

#### 6.1.2 Boa Vista - Consulta de Restrições

| Campo | Informação |
|-------|------------|
| **Nome** | Boa Vista Consulta |
| **Dados** | Restrições, Score |
| **Entrada** | CPF |
| **Custo** | Pago |
| **Uso Comercial** | ✅ Sim |

**Classificação:** 🟡 IMPLEMENTÁVEL APÓS CADASTRO/CONTRATO

---

### 6.2 APIs de Órgãos Públicos

#### 6.2.1 CADIN (Cadastro Informativo de Créditos Não Quitados)

| Campo | Informação |
|-------|------------|
| **Nome** | CADIN |
| **Responsável** | Tesouro Nacional |
| **Site** | https://www.tesouro.fazenda.gov.br/cadin |
| **Dados** | Débitos federais |
| **Acesso** | Restrito a órgãos públicos |
| **Uso Comercial** | ❌ Não |

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

## CATEGORIA 7: VÍNCULOS TRABALHISTAS

### 7.1 eSocial - Dados Próprios

| Campo | Informação |
|-------|------------|
| **Nome** | eSocial |
| **Dados** | Vínculos do próprio empregador |
| **Acesso** | Empregador ou representante |
| **Uso Comercial** | ❌ Não |

**Classificação:** 🔴 NÃO UTILIZÁVEL (apenas dados próprios)

---

### 7.2 CAGED (Cadastro Geral de Empregados e Desempregados)

| Campo | Informação |
|-------|------------|
| **Nome** | CAGED (substituído pelo eSocial) |
| **Status** | Descontinuado |
| **Dados** | Movimentações trabalhistas |
| **Acesso** | Órgãos públicos |
| **Uso Comercial** | ❌ Não |

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

### 7.3 APIs Comerciais de Dados Trabalhistas

**Investigação:** Não encontrei API que retorne vínculos trabalhistas de terceiros.

**Motivo:** Dados trabalhistas são protegidos por LGPD e legislação trabalhista.

**Classificação:** 🔴 NÃO UTILIZÁVEL

---

## TABELA RESUMO POR CATEGORIA

| Categoria | 🟢 Agora | 🟡 Após Cadastro | 🟠 Aut. Gov. | 🔴 Não |
|-----------|----------|-------------------|--------------|--------|
| INSS/Benefícios | 0 | 0 | 1 (ConectaGov) | Múltiplas |
| CNIS | 0 | 0 | 1 (ConectaGov) | Múltiplas |
| CPF/Situação | 0 | 3 (Serasa, Boa Vista, Quod) | 1 (Receita) | Múltiplas |
| FGTS | 0 | 0 | 0 | Múltiplas |
| Telefone | 0 | 1 (validação apenas) | 0 | Múltiplas |
| Limpa Nome | 0 | 2 (Serasa, Boa Vista) | 1 (CADIN) | Múltiplas |
| Vínculos | 0 | 0 | 0 | Múltiplas |

---

## CLASSIFICAÇÃO GERAL

### 🟢 IMPLEMENTÁVEL AGORA

**NENHUMA** consulta pode ser implementada agora sem custo e sem cadastro.

---

### 🟡 IMPLEMENTÁVEL APÓS CADASTRO/CONTRATO

| Consulta | Provider | Custo | Acesso |
|----------|----------|-------|--------|
| CPF/Situação Cadastral | Serasa | Pago | Cadastro + Contrato |
| CPF/Situação Cadastral | Boa Vista | Pago | Cadastro + Contrato |
| CPF/Situação Cadastral | Quod | Pago | Cadastro + Contrato |
| Limpa Nome | Serasa | Pago | Cadastro + Contrato |
| Limpa Nome | Boa Vista | Pago | Cadastro + Contrato |
| Validação Telefone | Twilio/NumVerify | Freemium | Cadastro |

---

### 🟠 SOMENTE COM AUTORIZAÇÃO GOVERNAMENTAL

| Consulta | API | Acesso |
|----------|-----|--------|
| INSS/Benefícios | ConectaGov | Órgão público federal |
| CNIS | ConectaGov | Órgão público federal |
| CPF/Receita | Receita Federal | Órgão público federal |
| CADIN | Tesouro Nacional | Órgão público federal |

---

### 🔴 NÃO UTILIZÁVEL

| Consulta | Motivo |
|----------|--------|
| Dados INSS completos | Dados sensíveis, não disponíveis para empresas |
| Dados CNIS completos | Dados sensíveis, não disponíveis para empresas |
| Dados FGTS completos | Apenas para o próprio trabalhador |
| Titular de telefone | LGPD - consulta por terceiros |
| Vínculos trabalhistas de terceiros | LGPD - dados protegidos |
| Dados do Meu INSS | Apenas para o próprio cidadão |

---

## ANÁLISE DE CUSTO

### Custo para Implementar CPF Básico

| Provider | Custo Mensal Estimado | Custo por Consulta |
|----------|----------------------|-------------------|
| Serasa | Variável | ~R$ 0,50 - 2,00 |
| Boa Vista | Variável | ~R$ 0,50 - 2,00 |
| Quod | Variável | ~R$ 0,50 - 2,00 |

### Custo para Consultas INSS

**INEXISTENTE** - Não há API disponível para empresa privada.

---

## RECOMENDAÇÃO DE ARQUITETURA

### Opção A: Único Fornecedor para Tudo

**Não recomendada.** Motivos:

1. Não existe fornecedor único para todas as consultas
2. Dependência excessiva de um provedor
3. Custo pode ser alto para consultas diversas

---

### Opção B: Vários Providers Especializados

**RECOMENDADA.** Motivos:

1. Cada tipo de consulta pode usar o melhor provider
2. Modularidade permite trocar providers
3. Reduz dependência de um único fornecedor
4. Permite começar com consultas viáveis

**Arquitetura Sugerida:**

```
src/lib/consultations/providers/
├── mock/                    # Sempre disponível (dev/test)
├── inss-conecta/            # Para futuro (gov.br)
├── cpf/                     # Consulta CPF
│   ├── serasa/
│   ├── boa-vista/
│   └── quod/
├── limpa-nome/              # Restrições
│   ├── serasa/
│   └── boa-vista/
├── telefone/                # Validação
│   └── twilio/
├── fgts/                    # Não disponível
└── cnis/                    # Não disponível
```

---

### Opção C: Manter MockProvider até Ter Fornecedores

**VÁLIDA para o curto prazo.** Motivos:

1. Não gastar R$0 agora
2. Desenvolver UX com dados simulados
3. Validar modelo de negócio
4. Aguardar melhores oportunidades

---

## QUAL CONSULTA PODEMOS COLOCAR PRIMEIRO GASTANDO R$0?

### Resposta Honesta

**NENHUMA consulta real pode ser implementada gastando R$0 com uso comercial.**

**Motivos:**

1. APIs governamentais são gratuitas mas restritas a órgãos públicos
2. APIs comerciais exigem contrato e pagamento
3. Não existe "free tier" significativo para consultas CPF

### Única Possibilidade Gratuita

**Validação de telefone** (apenas se número é válido, sem dados do titular):

- NumVerify: 100 consultas/mês grátis
- Abstract API: 50 consultas/mês grátis

**Porém:** Não retorna nome, CPF ou outros dados do titular.

---

## O QUE PRECISAMOS FAZER PARA OBTER ACESSO

### Para Consultas de CPF (Serasa/Boa Vista/Quod)

1. **Decidir qual provider usar** (recomendo Serasa por ser maior)
2. **Cadastrar CNPJ** no portal de desenvolvedores
3. **Submeter documents** para análise
4. **Aguardar aprovação** de crédito (1-2 semanas)
5. **Assinar contrato** comercial
6. **Selecionar plano** de consultas
7. **Obter credenciais** de acesso (client_id, client_secret)
8. **Implementar provider** no ZCobans

### Para Consultas INSS

**IMPOSSÍVEL** para empresa privada. Não há caminho legal.

---

## CONCLUSÃO

### Realidade do Mercado

1. **Dados INSS/benefícios:** Não disponíveis para empresas privadas
2. **Dados CNIS:** Não disponíveis para empresas privadas
3. **Dados FGTS:** Não disponíveis para empresas privadas
4. **Dados CPF básicos:** Disponíveis via APIs comerciais (pago)
5. **Limpa Nome:** Disponível via APIs comerciais (pago)
6. **Vínculos trabalhistas:** Não disponíveis de terceiros

### Recomendação Final

1. **Manter MockProvider** para desenvolvimento e demonstrações
2. **Avaliar Serasa** para consulta básica de CPF (se necessário)
3. **Não investir em provider INSS** (impossível)
4. **Focar MVP** em consultas viáveis (CPF básico, Limpa Nome)
5. **Comunicar ao cliente** limitações reais do sistema

### Arquitetura

**Adotar Opção B (Providers Especializados):**

- Cada tipo de consulta com seu próprio provider
- MockProvider sempre disponível
- Providers reais opcionais (configuráveis via env vars)
- Fácil de adicionar/remover providers

---

**Fim do Relatório**

**Data:** 17 de Agosto de 2026
**Próximo Passo:** Decisão sobre ETAPA 9.18
