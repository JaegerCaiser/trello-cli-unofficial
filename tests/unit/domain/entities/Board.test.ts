import { BoardEntity } from '@domain/entities';
import { TestData } from '@tests/helpers';
import { describe, expect, test } from 'bun:test';

describe('BoardEntity', () => {
  describe('constructor', () => {
    test('should create a board with all properties', () => {
      const board = new BoardEntity(
        'board1',
        'Test Board',
        'https://trello.com/b/board1',
      );

      expect(board.id).toBe('board1');
      expect(board.name).toBe('Test Board');
      expect(board.url).toBe('https://trello.com/b/board1');
    });

    test('should have readonly properties', () => {
      const board = new BoardEntity(
        'board1',
        'Test Board',
        'https://trello.com/b/board1',
      );

      // Properties should be readonly (TypeScript enforces this at compile time)
      expect(board).toHaveProperty('id');
      expect(board).toHaveProperty('name');
      expect(board).toHaveProperty('url');
    });
  });

  describe('fromApiResponse', () => {
    test('should create board from API response', () => {
      const apiResponse = TestData.apiResponses.board;
      const board = BoardEntity.fromApiResponse(apiResponse);

      expect(board.id).toBe(apiResponse.id);
      expect(board.name).toBe(apiResponse.name);
      expect(board.url).toBe(apiResponse.url);
    });

    test('should handle API response with extra fields', () => {
      const apiResponse = {
        ...TestData.apiResponses.board,
        extraField: 'should be ignored',
        closed: false,
      };

      const board = BoardEntity.fromApiResponse(apiResponse);

      expect(board.id).toBe(apiResponse.id);
      expect(board.name).toBe(apiResponse.name);
      expect(board.url).toBe(apiResponse.url);
    });
  });
});
