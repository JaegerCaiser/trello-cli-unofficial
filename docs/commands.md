# Command Reference

## Overview

O `trello-cli-unofficial` usa uma estrutura de subcomandos clara para separar boards, lists, cards e configuração.

## Base Commands

```bash
tcu boards

tcu lists
tcu cards
tcu config
```

## Principais Grupos

- `boards` — gerencia boards
- `lists` — gerencia listas dentro de boards
- `cards` — gerencia cards dentro de listas
- `config` — configurações e autenticação

## Exemplos rápidos

```bash
# Listar boards
tcu boards list

# Mostrar detalhes de um board
tcu boards show <boardId>

# Listar listas de um board
tcu lists list <boardId>

# Listar cards de uma lista
tcu cards list <listId>

# Criar um card
tcu cards create <listId> "Task title" --desc "Descrição"

# Buscar cards por texto
tcu cards search "bug crítico"

# Configurar autenticação
tcu setup
```

## Referência de Comandos de Cards

### `cards search <query>`

Busca cards pelo texto da query em todos os boards/listas acessíveis.

```
tcu cards search <query> [opções]
```

**Opções:**

| Opção | Descrição |
|---|---|
| `--board-id <boardId>` | Filtra resultados por ID de board |
| `--list-id <listId>` | Filtra resultados por ID de lista (filtro client-side) |
| `--labels <labels>` | Filtra por labels (separadas por vírgula) |
| `--limit <limit>` | Número máximo de resultados (padrão: 50) |
| `--page <page>` | Página de resultados, começa em 0 (padrão: 0) |
| `-f, --format <format>` | Formato de saída: `table` (padrão), `json`, `csv` |

**Exemplos:**

```bash
# Busca simples por texto
tcu cards search "bug crítico"

# Filtrar por board específico
tcu cards search "feature" --board-id abc123

# Filtrar por lista específica
tcu cards search "task" --list-id xyz789

# Filtrar por labels (separadas por vírgula)
tcu cards search "bug" --labels "Backend,Urgente"

# Paginação: segunda página com 10 resultados por página
tcu cards search "card" --limit 10 --page 1

# Combinar filtros
tcu cards search "feature" --board-id abc123 --labels "Backend" --limit 20 --page 0

# Saída em JSON
tcu cards search "api" --format json
```

**Notas:**
- O filtro `--list-id` é aplicado client-side após a busca na API do Trello.
- O filtro `--labels` converte nomes em termos de query (`label:"nome"`) antes de enviar para a API.
- A paginação usa índice baseado em 0 (`--page 0` é a primeira página).


## Formatos de saída

A maioria dos comandos aceita a opção `--format`:

- `table` — padrão
- `json`
- `csv`

## Ajuda rápida

Para ver todas as opções de um comando:

```bash
tcu <comando> --help
```
