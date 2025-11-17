# Plano de Melhoria - Issue #9 (Improvements)

**Resumo:** Este documento detalha as funcionalidades faltantes e melhorias propostas discutidas no `ISSUE_9_ACTION_PLAN.md` e observadas durante a inspeção do board e do repositório. O objetivo é transformar o `tcu` em uma CLI completa que substitua 100% das operações atualmente realizadas pela API Trello, incluindo gerenciamento de labels, checklists, membros, e 'cards show' com todos os detalhes.

Última atualização: 16 de novembro de 2025

---

## 1. Objetivo
O objetivo deste workstream é completar as funcionalidades essenciais faltantes identificadas na Fase 1 e transformar o `tcu` em um CLI capaz de realizar todas as operações necessárias no Trello sem que seja preciso usar a API diretamente. Além de recursos, priorizamos testes e documentação para garantir qualidade e migração limpa.

## 2. Contexto e Justificativa
Atualmente o CLI cobre a maior parte das operações de gerenciamento de boards, lists e cards. No entanto, para ser um substituto completo da API, ainda faltam comandos que suportem:
- `cards show <cardId>` com checklists, attachments, e membros;
- gerenciamento de labels (`labels create, labels list`);
- gerenciamento de checklists e itens (`checklists create, checklists item add`);
- atribuição de membros a cards (`cards member add`);
- adição de checklists/características que antes só eram possíveis por API.

Também faltam testes unitários/integrados que cubram OutputFormatter, ErrorHandler e GetBoardDetailsUseCase; e documentação detalhada, incluindo migration guide para breaking changes.

## 3. Gap Summary (lista objetiva)
- `cards show` ausente (não há comando que exiba checklists/attachments/members)
- Não há CLI para criar labels em board e adicionar labels a cards
- Não há CLI para criar checklists e adicionar itens
- Não há CLI para adicionar members a cards
- `boards show` não exibe `membros` e `labels` (GetBoardDetailsUseCase ainda não retorna)
- Tests ausentes: OutputFormatter, ErrorHandler, GetBoardDetailsUseCase tests
- Partial ErrorHandler integration: implementado, mas não usado em todas as controllers
- Documentação incompleta (migration guide, examples, troubleshooting)
- `tcu` não tem um modelo de migration/deprecation formal para breaking changes

## 4. Proposta de Solução (alto nível)
A solução será implementada em fases, favor alinhada com o `ISSUE_9_ACTION_PLAN.md` (Fase 1/2/3). O foco inicial é Fase 1: cobertura de UX/CLI e correções.

### 4.1 Funcionalidades a adicionar (Fase 1)
- `tcu cards show <cardId>`: mostra descrição completa, checklists, membros, labels, attachments.
- `tcu labels create --board <boardId> --name <name> --color <color>` e `tcu labels list <boardId>`.
- `tcu cards label add <cardId> --label <labelId>` / `cards label remove`.
- `tcu checklists create --card <cardId> --name <name>`.
- `tcu checklists item add --checklist <checklistId> --name <item>`.
- `tcu cards member add <cardId> --member <memberId>` / `cards member remove`.
- `tcu boards show <boardId>`: completar com `members` e `labels` na saída.
- `tcu config profiles` e `tcu config validate` (config profiles migradas para Fase 1.2/2.4 conforme plano).

### 4.2 Refatorações/Arquitetura
- Expandir `TrelloRepository` com novos métodos:
  - `getCard(cardId)` -> `CardDetailEntity` (inclui checklists, attachments, members, labels)
  - `createLabel(boardId, name, color)`
  - `getLabels(boardId)`
  - `addLabelToCard(cardId, labelId)`
  - `createChecklist(cardId, name)`
  - `addChecklistItem(checklistId, name)`
  - `addMemberToCard(cardId, memberId)`
- Atualizar `TrelloApiRepository` para implementar os novos métodos, usando query params `checklists=all&attachments=true&members=true` para `getCard`.
- Atualizar `CardController`, `BoardController` e `CommandController` com novos métodos e registro de comando.

