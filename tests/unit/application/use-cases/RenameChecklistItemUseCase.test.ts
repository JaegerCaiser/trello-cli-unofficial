import { RenameChecklistItemUseCase } from '@application/use-cases';
import { changeLanguage } from '@i18n';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('RenameChecklistItemUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: RenameChecklistItemUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new RenameChecklistItemUseCase(mockTrelloRepo);
    changeLanguage('pt-BR');
  });

  describe('execute', () => {
    test('should rename item with valid name', async () => {
      const item = await useCase.execute('card1', 'item1', 'Novo Nome do Item');

      expect(item.name).toBe('Novo Nome do Item');
      expect(item.id).toBe('item1');
    });

    test('should throw error for empty name', async () => {
      await expect(useCase.execute('card1', 'item1', '')).rejects.toThrow(
        'Nome do item é obrigatório',
      );
    });

    test('should throw error for whitespace-only name', async () => {
      await expect(useCase.execute('card1', 'item1', '   ')).rejects.toThrow(
        'Nome do item é obrigatório',
      );
    });

    test('should accept name with leading/trailing spaces', async () => {
      const item = await useCase.execute('card1', 'item1', '  Valid Item  ');
      expect(item.name).toBe('  Valid Item  ');
    });

    test('should call repository renameChecklistItem with correct args', async () => {
      let calledCard: string | undefined;
      let calledItem: string | undefined;
      let calledName: string | undefined;
      const { ChecklistItemEntity } = await import('@domain/entities');
      mockTrelloRepo.renameChecklistItem = async (cardId: string, itemId: string, name: string) => {
        calledCard = cardId;
        calledItem = itemId;
        calledName = name;
        return new ChecklistItemEntity(itemId, name, 'incomplete', 'cl1');
      };

      await useCase.execute('c1', 'i1', 'Updated');
      expect(calledCard).toBe('c1');
      expect(calledItem).toBe('i1');
      expect(calledName).toBe('Updated');
    });

    test('should preserve item state as incomplete by default', async () => {
      const item = await useCase.execute('card1', 'item1', 'New Name');
      expect(item.state).toBe('incomplete');
    });
  });
});
