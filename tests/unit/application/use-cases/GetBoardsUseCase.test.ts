import { GetBoardsUseCase } from '@application/use-cases';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('GetBoardsUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: GetBoardsUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new GetBoardsUseCase(mockTrelloRepo);
  });

  describe('execute', () => {
    test('should return all boards', async () => {
      const boards = await useCase.execute();

      expect(boards).toHaveLength(2);
      expect(boards[0]?.name).toBe('Test Board 1');
      expect(boards[1]?.name).toBe('Test Board 2');
    });

    test('should return empty array when no boards exist', async () => {
      mockTrelloRepo.reset();
      const boards = await useCase.execute();

      expect(boards).toHaveLength(0);
    });

    test('should return boards with correct properties', async () => {
      const boards = await useCase.execute();

      boards.forEach((board) => {
        expect(board).toHaveProperty('id');
        expect(board).toHaveProperty('name');
        expect(board).toHaveProperty('url');
      });
    });
  });
});
