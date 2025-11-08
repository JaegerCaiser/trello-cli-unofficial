import { MoveCardUseCase } from '@application/use-cases';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('MoveCardUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: MoveCardUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new MoveCardUseCase(mockTrelloRepo);
  });

  describe('execute', () => {
    test('should move card to different list', async () => {
      const movedCard = await useCase.execute('card1', 'list2');

      expect(movedCard.id).toBe('card1');
      expect(movedCard.name).toBe('Test Card 1');
      expect(movedCard.idList).toBe('list2');
    });

    test('should return updated card with correct properties', async () => {
      const movedCard = await useCase.execute('card1', 'list3');

      expect(movedCard.id).toBe('card1');
      expect(movedCard.name).toBe('Test Card 1');
      expect(movedCard.desc).toBe('Description 1');
      expect(movedCard.url).toBe('https://trello.com/c/card1');
      expect(movedCard.idList).toBe('list3');
    });

    test('should throw error for non-existent card', async () => {
      await expect(
        useCase.execute('nonexistent-card', 'list2'),
      ).rejects.toThrow('Card not found');
    });
  });
});
