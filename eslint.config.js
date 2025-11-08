import antfu from '@antfu/eslint-config';

export default antfu(
  {
    type: 'lib',
    typescript: true,
    formatters: true,
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
    },
  },
  {
    // Configurações específicas para arquivos de teste
    files: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    rules: {
      'ts/no-explicit-any': 'off', // Permite 'any' em testes
      'test/prefer-lowercase-title': 'off',
    },
  },
);
