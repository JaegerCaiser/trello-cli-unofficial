import { UpdateCardUseCase } from '@application/use-cases';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('UpdateCardUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: UpdateCardUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new UpdateCardUseCase(mockTrelloRepo);
  });

  describe('execute', () => {
    test('should update card name', async () => {
      const card = await useCase.execute('card1', { name: 'Updated Name' });

      expect(card.name).toBe('Updated Name');
    });

    test('should update card description', async () => {
      const card = await useCase.execute('card1', {
        desc: 'Updated Description',
      });

      expect(card.desc).toBe('Updated Description');
    });

    test('should move card to different list', async () => {
      const card = await useCase.execute('card1', { idList: 'list2' });

      expect(card.idList).toBe('list2');
    });

    test('should throw error for empty card name', async () => {
      await expect(useCase.execute('card1', { name: '' })).rejects.toThrow(
        'Nome do cartão não pode estar vazio',
      );
    });

    test('should throw error for whitespace-only card name', async () => {
      await expect(useCase.execute('card1', { name: '   ' })).rejects.toThrow(
        'Nome do cartão não pode estar vazio',
      );
    });

    test('should allow updating description to empty string', async () => {
      const card = await useCase.execute('card1', { desc: '' });

      expect(card.desc).toBe('');
    });

    test('should update multiple fields at once', async () => {
      const card = await useCase.execute('card1', {
        name: 'New Name',
        desc: 'New Description',
        idList: 'list2',
      });

      expect(card.name).toBe('New Name');
      expect(card.desc).toBe('New Description');
      expect(card.idList).toBe('list2');
    });

    test('should throw error for non-existent card', async () => {
      await expect(
        useCase.execute('non-existent-card', { name: 'New Name' }),
      ).rejects.toThrow('Card not found');
    });
  });
});
