# Roadmap - Próximos Passos

## Fase 1: Concluída ✅

- [x] Schema de validação para Leads
- [x] Schema de validação para Status
- [x] Adicionar starts_at/ends_at ao Banner
- [x] Padronizar error handling
- [x] Dashboard com dados reais
- [x] Slug validation + auto-generation

---

## Fase 2: Autenticação e Segurança

### Prioridade Alta
- [ ] Implementar login com Supabase Auth
- [ ] Implementar logout
- [ ] Criar middleware de proteção de rotas
- [ ] Session management (refresh token)
- [ ] Página de login funcional

### Prioridade Média
- [ ] Controle de roles (superadmin/editor)
- [ ] Audit log de ações
- [ ] Rate limiting

---

## Fase 3: Frontend Público

### Landing Page
- [ ] Hero section com banner
- [ ] Seção de serviços
- [ ] Promoções em destaque
- [ ] Indicadores de confiança
- [ ] Formulário de contato
- [ ] FAQ

### Páginas
- [ ] `/servicos` - Lista de categorias
- [ ] `/servicos/[slug]` - Detalhe do serviço
- [ ] `/promocoes` - Lista de promoções
- [ ] `/contato` - Formulário de leads
- [ ] `/faq` - Perguntas frequentes
- [ ] `/sobre` - Seções de conteúdo

---

## Fase 4: Melhorias de UX

### Loading States
- [ ] Skeleton components
- [ ] Spinner para ações
- [ ] Progress indicators

### Error Handling
- [ ] Error Boundaries
- [ ] Página de erro 404
- [ ] Página de erro 500
- [ ] Toast notifications

### Interações
- [ ] Confirmações de delete
- [ ] Undo/Redo
- [ ] Keyboard shortcuts
- [ ] Drag and drop para ordenação

---

## Fase 5: Funcionalidades Avançadas

### Admin
- [ ] Paginação nas listagens
- [ ] Busca e filtros
- [ ] Exportação de dados (CSV/Excel)
- [ ] Dashboard com gráficos
- [ ] Upload de imagens
- [ ] Editor rich text para conteúdo

### Leads
- [ ] Filtros por status/data
- [ ] Exportação de leads
- [ ] Notificação de novo lead
- [ ] Histórico de contato

### Conteúdo
- [ ] Preview antes de salvar
- [ ] Versionamento
- [ ] Agendamento de publicação

---

## Fase 6: Infraestrutura

### Performance
- [ ] Otimização de queries
- [ ] Cache de dados
- [ ] Lazy loading
- [ ] Image optimization

### Deploy
- [ ] CI/CD pipeline
- [ ] Environment variables
- [ ] Monitoring
- [ ] Logging

### Testes
- [ ] Testes E2E com Playwright
- [ ] Testes de componente
- [ ] Coverage mínimo 80%
- [ ] Testes de performance

---

## Débitos Técnicos a Resolver

1. **Tipos `any`** - Remover `as never` no zodResolver
2. **Error Boundaries** - Implementar tratamento granular
3. **Loading States** - Adicionar skeleton em todas as páginas
4. **Empty States** - Tratar listagens vazias
5. **Formulários** - Remover `as any` em onSubmit

---

## Melhorias Sugeridas

### Código
- [ ] Extrair lógica de formulários para hooks
- [ ] Criar componentes de formulário reutilizáveis
- [ ] Padronizar nomes de funções
- [ ] Adicionar JSDoc em funções principais

### UX
- [ ] Adicionar breadcrumbs
- [ ] Melhorar feedback visual
- [ ] Adicionar atalhos de teclado
- [ ] Melhorar responsividade

### Acessibilidade
- [ ] Adicionar ARIA labels
- [ ] Melhorar navegação por teclado
- [ ] Testar com screen readers
- [ ] Contraste de cores

---

## Prioridades

| Fase | Prioridade | Esforço | Impacto |
|------|------------|---------|---------|
| 2. Autenticação | 🔴 Alta | Médio | Alto |
| 3. Frontend Público | 🔴 Alta | Alto | Alto |
| 4. UX | 🟡 Média | Médio | Médio |
| 5. Avançado | 🟢 Baixa | Alto | Médio |
| 6. Infraestrutura | 🟢 Baixa | Alto | Médio |

---

## Estimativas

| Fase | Tempo Estimado |
|------|----------------|
| Fase 2 | 1-2 semanas |
| Fase 3 | 2-3 semanas |
| Fase 4 | 1-2 semanas |
| Fase 5 | 2-3 semanas |
| Fase 6 | 1-2 semanas |
| **Total** | **7-12 semanas** |

---

## Notas

1. **Fase 2 é bloqueante** - Frontend público depende de autenticação
2. **Fase 3 é prioridade de negócio** - Sem frontend público, não há valor para clientes
3. **Fase 4 melhora retenção** - UX impacta satisfação do usuário admin
4. **Fase 5 é opcional** - Funcionalidades avançadas podem ser adiadas
5. **Fase 6 é contínua** - Infraestrutura deve ser melhorada incrementalmente
