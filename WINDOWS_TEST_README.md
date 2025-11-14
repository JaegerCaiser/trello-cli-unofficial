# 🪟 Windows Compatibility Test

## Problema Identificado

O CLI estava falhando no Windows com o erro `this.program is undefined` durante a inicialização do Commander.js. O problema ocorria porque o Commander era inicializado de forma lazy no método `run()`, mas no Windows isso falhava.

## Correção Aplicada

- **Mudança**: Inicializar Commander.js diretamente no construtor em vez de lazy initialization
- **Motivo**: Garante que o Commander esteja sempre disponível quando `setupCommands()` for chamado
- **Baseado em**: Commit `ed3f571` que funcionava anteriormente

## Como Testar no Windows

### Opção 1: Teste Rápido (Recomendado)

1. Clone/baixe o repositório atualizado
2. Execute o script de teste:
   ```bash
   node test-windows-compatibility.js
   ```

### Opção 2: Teste Manual

1. Instale o pacote globalmente:
   ```bash
   npm install -g trello-cli-unofficial-0.11.3.tgz
   ```

2. Teste os comandos básicos:
   ```bash
   tcu --help
   tcu --version
   tcu boards --help
   ```

### Resultados Esperados

Se a correção funcionar, você deve ver:
- ✅ Todos os comandos funcionam sem erro
- ✅ Nenhuma mensagem de "this.program is undefined"
- ✅ Help e version commands respondem corretamente

### Se Ainda Falhar

Se o problema persistir, pode indicar:
- Problema específico de bundling do Bun no Windows
- Diferenças na resolução de módulos entre plataformas
- Problemas com paths do Windows

## Arquivos de Teste

- `test-windows-compatibility.js`: Script automatizado de teste
- `dist/main.js`: Bundle criado pelo Bun
- `trello-cli-unofficial-0.11.3.tgz`: Pacote npm pronto para instalação

## Logs de Debug

Para mais informações, execute com debug:
```bash
set DEBUG=* & tcu --help
```