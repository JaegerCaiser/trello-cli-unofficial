# Estrutura de Testes

Este diretório contém todos os testes do projeto, organizados seguindo a arquitetura DDD.

## 📁 Estrutura

```
tests/
├── unit/                  # Testes unitários isolados
│   ├── domain/           # Testes das entidades e serviços do domínio
│   │   ├── entities/    # Testes de Board, Card, List, Config
│   │   └── services/    # Testes de AuthenticationService
│   └── application/      # Testes dos casos de uso
│       └── use-cases/   # Testes de GetBoards, CreateCard, etc.
├── integration/          # Testes de integração entre componentes
├── mocks/                # Mock implementations dos repositórios
└── helpers/              # Dados de teste e funções auxiliares
```

## 🧪 Tipos de Teste

### Testes Unitários (`tests/unit/`)

- **Domain Entities**: Testam a lógica das entidades (Board, Card, List, Config)
- **Domain Services**: Testam os serviços de domínio (AuthenticationService)
- **Use Cases**: Testam os casos de uso com repositórios mockados

### Testes de Integração (`tests/integration/`)

- Testam o fluxo completo entre múltiplos componentes
- Validam a interação entre use cases e repositórios
- Exemplo: ciclo completo de criar → ler → atualizar → deletar cartão

### Mocks (`tests/mocks/`)

- **MockConfigRepository**: Simula persistência de configuração em memória
- **MockTrelloRepository**: Simula a API do Trello em memória

### Helpers (`tests/helpers/`)

- **TestData**: Dados de teste pré-configurados
- **Factory functions**: Funções para criar entidades de teste

## 🚀 Executando os Testes

```bash
# Executar todos os testes
bun test

# Executar com watch mode (re-executa ao salvar arquivos)
bun test:watch

# Executar apenas testes unitários
bun test:unit

# Executar apenas testes de integração
bun test:integration

# Executar com coverage
bun test:coverage
```

## 📝 Convenções

### Nomenclatura

- Arquivos de teste: `*.test.ts`
- Um arquivo de teste por arquivo de código fonte
- Mocks: `Mock{ClassName}.ts`

### Estrutura de Testes

```typescript
import { beforeEach, describe, expect, test } from 'bun:test';

describe('ComponentName', () => {
  let instance: ComponentType;

  beforeEach(() => {
    // Setup antes de cada teste
    instance = new ComponentType();
  });

  describe('methodName', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = instance.methodName(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Boas Práticas

1. **Isolamento**: Cada teste deve ser independente
2. **Clareza**: Nomes descritivos usando padrão "should..."
3. **AAA Pattern**: Arrange, Act, Assert
4. **Mocks**: Use mocks para dependências externas
5. **Coverage**: Teste casos de sucesso e erro

## 🎯 Cobertura de Testes

### Domain Layer

- ✅ BoardEntity
- ✅ CardEntity
- ✅ ConfigEntity
- ✅ AuthenticationService

### Application Layer

- ✅ GetBoardsUseCase
- ✅ CreateCardUseCase
- ✅ UpdateCardUseCase
- ✅ AuthenticateUserUseCase

### Integration

- ✅ Card Management (CRUD completo)

## 📚 Recursos

- [Bun Test Runner](https://bun.sh/docs/cli/test)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🔄 Próximos Passos

- [ ] Adicionar testes para GetListsUseCase e GetCardsUseCase
- [ ] Adicionar testes para DeleteCardUseCase e MoveCardUseCase
- [ ] Criar testes para FileConfigRepository (com filesystem mockado)
- [ ] Adicionar testes E2E para o CLI
- [ ] Configurar CI/CD para executar testes automaticamente
