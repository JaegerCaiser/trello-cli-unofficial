# Debug OIDC/Trusted Publisher - NPM

## Configuração Necessária no NPM

Para que o Trusted Publisher funcione, você precisa configurar no NPM:

1. Acesse: https://www.npmjs.com/settings/jaegercaiser/packages/trello-cli-unofficial/access
2. Vá para a aba **"Publishing access"** ou **"Trusted Publishers"**
3. Adicione um novo Trusted Publisher com:

```
Provider: GitHub Actions
Owner: JaegerCaiser
Repository: trello-cli-unofficial
Workflow: .github/workflows/release.yml
Environment: (deixe em branco)
```

## Verificação

Após configurar, aguarde 2-5 minutos para que a configuração seja propagada nos servidores do NPM.

## Alternativa Temporária (não recomendada)

Se precisar publicar urgentemente enquanto resolve o OIDC, você pode:

1. Gerar um token granular no NPM (7 dias de validade)
2. Adicionar como secret `NPM_TOKEN` no repositório GitHub
3. Modificar temporariamente o workflow para usar:
   ```yaml
   - name: Publish to NPM
     run: |
       echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc
       npm publish --provenance --access public
   ```

**Mas isso NÃO é a solução ideal!** Use apenas se o Trusted Publisher estiver com problemas.

## Troubleshooting

### Erro "ENEEDAUTH"

- Trusted Publisher não configurado corretamente
- Aguardar propagação da configuração (2-5 minutos)
- Workflow filename não corresponde exatamente

### Permissões no Workflow

Confirme que o job tem:

```yaml
permissions:
  contents: write
  id-token: write # ← ESSENCIAL para OIDC
```

### Package Scope

Para pacotes com scope (`@user/package`), use:

```yaml
run: npm publish --provenance --access public
```

Para pacotes sem scope (como `trello-cli-unofficial`), o atual está correto.
