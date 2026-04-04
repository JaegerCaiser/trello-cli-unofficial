# Arquitetura e Extensibilidade

## Visão geral

O projeto é organizado como um CLI em Bun + TypeScript seguindo princípios de Domain-Driven Design (DDD). A separação de camadas garante clareza, testabilidade e possibilidade de extensão futura.

## Camadas principais

- `src/domain/`
  - Entidades e regras de negócio
  - Interfaces de repositório
  - Serviços de domínio

- `src/application/`
  - Casos de uso (use cases)
  - Orquestração entre domínio e infraestrutura

- `src/infrastructure/`
  - Implementações concretas de repositórios
  - Integração com Trello API e arquivo de configuração

- `src/presentation/`
  - CLI e controle de comandos
  - Modo interativo e parsing de entradas

## Fluxo de dados

1. Usuário executa um comando ou inicia o modo interativo
2. Presentation chama um caso de uso em `src/application`
3. Caso de uso utiliza entidades de domínio e repositórios
4. Repositórios em `src/infrastructure` acessam Trello ou o sistema de arquivos
5. Resultado é formatado e exibido ao usuário

## Extensibilidade

- Novos comandos podem ser adicionados em `src/presentation/cli`
- Novas operações de Trello podem entrar como casos de uso em `src/application/use-cases`
- Troca de backend (por exemplo, outro serviço de API) fica isolada em `src/infrastructure`

## Internacionalização

A lógica de i18n está centralizada em `src/i18n/`, permitindo suporte a múltiplos idiomas sem alterar a lógica de comando.

## Por que DDD?

- mantém regras de negócio fora da camada de apresentação
- facilita testes unitários de cada camada
- suporta crescimento do CLI com menos acoplamento
