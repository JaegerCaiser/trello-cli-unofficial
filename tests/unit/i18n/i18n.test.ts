import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { changeLanguage, getCurrentLanguage, t } from '@/i18n';
import enTranslations from '@/i18n/locales/en.json';
import ptBRTranslations from '@/i18n/locales/pt-BR.json';

describe('i18n', () => {
  // Store original LANG to restore after tests
  const originalLang = process.env.LANG;

  beforeEach(() => {
    // Reset to default (pt-BR) before each test
    changeLanguage('pt-BR');
  });

  afterEach(() => {
    // Restore original LANG
    process.env.LANG = originalLang;
  });

  describe('Translation Function', () => {
    test('should translate simple keys in pt-BR', () => {
      changeLanguage('pt-BR');
      expect(t('common.yes')).toBe('Sim');
      expect(t('common.no')).toBe('Não');
      expect(t('menu.goodbye')).toBe('👋 Até logo!');
    });

    test('should translate simple keys in en', () => {
      changeLanguage('en');
      expect(t('common.yes')).toBe('Yes');
      expect(t('common.no')).toBe('No');
      expect(t('menu.goodbye')).toBe('👋 Goodbye!');
    });

    test('should handle interpolation in pt-BR', () => {
      changeLanguage('pt-BR');
      const result = t('board.notFound', { name: 'Test Board' });
      expect(result).toBe('❌ Quadro "Test Board" não encontrado');
    });

    test('should handle interpolation in en', () => {
      changeLanguage('en');
      const result = t('board.notFound', { name: 'Test Board' });
      expect(result).toBe('❌ Board "Test Board" not found');
    });

    test('should handle multiple interpolations', () => {
      changeLanguage('pt-BR');
      const result = t('list.notFound', {
        listName: 'My List',
        boardName: 'My Board',
      });
      expect(result).toBe(
        '❌ Lista "My List" não encontrada no quadro "My Board"',
      );
    });

    test('should return key if translation not found', () => {
      const result = t('nonexistent.key' as any);
      expect(result).toBe('nonexistent.key');
    });
  });

  describe('Language Switching', () => {
    test('should switch from pt-BR to en', () => {
      changeLanguage('pt-BR');
      expect(t('common.yes')).toBe('Sim');

      changeLanguage('en');
      expect(t('common.yes')).toBe('Yes');
    });

    test('should switch from en to pt-BR', () => {
      changeLanguage('en');
      expect(t('common.no')).toBe('No');

      changeLanguage('pt-BR');
      expect(t('common.no')).toBe('Não');
    });

    test('should return current language', () => {
      changeLanguage('pt-BR');
      expect(getCurrentLanguage()).toBe('pt-BR');

      changeLanguage('en');
      expect(getCurrentLanguage()).toBe('en');
    });
  });

  describe('Translation Coverage', () => {
    test('should have auth translations in both languages', () => {
      changeLanguage('pt-BR');
      expect(t('auth.notAuthenticated')).toContain('não está autenticado');
      expect(t('auth.tokenSaved')).toContain('sucesso');

      changeLanguage('en');
      expect(t('auth.notAuthenticated')).toContain('not authenticated');
      expect(t('auth.tokenSaved')).toContain('success');
    });

    test('should have menu translations in both languages', () => {
      changeLanguage('pt-BR');
      expect(t('menu.title')).toContain('Menu Principal');
      expect(t('menu.boards')).toContain('quadros');
      expect(t('menu.config')).toContain('Configurações');

      changeLanguage('en');
      expect(t('menu.title')).toContain('Main Menu');
      expect(t('menu.boards')).toContain('boards');
      expect(t('menu.config')).toContain('Settings');
    });

    test('should have board translations in both languages', () => {
      changeLanguage('pt-BR');
      expect(t('board.yourBoards')).toContain('Seus Quadros');

      changeLanguage('en');
      expect(t('board.yourBoards')).toContain('Your Trello Boards');
    });

    test('should have card translations in both languages', () => {
      changeLanguage('pt-BR');
      expect(t('card.created')).toContain('criado com sucesso');
      expect(t('card.emptyList')).toContain('vazia');

      changeLanguage('en');
      expect(t('card.created')).toContain('created successfully');
      expect(t('card.emptyList')).toContain('empty');
    });

    test('should have error translations in both languages', () => {
      changeLanguage('pt-BR');
      expect(t('errors.generic')).toContain('Erro');

      changeLanguage('en');
      expect(t('errors.generic')).toContain('Error');
    });

    test('should have complete translation coverage between languages', () => {
      // Helper function to get all keys from nested object
      const getAllKeys = (obj: any, prefix = ''): string[] => {
        const keys: string[] = [];
        for (const key in obj) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys.push(...getAllKeys(obj[key], fullKey));
          } else {
            keys.push(fullKey);
          }
        }
        return keys;
      };

      const ptBRKeys = getAllKeys(ptBRTranslations);
      const enKeys = getAllKeys(enTranslations);

      // Check that all Portuguese keys exist in English
      for (const key of ptBRKeys) {
        expect(enKeys).toContain(key);
      }

      // Check that all English keys exist in Portuguese
      for (const key of enKeys) {
        expect(ptBRKeys).toContain(key);
      }

      // Verify counts match
      expect(ptBRKeys.length).toBe(enKeys.length);
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined interpolation values', () => {
      changeLanguage('pt-BR');
      const result = t('board.notFound', { name: undefined } as any);
      // i18next handles undefined by showing the key
      expect(result).toContain('não encontrado');
    });

    test('should handle empty interpolation values', () => {
      changeLanguage('pt-BR');
      const result = t('board.notFound', { name: '' });
      expect(result).toBe('❌ Quadro "" não encontrado');
    });

    test('should handle special characters in interpolation', () => {
      changeLanguage('pt-BR');
      const result = t('board.notFound', { name: 'Test & <Board>' });
      expect(result).toBe('❌ Quadro "Test & <Board>" não encontrado');
    });
  });

  describe('Nested Translation Keys', () => {
    test('should access nested keys correctly', () => {
      changeLanguage('pt-BR');
      expect(t('card.actions.create')).toContain('Criar');
      expect(t('card.actions.edit')).toContain('Editar');
      expect(t('card.actions.delete')).toContain('Deletar');
    });

    test('should access nested keys in different languages', () => {
      changeLanguage('en');
      expect(t('card.actions.create')).toContain('Create');
      expect(t('card.actions.edit')).toContain('Edit');
      expect(t('card.actions.delete')).toContain('Delete');
    });
  });
});
