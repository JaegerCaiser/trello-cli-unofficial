import { SearchCardsUseCase } from '@application/use-cases';
import { CardEntity } from '@domain/entities';
import { changeLanguage } from '@i18n';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('Card Search Integration', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let searchCardsUseCase: SearchCardsUseCase;

  beforeEach(() => {
    changeLanguage('pt-BR');
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    // Add cards in list2/list3 to support cross-list search tests
    mockTrelloRepo.addCard('list2', new CardEntity('card3', 'In Progress Card', 'list2', 'Working on it', 'https://trello.com/c/card3'));
    mockTrelloRepo.addCard('list3', new CardEntity('card4', 'Done Card', 'list3', 'Completed task', 'https://trello.com/c/card4'));

    searchCardsUseCase = new SearchCardsUseCase(mockTrelloRepo);
  });

  describe('full search flow', () => {
    test('should search across all lists and return matching cards', async () => {
      const results = await searchCardsUseCase.execute('Card');

      // Should find cards in list1 (card1, card2), list2 (card3), and list3 (card4)
      expect(results.length).toBeGreaterThanOrEqual(4);
    });

    test('should return empty array for query with no matches', async () => {
      const results = await searchCardsUseCase.execute('xyz-no-match-anywhere');

      expect(results).toHaveLength(0);
    });

    test('should match on card description as well as name', async () => {
      const results = await searchCardsUseCase.execute('Completed task');

      expect(results.some(c => c.id === 'card4')).toBe(true);
    });
  });

  describe('listId filtering end-to-end', () => {
    test('should return only cards from the specified list', async () => {
      const results = await searchCardsUseCase.execute('Card', { listId: 'list2' });

      expect(results).toHaveLength(1);
      expect(results[0]!.id).toBe('card3');
      expect(results[0]!.idList).toBe('list2');
    });

    test('should return empty when query matches but listId has no matching cards', async () => {
      const results = await searchCardsUseCase.execute('Test Card', { listId: 'list3' });

      expect(results).toHaveLength(0);
    });

    test('should correctly isolate cards between two lists', async () => {
      const list1Results = await searchCardsUseCase.execute('Card', { listId: 'list1' });
      const list2Results = await searchCardsUseCase.execute('Card', { listId: 'list2' });

      const list1Ids = list1Results.map(c => c.id);
      const list2Ids = list2Results.map(c => c.id);

      // No overlap between lists
      const overlap = list1Ids.filter(id => list2Ids.includes(id));
      expect(overlap).toHaveLength(0);
    });
  });

  describe('boardId filtering end-to-end', () => {
    test('should only return cards from lists belonging to the specified board', async () => {
      // board1 owns list1, list2, list3 — all mock cards are in board1
      const results = await searchCardsUseCase.execute('Card', { boardId: 'board1' });

      expect(results.length).toBeGreaterThanOrEqual(4);
      // All returned cards must be in board1 lists (list1, list2, list3)
      const validListIds = new Set(['list1', 'list2', 'list3']);
      results.forEach(c => expect(validListIds.has(c.idList)).toBe(true));
    });

    test('should return empty array for board with no matching cards', async () => {
      // board2 has no lists set up in mock data
      const results = await searchCardsUseCase.execute('Card', { boardId: 'board2' });

      expect(results).toHaveLength(0);
    });

    test('should combine boardId and listId filters', async () => {
      const results = await searchCardsUseCase.execute('Card', { boardId: 'board1', listId: 'list3' });

      expect(results).toHaveLength(1);
      expect(results[0]!.id).toBe('card4');
    });
  });

  describe('pagination end-to-end', () => {
    test('should return first page of results', async () => {
      // 4 total cards matching "Card", limit=2 → page 0 returns first 2
      const results = await searchCardsUseCase.execute('Card', { limit: 2, page: 0 });

      expect(results).toHaveLength(2);
    });

    test('should return second page of results', async () => {
      // 4 total cards matching "Card", limit=2 → page 1 returns next 2
      const results = await searchCardsUseCase.execute('Card', { limit: 2, page: 1 });

      expect(results).toHaveLength(2);
    });

    test('should return empty array when page exceeds total results', async () => {
      const results = await searchCardsUseCase.execute('Card', { limit: 10, page: 5 });

      expect(results).toHaveLength(0);
    });

    test('page 0 and page 1 should return different cards', async () => {
      const page0 = await searchCardsUseCase.execute('Card', { limit: 2, page: 0 });
      const page1 = await searchCardsUseCase.execute('Card', { limit: 2, page: 1 });

      const page0Ids = page0.map(c => c.id);
      const page1Ids = page1.map(c => c.id);
      const overlap = page0Ids.filter(id => page1Ids.includes(id));

      expect(overlap).toHaveLength(0);
    });

    test('should combine pagination with boardId filter', async () => {
      const results = await searchCardsUseCase.execute('Card', { boardId: 'board1', limit: 2, page: 0 });

      expect(results).toHaveLength(2);
      const validListIds = new Set(['list1', 'list2', 'list3']);
      results.forEach(c => expect(validListIds.has(c.idList)).toBe(true));
    });
  });
});
