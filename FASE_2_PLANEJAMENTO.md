# 🚀 Fase 2 — Planejamento Completo

**Projeto:** trello-cli-unofficial  
**Versão atual:** v0.15.1  
**Meta da fase:** v0.16.x → v0.20.0  
**Data de referência:** Abril de 2026  
**Status da Fase 1:** ✅ Concluída

---

## 📊 Estado Atual (pós-Fase 1)

### ✅ O que foi entregue na Fase 1

| Item | Status | Versão |
|------|--------|--------|
| Padronização de comandos (`boards list`, `cards list`, etc.) | ✅ | v0.8.0 |
| OutputFormatter (table/json/csv/`--format`) | ✅ | v0.9.x |
| ErrorHandler com custom errors | ✅ | v0.10.x |
| `boards show <boardId>` com membros e labels | ✅ | v0.11.x |
| `cards show <cardId>` (descrição, checklists, labels) | ✅ | v0.12.x |
| Suporte completo a checklists (`checklists create/delete/rename/item`) | ✅ | v0.14.0–v0.15.0 |
| Dual runtime: Node.js (produção) + Bun (dev) | ✅ | v0.15.1 (feat) |
| Testes unitários: 228 testes, cobertura 100% | ✅ | v0.15.1 |
| i18n bilíngue (pt-BR / en) | ✅ | estável |
| Deprecation aliases para comandos legados | ✅ | estável |
| Documentação: migration-guide, troubleshooting, examples | ✅ | estável |
| CI/CD com semantic-release e OIDC NPM publish | ✅ | estável |

### 📋 Backlog herdado da Fase 1 (ainda no board "A Fazer")

| Card Trello | Prioridade |
|-------------|-----------|
| 1.10 Atualizar documentação (docs + README + CONTRIBUTING) | 🟡 Média |
| Implementar testes para múltiplos SOs | 🟡 Média |
| [DÉBITO TÉCNICO] Otimizar performance delete/move | 🟠 Alta |

---

## 🎯 Objetivos da Fase 2

Transformar o `tcu` em um cliente Trello completo e de alta performance, eliminando a necessidade de usar a API diretamente. Os três pilares são:

1. **Funcionalidades avançadas** — Search, Bulk Operations, Config Profiles
2. **UX aprimorada** — modo interativo com navegação fluida e breadcrumbs
3. **Robustez** — performance, testes E2E, compatibilidade multi-plataforma

---

## 📋 Tarefas da Fase 2

### 🔴 Débito Técnico — Prioridade Imediata

#### DT-1: Otimizar performance de `delete` e `move`

**Card Trello:** `691478bc8ea4ecf060a8f155`  
**Estimativa:** 2 dias  

**Problema:** Antes de executar `delete` ou `move`, o código varre recursivamente todos os boards → listas → cards do usuário para localizar o card por nome. Isso causa latência desnecessária quando o `cardId` já é conhecido.

**Solução:**
```typescript
// TrelloApiRepository — acessar diretamente pelo ID
async getCard(cardId: string): Promise<CardEntity> {
  return this.request<CardEntity>(`/cards/${cardId}`);
}

// Eliminar a busca recursiva em DeleteCardUseCase e MoveCardUseCase
```

**Critérios de Aceitação:**
- [ ] `tcu cards delete <cardId>` executa sem varrer todos os boards
- [ ] `tcu cards move <cardId> --to <listId>` idem
- [ ] Tempo de resposta < 500ms em conexão normal
- [ ] Testes unitários atualizados

---

### 🟠 Alta Prioridade — Sprint 1 (2–3 semanas)

#### 2.1: Implementar Search

**Card Trello:** `691470a2b52d540aff0cce11`  
**Estimativa:** 3 dias  

**Comando:**
```bash
tcu cards search <query>
tcu cards search "bug fix" --board-id <boardId>
tcu cards search "urgent" --labels bug,high-priority
tcu cards search "sprint" --list-id <listId>
```

**Arquitetura:**
```
SearchCardsUseCase
  └─ TrelloRepository.searchCards(query, options)
       └─ GET /search?query=...&modelTypes=cards&...
```

**Arquivos a criar/modificar:**
- `src/application/use-cases/SearchCardsUseCase.ts` (novo)
- `src/domain/repositories/TrelloRepository.ts` — adicionar `searchCards()`
- `src/infrastructure/repositories/TrelloApiRepository.ts` — implementar endpoint `/search`
- `src/presentation/cli/CardController.ts` — registrar subcomando `search`
- `tests/unit/application/use-cases/SearchCardsUseCase.test.ts` (novo)

**Critérios de Aceitação:**
- [ ] Criado `SearchCardsUseCase` em `src/application/use-cases/`
- [ ] Integração com Trello Search API (`GET /search`)
- [ ] Suporte a filtros: `--board-id`, `--list-id`, `--labels`
- [ ] Paginação de resultados (`--limit`, `--page`)
- [ ] Validação de query e filtros
- [ ] Testes unitários e de integração
- [ ] Documentado com exemplos

