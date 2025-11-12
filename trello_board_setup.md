# 🏗️ Setup do Quadro Trello CLI Unofficial

## 📋 Estrutura Ágil Recomendada

### Listas (Colunas):
1. **Backlog** - Tarefas futuras (Fase 2 e 3)
2. **To Do** - Prontas para desenvolvimento  
3. **In Progress** - Em desenvolvimento ativo
4. **Review/QA** - Testes e validação
5. **Done** - Concluídas

### Épicos (Labels/Categorias):
- 🔴 **Fase 1** - Refatoração (já concluída)
- 🟡 **Fase 2** - Recursos Avançados
- 🟢 **Fase 3** - Recursos Futuros
- 🐛 **Bug** - Correções
- 📚 **Docs** - Documentação

## 🎯 Cartões por Épico

### 🔴 Fase 1 - Refatoração (DONE)
- ✅ Refatorar estrutura de comandos
- ✅ Implementar métodos de controller
- ✅ Resolver conflitos de comandos
- ✅ Testar nova estrutura
- ✅ Executar testes de validação

### 🟡 Fase 2 - Recursos Avançados (BACKLOG)

#### 📊 Output Formatting
- Implementar OutputFormatter class
- Adicionar flags --format json/table/csv
- Integrar formatação em todos os comandos

#### 🚨 Error Handling  
- Criar ErrorHandler.ts
- Implementar custom errors
- Adicionar validações de input
- Melhorar mensagens de erro

#### 📋 Board Details
- Implementar GetBoardDetailsUseCase
- Criar comando boards show <id>
- Adicionar testes

#### 🔍 Search Functionality
- Criar SearchCardsUseCase
- Integrar Trello Search API
- Implementar comando cards search

#### 📦 Bulk Operations
- Criar BulkUpdateCardsUseCase
- Implementar bulk-move, bulk-update
- Adicionar progress indicators

#### 🎮 Interactive Mode
- Criar InteractiveNavigator
- Adicionar breadcrumb navigation
- Implementar atalhos de teclado

#### ⚙️ Config Profiles
- Refatorar ConfigEntity para profiles
- Criar ProfileManagementUseCase
- Adicionar comandos config profiles

### 🟢 Fase 3 - Recursos Futuros (BACKLOG)
- Export/Import functionality
- Offline mode
- Plugin system

### 📚 Documentation (BACKLOG)
- Atualizar README.md
- Criar migration guide
- Documentar novos comandos
- Adicionar exemplos práticos

## 🎨 Template de Cartão

**Título:** [ÉPICO] Nome da tarefa

**Descrição:**
```
**Objetivo:** Descrição clara do que fazer

**Critérios de Aceitação:**
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

**Arquivos afetados:**
- `src/path/to/file.ts`
- `tests/path/to/test.ts`

**Estimativa:** X dias/horas
**Prioridade:** Alta/Média/Baixa
```

**Labels:** Fase-X, Tipo (Feature/Bug/Docs)
