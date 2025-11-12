/* eslint-disable ts/no-require-imports */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import i18next from 'i18next';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import translations statically - this will only execute at runtime, not during lint
// The linting process doesn't actually execute this code, so no warning will be shown
const enTranslations
  = process.env.NODE_ENV !== 'lint'
    ? require('./locales/en.json')
    : { common: { yes: 'Yes', no: 'No' } };
const ptBRTranslations
  = process.env.NODE_ENV !== 'lint'
    ? require('./locales/pt-BR.json')
    : { common: { yes: 'Sim', no: 'Não' } };
/* eslint-enable ts/no-require-imports */

/**
 * Detecta o idioma do sistema
 * Retorna 'pt-BR' ou 'en' baseado na variável de ambiente LANG
 */
function detectLanguage(): string {
  const lang = process.env.LANG || process.env.LANGUAGE || 'en_US';

  // Mapeia common locales para nossos idiomas suportados
  if (lang.startsWith('pt')) {
    return 'pt-BR';
  }

  return 'en';
}

// Load translations from JSON files (lazy loaded)
let cachedTranslations: {
  en: Record<string, unknown>;
  ptBR: Record<string, unknown>;
} | null = null;

function loadTranslations() {
  if (cachedTranslations) {
    return cachedTranslations;
  }

  // Skip file system access during static analysis/linting
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'lint') {
    cachedTranslations = {
      en: { common: { yes: 'Yes', no: 'No' } },
      ptBR: { common: { yes: 'Sim', no: 'Não' } },
    };
    return cachedTranslations;
  }

  try {
    cachedTranslations = { en: enTranslations, ptBR: ptBRTranslations };
    return cachedTranslations;
  } catch (error) {
    console.error('Error loading translation files:', error);
    cachedTranslations = {
      en: { common: { yes: 'Yes', no: 'No' } },
      ptBR: { common: { yes: 'Sim', no: 'Não' } },
    };
    return cachedTranslations;
  }
}

// Inicializa i18next
const translations = loadTranslations();

i18next.init({
  lng: detectLanguage(),
  fallbackLng: 'en',
  resources: {
    'pt-BR': {
      translation: translations.ptBR,
    },
    'en': {
      translation: translations.en,
    },
  },
  interpolation: {
    escapeValue: false, // React já faz escape, não precisamos aqui
  },
});

/**
 * Função helper para tradução
 * @param key - Chave da tradução (ex: 'auth.notAuthenticated')
 * @param options - Opções de interpolação (ex: { name: 'João' })
 */
export function t(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options);
}

/**
 * Muda o idioma da aplicação
 * @param language - Código do idioma ('pt-BR' ou 'en')
 */
export function changeLanguage(language: 'pt-BR' | 'en'): void {
  i18next.changeLanguage(language);
}

/**
 * Retorna o idioma atual
 */
export function getCurrentLanguage(): string {
  return i18next.language;
}

export default i18next;
