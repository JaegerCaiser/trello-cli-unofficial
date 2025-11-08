import { GetListsUseCase } from '@application/use-cases';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('GetListsUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: GetListsUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new GetListsUseCase(mockTrelloRepo);
  });

  describe('execute', () => {
    test('should return all lists for a board', async () => {
      const lists = await useCase.execute('board1');

      expect(lists).toHaveLength(3);
      expect(lists[0]?.name).toBe('To Do');
      expect(lists[1]?.name).toBe('In Progress');
      expect(lists[2]?.name).toBe('Done');
    });

    test('should return empty array when board has no lists', async () => {
      const lists = await useCase.execute('nonexistent-board');

      expect(lists).toHaveLength(0);
    });

    test('should return lists with correct properties', async () => {
      const lists = await useCase.execute('board1');

      expect(lists[0]?.id).toBe('list1');
      expect(lists[0]?.name).toBe('To Do');
      expect(lists[1]?.id).toBe('list2');
      expect(lists[1]?.name).toBe('In Progress');
    });
  });
});
