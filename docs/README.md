# ZCobans Platform - Documentação

## Visão Geral

O ZCobans Platform é um painel administrativo para gerenciamento de conteúdo, serviços e leads de uma empresa de cobranças.

## Estrutura da Documentação

| Arquivo | Descrição |
|---------|-----------|
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Estado atual do projeto e análise completa |
| [architecture.md](./architecture.md) | Arquitetura e estrutura do projeto |
| [frontend.md](./frontend.md) | Documentação do frontend (Next.js) |
| [backend.md](./backend.md) | Documentação do backend (Server Actions) |
| [database.md](./database.md) | Estrutura do banco de dados |
| [authentication.md](./authentication.md) | Sistema de autenticação e autorização |
| [validation.md](./validation.md) | Sistema de validação de dados |
| [error-handling.md](./error-handling.md) | Tratamento de erros padronizado |
| [testing.md](./testing.md) | Estrutura e cobertura de testes |
| [security.md](./security.md) | Medidas de segurança implementadas |
| [slug.md](./slug.md) | Sistema de geração e validação de slugs |
| [roadmap.md](./roadmap.md) | Próximos passos e melhorias sugeridas |

## Stack Tecnológica

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Server Actions (Next.js)
- **Banco:** Supabase (PostgreSQL)
- **Validação:** Zod 4
- **Formulários:** React Hook Form
- **Testes:** Vitest

## Início Rápido

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar testes
npm test

# Build de produção
npm run build
```
