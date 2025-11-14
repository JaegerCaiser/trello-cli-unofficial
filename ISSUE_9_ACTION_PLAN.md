# Plano de Ação - Issue #9: UX and CLI Design Improvements

**Issue:** [#9 - UX and CLI Design Improvements](https://github.com/JaegerCaiser/trello-cli-unofficial/issues/9)  
**Criado em:** 10 de novembro de 2025  
**Status:** Open (Enhancement)

---

## 📋 Resumo Executivo

A Issue #9 é um feedback abrangente sobre melhorias de UX e design da CLI, identificando 6 áreas críticas de melhoria:

1. **Estrutura de Comandos Inconsistente** - Comandos seguem padrões diferentes
2. **Recursos Essenciais Ausentes** - Funcionalidades avançadas não implementadas
3. **Tratamento de Erros Pobre** - Mensagens genéricas sem orientação
4. **Formatos de Saída Inconsistentes** - Sem padronização de output
5. **Problemas de Autenticação/Configuração** - Setup complexo e não persistente
6. **Recursos Interativos Ausentes** - Falta autocomplete e help system

---

## 🎯 Análise do Estado Atual

### Pontos Fortes do Projeto Atual

✅ **Arquitetura Sólida:** DDD bem estruturado com Domain/Application/Infrastructure/Presentation  
✅ **Performance:** Runtime Bun com alta performance  
✅ **CI/CD Robusto:** Automação completa com semantic versioning  
✅ **Cobertura de Testes:** 57 testes com threshold de 95%  
✅ **i18n:** Suporte bilíngue (pt-BR/en) com detecção automática  
✅ **Modo Interativo:** Interface com inquirer já implementada

### Gaps Identificados

❌ **Comandos inconsistentes:** `tcu boards` vs `tcu board list`  
❌ **Sem comandos avançados:** Falta `show`, `export`, `import`, `search`  
❌ **Erros genéricos:** Sem validação e confirmações  
❌ **Output não padronizado:** Sem flags `--json`, `--table`, `--format`  
❌ **Config não validável:** Sem `tcu config validate` ou `tcu config profiles`  
❌ **Sem autocomplete:** Falta tab completion

---

## 📊 Priorização (Baseada na Issue)

### 🔴 Alta Prioridade (Implementação Imediata)

**Objetivo:** Estabilizar a experiência atual e corrigir problemas críticos.

#### 1.1. Padronizar Estrutura de Comandos

**Problema Atual:**

```bash
# Comandos inconsistentes atuais
tcu boards              # Lista boards
tcu lists <boardName>   # Lista lists (requer boardName)
tcu cards <boardName> <listName>  # Lista cards (requer 2 args)
```

**Solução Proposta:**

```bash
# Nova estrutura consistente
tcu boards list                    # Lista boards
tcu boards show <id>               # Mostra detalhes do board
tcu boards create <name>           # Cria board
tcu boards delete <id>             # Deleta board

tcu lists list <board-id>          # Lista lists de um board
tcu lists show <id>                # Mostra detalhes da list
tcu lists create <board-id> <name> # Cria list

tcu cards list <list-id>           # Lista cards de uma list
tcu cards show <id>                # Mostra detalhes do card
tcu cards create <list-id> <name>  # Cria card
tcu cards update <id>              # Atualiza card
tcu cards delete <id>              # Deleta card
tcu cards move <id> --list <list-id> --position <pos>  # Move card
```

**Arquivos Impactados:**

- `src/presentation/cli/CommandController.ts` - Refatorar todos os comandos
- `src/presentation/cli/BoardController.ts` - Adicionar método `showBoardDetails()`
- `tests/unit/presentation/cli/CommandController.test.ts` - Atualizar testes

**Breaking Change:** ⚠️ **SIM** - Requer migration guide e deprecation warnings

---

#### 1.2. Adicionar Formatação Consistente de Output

**Implementação:**

```typescript
// Adicionar flags globais
tcu boards list --format table|json|csv
tcu boards list --json              # Shorthand
tcu cards list <list-id> --pretty   # JSON formatado
```

**Nova Estrutura:**

```typescript
// src/shared/types.ts
export type OutputFormat = "table" | "json" | "csv" | "pretty";

export interface OutputOptions {
  format: OutputFormat;
  filter?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

// src/shared/OutputFormatter.ts (novo arquivo)
export class OutputFormatter {
  static formatBoards(boards: BoardEntity[], options: OutputOptions): string;
  static formatLists(lists: ListEntity[], options: OutputOptions): string;
  static formatCards(cards: CardEntity[], options: OutputOptions): string;
}
```

**Bibliotecas Necessárias:**

- `cli-table3` - Para formatação de tabelas
- `json2csv` - Para exportação CSV

**Arquivos a Criar:**

- `src/shared/OutputFormatter.ts` - Classe de formatação
- `src/shared/TableFormatter.ts` - Helper para tabelas
- `tests/unit/shared/OutputFormatter.test.ts` - Testes

---

#### 1.3. Melhorar Mensagens de Erro e Validação

**Problema Atual:**

```typescript
// Erro genérico atual
console.error("❌ Erro:", (error as Error).message);
```

**Solução Proposta:**

```typescript
// src/shared/ErrorHandler.ts (novo arquivo)
export class ErrorHandler {
  static handle(error: Error, context?: string): void {
    if (error instanceof NetworkError) {
      console.error("🌐 Erro de rede: Verifique sua conexão");
      console.error("💡 Sugestão: Tente novamente em alguns instantes");
    } else if (error instanceof AuthenticationError) {
      console.error("🔐 Erro de autenticação: Token inválido");
      console.error("💡 Sugestão: Execute `tcu setup` para configurar");
    } else if (error instanceof ValidationError) {
      console.error(`❌ ${error.message}`);
      console.error(`💡 ${error.suggestion}`);
    } else {
      console.error("❌ Erro inesperado:", error.message);
    }
  }
}

// src/shared/errors/ (nova pasta)
export class ValidationError extends Error {
  constructor(
    message: string,
    public suggestion: string
  ) {
    super(message);
  }
}
```

**Validações a Adicionar:**

- Token format (deve começar com "ATTA")
- Board/List/Card ID format
- Parâmetros obrigatórios
- Confirmação para operações destrutivas (`delete`)

---

#### 1.4. Adicionar Comando `boards show`

**Implementação:**

```typescript
// src/application/use-cases/GetBoardDetailsUseCase.ts (novo arquivo)
export class GetBoardDetailsUseCase {
  async execute(boardId: string): Promise<BoardDetailsDTO> {
    const board = await this.trelloRepository.getBoard(boardId);
    const lists = await this.trelloRepository.getLists(boardId);
    const members = await this.trelloRepository.getBoardMembers(boardId);

    return {
      ...board,
      listsCount: lists.length,
      members,
      lastActivity: board.dateLastActivity,
    };
  }
}
```

**Comando:**

```bash
tcu boards show <board-id>

# Output:
# 📋 Board: My Project
# 🆔 ID: 5f8b1c2d3e4a5f6g7h8i9j0k
# 📝 Description: Project management board
# 📊 Lists: 4
# 👥 Members: 3 (John, Jane, Bob)
# 🕒 Last Activity: 2025-11-10 14:30:00
# 🔗 URL: https://trello.com/b/5f8b1c2d/my-project
```

---

### 🟡 Média Prioridade (Próxima Release)

**Objetivo:** Adicionar funcionalidades avançadas que melhoram produtividade.

#### 2.1. Implementar Funcionalidade de Busca

**Comando:**

```bash
tcu cards search <query> [--board <board-id>] [--all]
tcu cards search "bug fix" --board 5f8b1c2d  # Busca em board específico
tcu cards search "urgent" --all              # Busca em todos os boards
```

**Use Case:**

```typescript
// src/application/use-cases/SearchCardsUseCase.ts
export class SearchCardsUseCase {
  async execute(query: string, options?: SearchOptions): Promise<CardEntity[]> {
    // Implementar busca com Trello Search API
    // https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get
  }
}
```

---

#### 2.2. Adicionar Operações em Lote (Bulk Operations)

**Comando:**

```bash
tcu cards bulk-update --filter "label:bug" --set priority=high
tcu cards bulk-move --filter "due:overdue" --list <list-id>
tcu cards bulk-archive --filter "label:done"
```

**Use Case:**

```typescript
// src/application/use-cases/BulkUpdateCardsUseCase.ts
export class BulkUpdateCardsUseCase {
  async execute(
    filter: CardFilter,
    updates: Partial<CardEntity>
  ): Promise<void> {
    const cards = await this.findCards(filter);
    await Promise.all(cards.map((card) => this.updateCard(card.id, updates)));
  }
}
```

---

#### 2.3. Melhorar Modo Interativo

**Melhorias:**

- Adicionar breadcrumb navigation (`Home > Boards > My Project > Lists`)
- Adicionar atalhos de teclado (`Ctrl+C` para voltar, `Ctrl+Q` para sair)
- Adicionar histórico de navegação (voltar ao menu anterior)
- Adicionar preview de cards antes de abrir

**Implementação:**

```typescript
// src/presentation/cli/InteractiveNavigator.ts (novo arquivo)
export class InteractiveNavigator {
  private history: string[] = [];
  private breadcrumbs: string[] = [];

  async navigate(screen: Screen): Promise<void> {
    this.history.push(this.currentScreen);
    this.breadcrumbs.push(screen.title);
    // Renderizar com breadcrumb
  }

  async goBack(): Promise<void> {
    const previous = this.history.pop();
    this.breadcrumbs.pop();
    // Voltar à tela anterior
  }
}
```

---

#### 2.4. Melhorar Gerenciamento de Configuração

**Novos Comandos:**

```bash
tcu config init        # Wizard interativo
tcu config show        # Mostra config atual
tcu config validate    # Testa conexão com API
tcu config profiles    # Gerencia múltiplas contas

# Profiles example
tcu config profiles add work --token ATTA...
tcu config profiles add personal --token ATTA...
tcu config profiles use work
tcu boards list  # Usa profile 'work'
```

**Nova Estrutura de Config:**

```json
{
  "defaultProfile": "work",
  "profiles": {
    "work": {
      "apiKey": "630a01228b85df706aa520f3611e6490",
      "token": "ATTA...",
      "name": "Work Account"
    },
    "personal": {
      "apiKey": "630a01228b85df706aa520f3611e6490",
      "token": "ATTA...",
      "name": "Personal Account"
    }
  }
}
```

---

### 🟢 Baixa Prioridade (Futuro)

**Objetivo:** Recursos avançados para power users.

#### 3.1. Export/Import de Boards

```bash
tcu boards export <board-id> --format json|csv --output file.json
tcu boards import file.json --create-new|--merge <board-id>
```

#### 3.2. Modo Offline e Cache

```bash
tcu boards list --offline   # Usa cache local
tcu sync                    # Sincroniza cache com API
```

#### 3.3. Sistema de Plugins

```typescript
// ~/.trello-cli-unofficial/plugins/my-plugin.ts
export default {
  name: "my-plugin",
  commands: [
    {
      name: "custom",
      action: async () => {
        // Plugin logic
      },
    },
  ],
};
```

---

## 🔧 Implementação Técnica

### Fase 1: Refatoração de Comandos (Sprint 1 - 2 semanas)

**Tarefas:**

1. **Criar nova estrutura de comandos** (3 dias)
   - [ ] Refatorar `CommandController.ts`
   - [ ] Criar comandos `show` para boards/lists/cards
   - [ ] Adicionar aliases para comandos antigos (deprecation)
   - [ ] Atualizar testes

2. **Implementar OutputFormatter** (2 dias)
   - [ ] Criar `OutputFormatter.ts` com suporte JSON/Table/CSV
   - [ ] Integrar com todos os comandos
   - [ ] Adicionar flags `--format`, `--json`, `--pretty`
   - [ ] Adicionar testes unitários

3. **Melhorar Error Handling** (2 dias)
   - [ ] Criar `ErrorHandler.ts`
   - [ ] Criar custom errors (`ValidationError`, `NetworkError`, etc.)
   - [ ] Adicionar validações em todos os inputs
   - [ ] Adicionar confirmações para operações destrutivas

4. **Implementar `boards show`** (1 dia)
   - [ ] Criar `GetBoardDetailsUseCase.ts`
   - [ ] Implementar no `BoardController`
   - [ ] Adicionar comando `tcu boards show <id>`
   - [ ] Adicionar testes

5. **Atualizar documentação** (2 dias)
   - [ ] Criar migration guide para breaking changes
   - [ ] Atualizar README com novos comandos
   - [ ] Adicionar exemplos práticos
   - [ ] Documentar deprecation warnings

**Entregáveis:**

- ✅ Comandos padronizados com nova estrutura
- ✅ Output formatado em JSON/Table/CSV
- ✅ Error handling robusto
- ✅ Comando `boards show` funcional
- ✅ Migration guide completo

---

### Fase 2: Recursos Avançados (Sprint 2 - 3 semanas)

**Tarefas:**

1. **Implementar Search** (3 dias)
   - [ ] Criar `SearchCardsUseCase.ts`
   - [ ] Integrar Trello Search API
   - [ ] Adicionar comando `tcu cards search`
   - [ ] Adicionar testes

2. **Implementar Bulk Operations** (4 dias)
   - [ ] Criar `BulkUpdateCardsUseCase.ts`
   - [ ] Criar `BulkMoveCardsUseCase.ts`
   - [ ] Criar `BulkArchiveCardsUseCase.ts`
   - [ ] Adicionar comandos `bulk-*`
   - [ ] Adicionar progress bar para operações longas

3. **Melhorar Modo Interativo** (3 dias)
   - [ ] Criar `InteractiveNavigator.ts`
   - [ ] Adicionar breadcrumb navigation
   - [ ] Adicionar atalhos de teclado
   - [ ] Adicionar histórico de navegação

4. **Config Profiles** (4 dias)
   - [ ] Refatorar `ConfigEntity` para suportar profiles
   - [ ] Criar `ProfileManagementUseCase.ts`
   - [ ] Adicionar comandos `config profiles *`
   - [ ] Migrar config existente automaticamente
   - [ ] Adicionar testes

5. **Testes e Documentação** (2 dias)
   - [ ] Cobertura > 95%
   - [ ] Atualizar README
   - [ ] Adicionar exemplos práticos

**Entregáveis:**

- ✅ Search funcional
- ✅ Bulk operations
- ✅ Modo interativo melhorado
- ✅ Config profiles
- ✅ Cobertura de testes mantida

---

### Fase 3: Recursos Futuros (Sprint 3+ - A definir)

**Tarefas:**

1. Export/Import (1 semana)
2. Modo Offline (1 semana)
3. Sistema de Plugins (2 semanas)

---

## ⚠️ Breaking Changes e Migração

### Comandos Deprecados

| Comando Antigo             | Novo Comando                | Status        |
| -------------------------- | --------------------------- | ------------- |
| `tcu boards`               | `tcu boards list`           | Alias mantido |
| `tcu lists <boardName>`    | `tcu lists list <board-id>` | Breaking      |
| `tcu cards <board> <list>` | `tcu cards list <list-id>`  | Breaking      |

### Migration Guide

```bash
# Antes (v0.x)
tcu boards
tcu lists "My Board"
tcu cards "My Board" "To Do"

# Depois (v1.x)
tcu boards list
tcu lists list <board-id>
tcu cards list <list-id>

# Helpers para migration
tcu boards list --json | jq -r '.[] | "\(.name): \(.id)"'  # Ver IDs dos boards
```

### Deprecation Warnings

```typescript
// Adicionar warnings nos comandos antigos
if (oldCommandUsed) {
  console.warn("⚠️  DEPRECATION WARNING:");
  console.warn(`   Command 'tcu lists <boardName>' is deprecated.`);
  console.warn(`   Use 'tcu lists list <board-id>' instead.`);
  console.warn("   This command will be removed in v2.0.0");
}
```

---

## 📦 Dependências Adicionais

```json
{
  "dependencies": {
    "cli-table3": "^0.6.5", // Formatação de tabelas
    "json2csv": "^6.0.0", // Exportação CSV
    "ora": "^8.0.1", // Spinners e progress
    "chalk": "^5.3.0" // Colorização avançada
  },
  "devDependencies": {
    "@types/cli-table3": "^0.6.5",
    "@types/json2csv": "^6.0.0"
  }
}
```

---

## 🧪 Estratégia de Testes

### Cobertura Mínima: 95%

**Testes por Fase:**

**Fase 1:**

- `OutputFormatter.test.ts` - Formatação JSON/Table/CSV
- `ErrorHandler.test.ts` - Tratamento de erros
- `CommandController.test.ts` - Novos comandos
- `GetBoardDetailsUseCase.test.ts` - Detalhes do board

**Fase 2:**

- `SearchCardsUseCase.test.ts` - Busca
- `BulkOperations.test.ts` - Operações em lote
- `InteractiveNavigator.test.ts` - Navegação interativa
- `ProfileManagement.test.ts` - Profiles

**Testes de Integração:**

- `cli/commands.integration.test.ts` - Fluxo completo de comandos
- `cli/interactive.integration.test.ts` - Modo interativo end-to-end

---

## 📊 Métricas de Sucesso

### KPIs

- ✅ **Consistência de Comandos:** 100% dos comandos seguem padrão `recurso verbo`
- ✅ **Cobertura de Testes:** Manter > 95%
- ✅ **Error Handling:** 100% dos inputs validados
- ✅ **Output Formatting:** 100% dos comandos suportam `--json` e `--table`
- ✅ **Documentação:** Migration guide e exemplos completos
- ✅ **CI/CD:** Todos os testes passam em todos os commits

### Métricas de Qualidade

- **Tempo de resposta:** < 200ms para comandos locais
- **Tempo de build:** < 30s no CI
- **Tamanho do bundle:** < 2MB
- **Tempo de instalação:** < 10s

---

## 🚀 Cronograma

| Fase   | Duração   | Entrega                           | Release |
| ------ | --------- | --------------------------------- | ------- |
| Fase 1 | 2 semanas | Comandos padronizados + Output    | v1.0.0  |
| Fase 2 | 3 semanas | Search + Bulk + Profiles          | v1.1.0  |
| Fase 3 | A definir | Export/Import + Offline + Plugins | v2.0.0  |

**Início:** 11 de novembro de 2025  
**Fase 1 Concluída:** 25 de novembro de 2025  
**Fase 2 Concluída:** 16 de dezembro de 2025

---

## 🎯 Próximos Passos Imediatos

### Esta Semana (11-15 Nov)

1. **Segunda-feira:**
   - [ ] Criar branch `feature/issue-9-command-structure`
   - [ ] Refatorar `CommandController.ts` com nova estrutura
   - [ ] Criar aliases para comandos antigos

2. **Terça-feira:**
   - [ ] Implementar `OutputFormatter.ts`
   - [ ] Adicionar flags `--format`, `--json`, `--table`

3. **Quarta-feira:**
   - [ ] Criar `ErrorHandler.ts` e custom errors
   - [ ] Adicionar validações em todos os comandos

4. **Quinta-feira:**
   - [ ] Implementar `GetBoardDetailsUseCase`
   - [ ] Adicionar comando `tcu boards show`

5. **Sexta-feira:**
   - [ ] Escrever migration guide
   - [ ] Atualizar README
   - [ ] Criar PR com breaking changes warning

---

## 📝 Notas Adicionais

### Considerações de Design

1. **Backward Compatibility:** Manter aliases para comandos antigos por 1 release
2. **Semantic Versioning:** Fase 1 = v1.0.0 (breaking), Fase 2 = v1.1.0 (features)
3. **i18n:** Todas as novas mensagens devem ter tradução pt-BR e en
4. **Performance:** Manter Bun como runtime para performance máxima
5. **Testes:** Adicionar testes ANTES de implementar features

### Riscos e Mitigações

| Risco                             | Probabilidade | Impacto | Mitigação                                |
| --------------------------------- | ------------- | ------- | ---------------------------------------- |
| Breaking changes quebram usuários | Alta          | Alto    | Migration guide + deprecation warnings   |
| Cobertura < 95%                   | Média         | Alto    | Escrever testes primeiro (TDD)           |
| CI/CD quebra                      | Baixa         | Alto    | Testar localmente com `bun run validate` |
| Performance degradada             | Baixa         | Médio   | Benchmarks antes/depois                  |

---

## 🎬 Conclusão

Este plano de ação transforma a Issue #9 em um roadmap executável com:

- ✅ **3 Fases** bem definidas (Refatoração → Recursos Avançados → Futuro)
- ✅ **Tarefas específicas** com estimativas de tempo
- ✅ **Breaking changes** documentados com migration guide
- ✅ **Testes** garantindo > 95% cobertura
- ✅ **CI/CD** automatizado mantendo qualidade
- ✅ **Cronograma** realista (5+ semanas)

**Próxima ação:** Criar branch `feature/issue-9-command-structure` e iniciar Fase 1! 🚀

---

**Documento criado em:** 10 de novembro de 2025  
**Última atualização:** 10 de novembro de 2025  
**Autor:** AI Agent (baseado em feedback da Issue #9)  
**Revisão:** @JaegerCaiser
