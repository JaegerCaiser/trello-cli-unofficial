import { AddChecklistItemUseCase } from '@application/use-cases';
import { changeLanguage } from '@i18n';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('AddChecklistItemUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: AddChecklistItemUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new AddChecklistItemUseCase(mockTrelloRepo);
    changeLanguage('pt-BR');
  });

  describe('execute', () => {
    test('should add item with valid data', async () => {
      const item = await useCase.execute('checklist1', 'Atualizar README');

      expect(item.name).toBe('Atualizar README');
      expect(item.idChecklist).toBe('checklist1');
      expect(item.id).toBeDefined();
      expect(item.state).toBe('incomplete');
    });

    test('should throw error for empty item name', async () => {
      await expect(useCase.execute('checklist1', '')).rejects.toThrow(
        'Nome do item é obrigatório',
      );
    });

    test('should throw error for whitespace-only item name', async () => {
      await expect(useCase.execute('checklist1', '   ')).rejects.toThrow(
        'Nome do item é obrigatório',
      );
    });

    test('should accept item name with leading/trailing spaces', async () => {
      const item = await useCase.execute('checklist1', '  Valid Item  ');

      expect(item.name).toBe('  Valid Item  ');
    });

    test('should add item to any checklist id', async () => {
      const item = await useCase.execute('any-checklist-id', 'My Item');

      expect(item.idChecklist).toBe('any-checklist-id');
      expect(item.name).toBe('My Item');
    });

    test('should default item state to incomplete', async () => {
      const item = await useCase.execute('checklist1', 'New Task');

      expect(item.state).toBe('incomplete');
    });
  });
});
