import { CreateChecklistUseCase } from '@application/use-cases';
import { changeLanguage } from '@i18n';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('CreateChecklistUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: CreateChecklistUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new CreateChecklistUseCase(mockTrelloRepo);
    changeLanguage('pt-BR');
  });

  describe('execute', () => {
    test('should create checklist with valid data', async () => {
      const checklist = await useCase.execute('card1', 'Critérios de Aceite');

      expect(checklist.name).toBe('Critérios de Aceite');
      expect(checklist.idCard).toBe('card1');
      expect(checklist.id).toBeDefined();
      expect(checklist.checkItems).toEqual([]);
    });

    test('should throw error for empty checklist name', async () => {
      await expect(useCase.execute('card1', '')).rejects.toThrow(
        'Nome do checklist é obrigatório',
      );
    });

    test('should throw error for whitespace-only checklist name', async () => {
      await expect(useCase.execute('card1', '   ')).rejects.toThrow(
        'Nome do checklist é obrigatório',
      );
    });

    test('should accept checklist name with leading/trailing spaces', async () => {
      const checklist = await useCase.execute('card1', '  Valid Checklist  ');

      expect(checklist.name).toBe('  Valid Checklist  ');
    });

    test('should create checklist for any card id', async () => {
      const checklist = await useCase.execute('any-card-id', 'My Checklist');

      expect(checklist.idCard).toBe('any-card-id');
      expect(checklist.name).toBe('My Checklist');
    });
  });
});
