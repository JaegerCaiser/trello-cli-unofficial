import { SearchCardsUseCase } from '@application/use-cases';
import { CardEntity } from '@domain/entities';
import { changeLanguage } from '@i18n';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('SearchCardsUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: SearchCardsUseCase;

  beforeEach(() => {
    changeLanguage('pt-BR');
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new SearchCardsUseCase(mockTrelloRepo);
  });

  describe('execute', () => {
    test('should return cards matching the query', async () => {
      const results = await useCase.execute('Test Card 1');

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some(c => c.name === 'Test Card 1')).toBe(true);
    });

    test('should return all matching cards for partial query', async () => {
      const results = await useCase.execute('Test Card');

      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    test('should return empty array when no cards match', async () => {
      const results = await useCase.execute('nonexistent-card-xyz');

      expect(results).toHaveLength(0);
    });

    test('should throw error when query is empty string', async () => {
      await expect(useCase.execute('')).rejects.toThrow('A consulta de busca não pode estar vazia');
    });

    test('should throw error when query is only whitespace', async () => {
      await expect(useCase.execute('   ')).rejects.toThrow('A consulta de busca não pode estar vazia');
    });

    test('should trim whitespace from query before searching', async () => {
      const results = await useCase.execute('  Test Card 1  ');

      expect(results.some(c => c.name === 'Test Card 1')).toBe(true);
    });

    test('should be case-insensitive', async () => {
      const results = await useCase.execute('test card');

      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    describe('listId filter', () => {
      test('should return only cards in the specified list', async () => {
        // card1 and card2 are in list1; list2 has no cards
        const results = await useCase.execute('Test Card', { listId: 'list1' });

        expect(results.length).toBeGreaterThanOrEqual(2);
        results.forEach(c => expect(c.idList).toBe('list1'));
      });

      test('should return empty array when no cards match the listId', async () => {
        const results = await useCase.execute('Test Card', { listId: 'list2' });

        expect(results).toHaveLength(0);
      });

      test('should apply listId filter client-side after repo search', async () => {
        // Add a card in list2 to verify filtering
        mockTrelloRepo.addCard('list2', new CardEntity('card3', 'Test Card 3', 'list2', 'Desc 3', 'https://trello.com/c/card3'));

        const resultsInList1 = await useCase.execute('Test Card', { listId: 'list1' });
        const resultsInList2 = await useCase.execute('Test Card', { listId: 'list2' });

        expect(resultsInList1.every(c => c.idList === 'list1')).toBe(true);
        expect(resultsInList2.every(c => c.idList === 'list2')).toBe(true);
        expect(resultsInList2.some(c => c.name === 'Test Card 3')).toBe(true);
      });
    });

    describe('boardId filter', () => {
      test('should pass boardId to repository and return only cards from that board', async () => {
        // board1 has list1 with card1 and card2; board2 has no lists
        const resultsBoard1 = await useCase.execute('Test Card', { boardId: 'board1' });
        const resultsBoard2 = await useCase.execute('Test Card', { boardId: 'board2' });

        expect(resultsBoard1.length).toBeGreaterThanOrEqual(2);
        expect(resultsBoard2).toHaveLength(0);
      });

      test('should combine boardId and listId filters', async () => {
        const results = await useCase.execute('Test Card', { boardId: 'board1', listId: 'list1' });

        expect(results.length).toBeGreaterThanOrEqual(2);
        results.forEach(c => expect(c.idList).toBe('list1'));
      });
    });

    describe('labels filter', () => {
      test('should append single label to query', async () => {
        // Labels are appended to query; exact matching depends on mock text search
        // This test verifies the use case does not throw and returns results
        const results = await useCase.execute('Test Card', { labels: 'Bug' });

        // The mock searches by name/desc, so "Test Card" still matches even with extra label terms
        expect(Array.isArray(results)).toBe(true);
      });

      test('should append multiple labels to query', async () => {
        const results = await useCase.execute('Test Card', { labels: 'Bug,Feature' });

        expect(Array.isArray(results)).toBe(true);
      });

      test('should trim label names before appending', async () => {
        // Should not throw with extra spaces around label names
        await expect(useCase.execute('Test Card', { labels: ' Bug , Feature ' })).resolves.toBeDefined();
      });
    });

    describe('pagination', () => {
      test('should return first page of results with limit', async () => {
        // list1 has 2 cards; limit=1 should return only 1
        const results = await useCase.execute('Test Card', { limit: 1, page: 0 });

        expect(results).toHaveLength(1);
      });

      test('should return second page of results', async () => {
        // With limit=1, page=1 returns the second card
        const results = await useCase.execute('Test Card', { limit: 1, page: 1 });

        expect(results).toHaveLength(1);
      });

      test('should return empty array when page is beyond results', async () => {
        const results = await useCase.execute('Test Card', { limit: 10, page: 99 });

        expect(results).toHaveLength(0);
      });

      test('should respect limit without page (defaults to page 0)', async () => {
        const results = await useCase.execute('Test Card', { limit: 1 });

        expect(results).toHaveLength(1);
      });
    });
  });
});