---

#### 2.2: Implementar Bulk Operations

**Card Trello:** `691470bb8013ad4ef15f4fc5`  
**Estimativa:** 4 dias  

**Comandos:**
```bash
tcu cards bulk-move --from <listId> --to <listId>
tcu cards bulk-move --label bug --to <listId>
tcu cards bulk-update --list-id <listId> --set-label <labelId>
tcu cards bulk-archive --list-id <listId>
```

**Arquitetura:**
```
BulkMoveCardsUseCase
BulkUpdateCardsUseCase
BulkArchiveCardsUseCase
  └─ Reutilizam MoveCardUseCase, UpdateCardUseCase via batching
  └─ Progress indicator via console (spinner/counter)
```

**Arquivos a criar/modificar:**
- `src/application/use-cases/BulkMoveCardsUseCase.ts` (novo)
- `src/application/use-cases/BulkUpdateCardsUseCase.ts` (novo)
- `src/application/use-cases/BulkArchiveCardsUseCase.ts` (novo)
- `src/presentation/cli/CardController.ts` — subcomandos `bulk-*`
- `tests/unit/application/use-cases/Bulk*.test.ts` (novos)

**Critérios de Aceitação:**
- [ ] `bulk-move` entre listas (por critério: lista origem, label)
- [ ] `bulk-update` de propriedades (label, nome, descrição)
- [ ] `bulk-archive` (fechamento de cards)
- [ ] Indicador de progresso durante operação
- [ ] Tratamento de erros parciais (rollback informativo)
- [ ] Testes abrangentes para cenários de bulk

---

#### 2.3: Melhorar Modo Interativo

**Card Trello:** `691470d419e927ce75e5e398`  
**Estimativa:** 3 dias  

**Melhorias planejadas:**
```
Antes:  Menu plano com lista de opções
Depois: Board > Lista > Card com breadcrumb

  🏠 Menu Principal > 📋 Board: "Trello CLI" > 📝 Lista: "A Fazer"
  [↑↓ navegar] [Enter selecionar] [Esc voltar] [/ buscar] [q sair]
```

**Arquivos a criar/modificar:**
- `src/presentation/cli/InteractiveNavigator.ts` (novo)
- `src/presentation/cli/TrelloCliController.ts` — integrar navigator
- `tests/unit/presentation/cli/InteractiveNavigator.test.ts` (novo)

**Critérios de Aceitação:**
- [ ] Breadcrumb visível em todas as telas (`Board > List > Card`)
- [ ] Atalhos: setas de navegação, `Enter`, `Esc` para voltar, `/` para buscar, `q` para sair
- [ ] Histórico de navegação (voltar ao estado anterior)
- [ ] Busca rápida dentro do modo interativo
- [ ] Cores e formatação visual melhoradas
- [ ] Testes para navegação interativa

---

#### 2.4: Implementar Config Profiles

**Card Trello:** `691470ed276989b0da71d5e9`  
**Estimativa:** 4 dias  

**Comandos:**
```bash
tcu config profiles list
tcu config profiles create work --token ATTAxxx
tcu config profiles create personal --token ATTAyyy
tcu config profiles use work
tcu config profiles delete personal
tcu config show
tcu config validate
```

**Nova estrutura de config (`~/.trello-cli-unofficial/config.json`):**
```json
{
  "version": 2,
  "activeProfile": "work",
  "profiles": {
    "work": {
      "apiKey": "630a01228b85df706aa520f3611e6490",
      "token": "ATTAxxx",
      "label": "Work Account"
    },
    "personal": {
      "apiKey": "630a01228b85df706aa520f3611e6490",
      "token": "ATTAyyy",
      "label": "Personal Account"
    }
  }
}
```

**Arquivos a criar/modificar:**
- `src/domain/entities/Config.ts` — suporte a múltiplos perfis
- `src/application/use-cases/ProfileManagementUseCase.ts` (novo)
- `src/infrastructure/repositories/FileConfigRepository.ts` — migração automática v1→v2
- `src/presentation/cli/CommandController.ts` — subcomandos `config profiles *`
- `tests/unit/application/use-cases/ProfileManagementUseCase.test.ts` (novo)

**Critérios de Aceitação:**
- [ ] `ConfigEntity` suporta múltiplos perfis
- [ ] Migração automática de config v1 (single token) para v2 (profiles)
- [ ] Comandos `config profiles list/create/use/delete`
- [ ] `config show` exibe perfil ativo
- [ ] `config validate` testa conexão com a API do Trello
- [ ] Testes abrangentes incluindo migração

---

### 🟡 Média Prioridade — Sprint 2

#### 2.5: Melhorar Cobertura de Testes

**Card Trello:** `69147120e878fcde20b2a710`  
**Estimativa:** 2 dias  

**Escopo:**
- Testes de integração E2E para todos os fluxos CLI (mock da API)
- Testes de performance para bulk operations
- Suite de testes multi-plataforma (Linux, macOS, Windows via Docker)
- Code coverage reports detalhados no CI/CD

