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

# Configurar autenticação
tcu setup
```

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
