# Internacionalização (i18n)

Este projeto usa **i18next** para suportar múltiplos idiomas.

## Idiomas Suportados

- 🇧🇷 **Português (pt-BR)** - Padrão para sistemas em Português
- 🇺🇸 **English (en)** - Padrão para outros sistemas

## Detecção Automática

O idioma é detectado automaticamente baseado na variável de ambiente `LANG` do sistema.

## Como Usar

### Importando a função de tradução

```typescript
import { t } from "@/i18n";
```

### Tradução simples

```typescript
console.log(t("auth.notAuthenticated"));
// 🇧🇷: "🔐 Você não está autenticado!"
// 🇺🇸: "🔐 You are not authenticated!"
```

### Tradução com interpolação

```typescript
console.log(t("board.notFound", { name: "My Board" }));
// 🇧🇷: "❌ Board não encontrado: My Board"
// 🇺🇸: "❌ Board not found: My Board"
```

### Mudando o idioma manualmente

```typescript
import { changeLanguage } from "@/i18n";

changeLanguage("en"); // Muda para Inglês
changeLanguage("pt-BR"); // Muda para Português
```

### Obtendo o idioma atual

```typescript
import { getCurrentLanguage } from "@/i18n";

const currentLang = getCurrentLanguage();
console.log(currentLang); // 'pt-BR' ou 'en'
```

## Estrutura dos Arquivos

```
src/i18n/
├── index.ts              # Configuração e funções helper
└── locales/
    ├── pt-BR.json        # Traduções em Português
    └── en.json           # Traduções em Inglês
```

## Adicionando Novas Traduções

1. Adicione a chave em `src/i18n/locales/pt-BR.json`:

```json
{
  "myFeature": {
    "message": "Minha mensagem em português"
  }
}
```

2. Adicione a mesma chave em `src/i18n/locales/en.json`:

```json
{
  "myFeature": {
    "message": "My message in English"
  }
}
```

3. Use no código:

```typescript
import { t } from "@/i18n";

console.log(t("myFeature.message"));
```

## Exemplo Completo

```typescript
import { t } from "@/i18n";
import inquirer from "inquirer";

export class AuthController {
  async setupToken(): Promise<void> {
    const { token } = await inquirer.prompt([
      {
        type: "input",
        name: "token",
        message: t("auth.enterToken"),
        validate: (input) => input.startsWith("ATTA") || t("auth.tokenInvalid"),
      },
    ]);

    console.log(t("auth.tokenSaved"));
  }
}
```

## Testando Diferentes Idiomas

### Linux/macOS

```bash
# Testar em Português
LANG=pt_BR.UTF-8 bun run main.ts

# Testar em Inglês
LANG=en_US.UTF-8 bun run main.ts
```

### Windows (PowerShell)

```powershell
# Testar em Português
$env:LANG = "pt_BR.UTF-8"; bun run main.ts

# Testar em Inglês
$env:LANG = "en_US.UTF-8"; bun run main.ts
```

## Boas Práticas

1. ✅ **Use chaves descritivas**: `auth.notAuthenticated` em vez de `msg1`
2. ✅ **Organize por feature**: `auth.*`, `card.*`, `board.*`
3. ✅ **Mantenha consistência**: Use os mesmos emojis em ambos os idiomas
4. ✅ **Interpole valores dinâmicos**: Use `{{variavel}}` para valores que mudam
5. ✅ **Fallback para inglês**: Sempre mantenha o inglês completo como fallback

## TypeScript Support

O projeto está configurado com tipos para i18next. O TypeScript vai autocompletar as chaves de tradução disponíveis!
