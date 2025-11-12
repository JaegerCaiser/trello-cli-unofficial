import i18next from 'i18next';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

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

// Inicializa i18next
i18next.init({
  lng: detectLanguage(),
  fallbackLng: 'en',
  resources: {
    'pt-BR': {
      translation: ptBR,
    },
    'en': {
      translation: en,
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
