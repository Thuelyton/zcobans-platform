# ZCobans Platform

Plataforma profissional para gestão de serviços digitais, promoções e leads.

## Tecnologias

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS.
- **Backend / BaaS**: Supabase (Auth, Database, Storage).
- **Validação**: Zod.
- **Formulários**: React Hook Form.
- **Testes**: Vitest.
- **Containerização**: Docker.

## Estrutura do Projeto

- `src/app`: Rotas e componentes de página (App Router).
- `src/components`: Componentes UI reutilizáveis.
- `src/lib`: Utilitários, clientes Supabase e validações.
- `supabase`: Arquivos de schema e migrações.
- `src/__tests__`: Testes unitários e de integração.

## Como Iniciar (Desenvolvimento)

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env.local` com as chaves do seu projeto Supabase (use `.env.example` como referência).
4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Testes

Para rodar os testes unitários:
```bash
npm run test
```

## Docker

Para subir o ambiente via Docker:
```bash
docker-compose up --build
```

---

## Produção

O projeto está configurado para o modo `standalone` do Next.js para otimização do Docker.
Ao realizar o build, certifique-se de que as variáveis de ambiente necessárias estejam configuradas no seu provedor de CI/CD ou plataforma de deploy.
