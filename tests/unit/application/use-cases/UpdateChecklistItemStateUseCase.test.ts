import { UpdateChecklistItemStateUseCase } from '@application/use-cases';
import { changeLanguage } from '@i18n';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('UpdateChecklistItemStateUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: UpdateChecklistItemStateUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new UpdateChecklistItemStateUseCase(mockTrelloRepo);
    changeLanguage('pt-BR');
  });

  describe('execute', () => {
    test('should mark item as complete', async () => {
      const item = await useCase.execute('card1', 'item1', 'complete');

      expect(item.state).toBe('complete');
      expect(item.id).toBe('item1');
    });

    test('should mark item as incomplete', async () => {
      const item = await useCase.execute('card1', 'item1', 'incomplete');

      expect(item.state).toBe('incomplete');
      expect(item.id).toBe('item1');
    });

    test('should call repository with correct args for complete', async () => {
      let calledCard: string | undefined;
      let calledItem: string | undefined;
      let calledState: string | undefined;
      const { ChecklistItemEntity } = await import('@domain/entities');
      mockTrelloRepo.updateChecklistItemState = async (cardId: string, itemId: string, state: 'complete' | 'incomplete') => {
        calledCard = cardId;
        calledItem = itemId;
        calledState = state;
        return new ChecklistItemEntity(itemId, 'Test Item', state, 'cl1');
      };

      await useCase.execute('c1', 'i1', 'complete');
      expect(calledCard).toBe('c1');
      expect(calledItem).toBe('i1');
      expect(calledState).toBe('complete');
    });

    test('should call repository with correct args for incomplete', async () => {
      let calledState: string | undefined;
      const { ChecklistItemEntity } = await import('@domain/entities');
      mockTrelloRepo.updateChecklistItemState = async (cardId: string, itemId: string, state: 'complete' | 'incomplete') => {
        calledState = state;
        return new ChecklistItemEntity(itemId, 'Test Item', state, 'cl1');
      };

      await useCase.execute('c1', 'i1', 'incomplete');
      expect(calledState).toBe('incomplete');
    });

    test('should return the updated item from repository', async () => {
      const { ChecklistItemEntity } = await import('@domain/entities');
      mockTrelloRepo.updateChecklistItemState = async (_cardId: string, itemId: string, state: 'complete' | 'incomplete') => {
        return new ChecklistItemEntity(itemId, 'My Task', state, 'checklist-abc');
      };

      const item = await useCase.execute('card1', 'item42', 'complete');
      expect(item.name).toBe('My Task');
      expect(item.idChecklist).toBe('checklist-abc');
      expect(item.state).toBe('complete');
    });
  });
});