### 4.3 Tests & Quality
- Adicionar testes unitários:
  - `tests/unit/shared/OutputFormatter.test.ts` (json/table/csv/escaping)
  - `tests/unit/shared/ErrorHandler.test.ts` (mapear status codes para custom errors)
  - `tests/unit/application/use-cases/GetBoardDetailsUseCase.test.ts` (membros/labels)
- Adicionar testes de integração para: `cards show`, `boards show`, `labels create`.
- Garantir cobertura > 95%.

### 4.4 Documentação
- Atualizar `README.md` com exemplos dos comandos e flags `--format`.
- Criar `docs/migration-guide.md` e `docs/troubleshooting.md`.
- Atualizar `CONTRIBUTING.md` com guidelines e testes CI.

## 5. Comandos propostos (CLI)
Exemplos de uso que substituem operações API:
- Cards: show
  - `tcu cards show <cardId>` -> Imprime nome, descrição, checklist (com status), membros, labels, attachments (short URLs)
- Labels: create/list
  - `tcu labels create <boardId> --name Fase-1 --color green`
  - `tcu labels list <boardId>`
- Labels: add/remove
  - `tcu cards label add <cardId> --label <labelId>`
  - `tcu cards label remove <cardId> --label <labelId>`
- Checklists
  - `tcu checklists create <cardId> --name "Critérios"`
  - `tcu checklists item add <checklistId> --name "Escrever testes"`
- Members
  - `tcu cards member add <cardId> --member <memberId>`
  - `tcu cards member remove <cardId> --member <memberId>`

## 6. Arquivos impactados (propostos)
- `src/domain/repositories/TrelloRepository.ts`
- `src/infrastructure/repositories/TrelloApiRepository.ts`
- `src/presentation/cli/CardController.ts`
- `src/presentation/cli/CommandController.ts`
- `src/presentation/cli/BoardController.ts`
- `src/shared/OutputFormatter.ts` (refinements)
- `src/shared/ErrorHandler.ts` (integração contínua)
- `tests/unit/*` and `tests/integration/*` (new tests)

## 7. Critérios de Aceitação
Para cada feature, definir explicitamente:
- Implementar o método no repositório que mapeia 1:1 para as operações via Trello API
- Criar o método no Controller e o comando correspondente no `CommandController`
- Implementar casos de teste unitários + integração
- Atualizar documentação com exemplos e flags

## 8. Timeline & Priorização
Fase 1 (2 semanas) — entregas críticas:
- Implementar OutputFormatter tests (1 dia)
- Implementar ErrorHandler tests e integração (2 dias)
- Implementar `cards show` com `getCard` (1 dia)
- Implementar Labels/Checklists/Members commands (3-4 dias)
- Atualizar `boards show` com membros/labels (1 dia)
- Atualizar documentação e migration guide (2 dias)

Fase 2 (3 semanas) — recursos avançados:
- `tcu search`, `tcu cards bulk-*`, `config profiles`, `interactive navigator`.

Fase 3 — Offline & Plugins (future)

## 9. Migração & Backwards Compatibility
- Adicionar aliases para comandos antigos e warnings deprecatórios;
- Publication of `docs/migration-guide.md` explaining the `tcu` command changes;
- Deprecation warnings for at least one release cycle.

## 10. Tarefas imediatas recomendadas
1. Implementar `getCard` no `TrelloRepository` e `TrelloApiRepository`
2. Implementar `tcu cards show <cardId>` (controller + command)
3. Implementar `labels` / `checklists` / `members` CLI subcommands
4. Criar testes unitários/integrados correspondentes
5. Atualizar documentação e criar migration guide
6. Criar issues/PRs para cada subtask

## 11. Notas finais
- Eu já criei e padronizei cards no Trello para cobrir testes, error handler, cards show, board details, e doc updates (IDs e URLs no board foram atualizados). Essas novas cards já contém checklists, labels e membros (alocados a `matheus`).
- A estratégia é implementar e testar cada feature no repositório, adicionar integração no CI/CD e publicar uma versão compatível com migration guide.

---

Caso queira, eu posso iniciar uma PR para: `tcu cards show <cardId>` (repositório, testes e command controller), que é um bom primeiro passo para reduzir dependência da API direto no terminal.

</content>