**Arquivos a criar:**
- `tests/integration/cli/search.integration.test.ts`
- `tests/integration/cli/bulk.integration.test.ts`
- `tests/integration/cli/configProfiles.integration.test.ts`

**Critérios de Aceitação:**
- [ ] Cobertura mantida > 95% em todas as métricas
- [ ] Testes de integração para todos os comandos novos
- [ ] Testes E2E para fluxos completos (setup → boards → cards)
- [ ] Suite CI/CD com relatório de cobertura

---

#### DOC-1: Atualizar Documentação

**Card Trello:** `6919bf9698d0e15ff63a9b85`  
**Estimativa:** 2 dias  

**Escopo:**
- Atualizar `README.md` com novos comandos (search, bulk, profiles)
- Atualizar `docs/commands.md` com sintaxe completa
- Atualizar `docs/examples/README.md` com exemplos práticos
- Revisar `docs/migration-guide.md` com mudanças da Fase 2
- Atualizar `CONTRIBUTING.md` com diretrizes de PR e cobertura

---

#### OS-1: Testes Multi-Plataforma

**Card Trello:** `69174899d4c27c5dc9a5c583`  
**Estimativa:** 2 dias  

**Escopo:**
- Testar instalação via `npm install -g trello-cli-unofficial` em Linux, macOS e Windows
- Validar Docker images (Alpine, Ubuntu, Windows Server)
- Adicionar job de smoke-test no CI para cada plataforma

---

## 🗓️ Cronograma Sugerido

```
Semana 1
├── DT-1: Otimizar delete/move          (2 dias)
└── 2.1: Search                         (3 dias)

Semana 2
├── 2.2: Bulk Operations                (4 dias)
└── 2.3: Modo Interativo (início)       (1 dia)

Semana 3
├── 2.3: Modo Interativo (conclusão)    (2 dias)
└── 2.4: Config Profiles (início)       (3 dias)

Semana 4
├── 2.4: Config Profiles (conclusão)    (1 dia)
├── 2.5: Testes                         (2 dias)
└── DOC-1 + OS-1: Docs + Multi-OS      (2 dias)
```

**Releases planejadas:**
| Versão | Conteúdo |
|--------|----------|
| v0.16.0 | DT-1 (performance) + Search |
| v0.17.0 | Bulk Operations |
| v0.18.0 | Modo Interativo melhorado |
| v0.19.0 | Config Profiles |
| v0.20.0 | Testes E2E + Docs + Multi-OS |

---

## 🏗️ Arquitetura — Novos componentes

```
src/
├── application/
│   └── use-cases/
│       ├── SearchCardsUseCase.ts          ← novo
│       ├── BulkMoveCardsUseCase.ts        ← novo
│       ├── BulkUpdateCardsUseCase.ts      ← novo
│       ├── BulkArchiveCardsUseCase.ts     ← novo
│       └── ProfileManagementUseCase.ts    ← novo
├── presentation/
│   └── cli/
│       └── InteractiveNavigator.ts        ← novo
└── domain/
    └── entities/
        └── Config.ts                      ← refatorar para profiles

tests/
├── unit/
│   └── application/use-cases/
│       ├── SearchCardsUseCase.test.ts     ← novo
│       ├── BulkMoveCardsUseCase.test.ts   ← novo
│       ├── BulkUpdateCardsUseCase.test.ts ← novo
│       └── ProfileManagementUseCase.test.ts ← novo
└── integration/
    └── cli/
        ├── search.integration.test.ts     ← novo
        ├── bulk.integration.test.ts       ← novo
        └── configProfiles.integration.test.ts ← novo
```

---

## 📦 Dependências novas necessárias

Verificar antes de adicionar se já existe equivalente:

| Pacote | Uso | Necessário? |
|--------|-----|-------------|
| `ora` | Spinner durante bulk ops | Avaliar (pode usar `console.log` progressivo) |
| `cli-progress` | Progress bar | Avaliar |

> **Nota:** Evitar dependências desnecessárias. O projeto já usa `inquirer` para UX interativa — aproveitar ao máximo.

---

## ✅ Critérios de Conclusão da Fase 2

- [ ] Todos os 5 itens do board "A Fazer" movidos para "Concluído"
- [ ] Versão v0.20.0 publicada no NPM
- [ ] Cobertura de testes ≥ 95% mantida
- [ ] Zero breaking changes não documentadas
- [ ] README e docs atualizados com todos os comandos novos
- [ ] CI/CD verde em 100% dos commits

---

## 🔗 Referências

- Board Trello: https://trello.com/b/L1haKh6n/trello-cli-unofficial
- Issue #9 (UX Improvements): https://github.com/JaegerCaiser/trello-cli-unofficial/issues/9
- ISSUE_9_ACTION_PLAN.md — plano detalhado original
- ISSUE_9_IMPROVEMENTS.md — gap analysis e objetos de cada feature
- Trello Search API: https://developer.atlassian.com/cloud/trello/rest/api-group-search/
