import antfu from '@antfu/eslint-config';

export default antfu(
  {
    type: 'lib',
    typescript: true,
    formatters: false, // Desabilitar formatters para evitar conflito com VSCode
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/*.backup',
      '**/bun.lock',
      '**/.vscode',
      '**/.idea',
      '**/coverage',
      '**/*.md',
    ],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      'no-hardcoded-messages': {
        rules: {
          'no-hardcoded-messages': {
            create(context) {
              function checkStringValue(value, node, context) {
                const trimmedValue = value.trim();

                // Skip empty strings, constants, or technical strings
                if (
                  trimmedValue.length === 0
                  || /^[A-Z_]+$/.test(trimmedValue)
                  || /^[a-z]+\.[a-z]+$/i.test(trimmedValue) // API field names like 'name', 'id'
                  || /^\d+$/.test(trimmedValue) // Numbers as strings
                  || /^https?:\/\//.test(trimmedValue) // URLs
                  || trimmedValue.startsWith('--') // CLI flags
                  || (trimmedValue.includes('<') && trimmedValue.includes('>')) // Command patterns like 'create <name>'
                  || trimmedValue === 'table' // Output format
                  || trimmedValue === 'json' // Output format
                  || trimmedValue === 'csv' // Output format
                  || trimmedValue.length <= 10 // Short technical strings
                  || /^[a-f0-9]{32}$/i.test(trimmedValue) // API keys like Trello API key
                  || (/^[a-z-]+$/i.test(trimmedValue) && trimmedValue.includes('-')) // CLI command names like 'trello-cli-unofficial'
                  || /^\d+\.\d+\.\d+$/.test(trimmedValue) // Version numbers like '1.0.0'
                  || (/^[a-z ]+$/i.test(trimmedValue) && trimmedValue.split(' ').length === 2) // Command identifiers like 'boards list', 'boards show'
                  || trimmedValue.includes('cli') // CLI-related technical strings
                ) {
                  return;
                }

                // Skip translation keys (lowercase with dots, typical i18n pattern)
                if (/^[a-z][a-zA-Z0-9.]*$/.test(trimmedValue) && trimmedValue.includes('.')) {
                  return;
                }

                // Check if it's a user-facing message (contains emoji or seems like a user message)
                const emojiRegex = /\p{Emoji}/u.test(trimmedValue);
                const uiKeywords = trimmedValue.length > 10 && /\b(?:board|list|card|command|error|success|failed|found|created|updated|deleted)\b/i.test(trimmedValue);
                const portuguese = trimmedValue.includes(' ') && /[a-záéíóúãõâêôç]/i.test(trimmedValue) && trimmedValue.split(' ').length > 1;
                const isUserMessage = emojiRegex || uiKeywords || portuguese;

                if (isUserMessage) {
                  context.report({
                    node,
                    message: 'Use the i18n translation function t() instead of hardcoded strings for user-facing messages',
                  });
                }
              }

              return {
                Literal(node) {
                  // Skip import/export paths
                  if (node.parent?.type === 'ImportDeclaration'
                    || node.parent?.type === 'ExportNamedDeclaration'
                    || node.parent?.type === 'ExportAllDeclaration'
                    || node.parent?.type === 'ImportSpecifier'
                    || node.parent?.type === 'ExportSpecifier') {
                    return;
                  }

                  // Only check string literals
                  if (typeof node.value !== 'string') {
                    return;
                  }

                  checkStringValue(node.value, node, context);
                },

                TemplateLiteral(node) {
                  // Check template literals (strings with ${...})
                  const staticParts = node.quasis.map(quasi => quasi.value.raw);
                  const fullString = staticParts.join('');

                  // Only check if it's mostly static text (not just variables)
                  if (fullString.length > 5) {
                    checkStringValue(fullString, node, context);
                  }
                },
              };
            },
          },
        },
      },
    },
    rules: {
      // Relaxar algumas regras para o projeto CLI
      'no-console': 'off',
      'style/brace-style': 'off',
      'style/max-statements-per-line': 'off',
      'node/prefer-global/process': 'off',
      'ts/consistent-type-imports': 'error',
      'no-case-declarations': 'off',
      'antfu/no-top-level-await': 'off',
      'unicorn/prefer-top-level-await': 'off',

      // Regra customizada para obrigar uso do i18n
      'no-hardcoded-messages/no-hardcoded-messages': 'error',

      // Qualidade de código
      'no-unused-vars': 'off',
      'ts/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'ts/no-explicit-any': 'warn',
      'ts/explicit-function-return-type': 'off',

      // Estilo
      'curly': ['error', 'all'],

      // Proibir imports relativos com '..'
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../**'],
          message: 'Use absolute imports instead of relative imports with ".."',
        }],
      }],
    },
  },
  {
    // Configurações específicas para arquivos de teste
    files: ['tests/**/*.test.ts', 'tests/**/*.spec.ts', 'tests/**/*.ts'],
    rules: {
      'ts/no-explicit-any': 'off', // Permite 'any' em testes
      'test/prefer-lowercase-title': 'off',
      'no-hardcoded-messages/no-hardcoded-messages': 'off', // Permite strings hardcoded em testes
    },
  },
);
