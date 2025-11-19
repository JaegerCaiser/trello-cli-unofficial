import { GetBoardDetailsUseCase } from '@application/use-cases';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('GetBoardDetailsUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: GetBoardDetailsUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new GetBoardDetailsUseCase(mockTrelloRepo);
  });

  describe('execute', () => {
    test('should return board details with members and labels', async () => {
      const boardId = 'board1';
      const details = await useCase.execute(boardId);

      expect(details.board.id).toBe(boardId);
      expect(details.board.name).toBe('Test Board 1');
      expect(details.lists).toHaveLength(3);
      expect(details.members).toBeDefined();
      expect(details.members).toHaveLength(2);
      expect(details.labels).toBeDefined();
      expect(details.labels).toHaveLength(3);
      expect(details.totalLists).toBe(3);
      expect(details.totalCards).toBe(2); // Only list1 has cards in the mock
    });

    test('should throw error for non-existent board', async () => {
      const boardId = 'non-existent-board';

      await expect(useCase.execute(boardId)).rejects.toThrow(
        'Quadro com ID "non-existent-board" não encontrado',
      );
    });

    test('should return correct total cards count', async () => {
      const boardId = 'board1';
      const details = await useCase.execute(boardId);

      expect(details.totalCards).toBe(2);
    });
  });
});
