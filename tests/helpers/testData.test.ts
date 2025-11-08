import { describe, expect, test } from 'bun:test';
import { createMockBoard, createMockCard, createMockList, TestData } from './testData';

describe('TestData', () => {
  describe('TestData object', () => {
    test('should have boards with correct properties', () => {
      expect(TestData.boards.board1.id).toBe('board1');
      expect(TestData.boards.board1.name).toBe('Test Board 1');
      expect(TestData.boards.board1.url).toBe('https://trello.com/b/board1');

      expect(TestData.boards.board2.id).toBe('board2');
      expect(TestData.boards.board2.name).toBe('Test Board 2');
      expect(TestData.boards.board2.url).toBe('https://trello.com/b/board2');
    });

    test('should have lists with correct properties', () => {
      expect(TestData.lists.toDo.id).toBe('list1');
      expect(TestData.lists.toDo.name).toBe('To Do');

      expect(TestData.lists.inProgress.id).toBe('list2');
      expect(TestData.lists.inProgress.name).toBe('In Progress');

      expect(TestData.lists.done.id).toBe('list3');
      expect(TestData.lists.done.name).toBe('Done');
    });

    test('should have cards with correct properties', () => {
      expect(TestData.cards.card1.id).toBe('card1');
      expect(TestData.cards.card1.name).toBe('Test Card 1');
      expect(TestData.cards.card1.idList).toBe('list1');
      expect(TestData.cards.card1.desc).toBe('Description 1');
      expect(TestData.cards.card1.url).toBe('https://trello.com/c/card1');

      expect(TestData.cards.card2.id).toBe('card2');
      expect(TestData.cards.card2.name).toBe('Test Card 2');
      expect(TestData.cards.card2.idList).toBe('list1');
      expect(TestData.cards.card2.desc).toBe('Description 2');
      expect(TestData.cards.card2.url).toBe('https://trello.com/c/card2');
    });

    test('should have configs with correct properties', () => {
      expect(TestData.configs.default.apiKey).toBe('630a01228b85df706aa520f3611e6490');
      expect(TestData.configs.default.hasValidToken()).toBe(false);

      expect(TestData.configs.withToken.apiKey).toBe('630a01228b85df706aa520f3611e6490');
      expect(TestData.configs.withToken.hasValidToken()).toBe(true);

      expect(TestData.configs.withInvalidToken.apiKey).toBe('630a01228b85df706aa520f3611e6490');
      expect(TestData.configs.withInvalidToken.hasValidToken()).toBe(false);
    });

    test('should have API response templates', () => {
      expect(TestData.apiResponses.board.id).toBe('board1');
      expect(TestData.apiResponses.board.name).toBe('Test Board');
      expect(TestData.apiResponses.board.url).toBe('https://trello.com/b/board1');

      expect(TestData.apiResponses.list.id).toBe('list1');
      expect(TestData.apiResponses.list.name).toBe('To Do');

      expect(TestData.apiResponses.card.id).toBe('card1');
      expect(TestData.apiResponses.card.name).toBe('Test Card');
      expect(TestData.apiResponses.card.desc).toBe('Test Description');
      expect(TestData.apiResponses.card.idList).toBe('list1');
      expect(TestData.apiResponses.card.url).toBe('https://trello.com/c/card1');
    });
  });

  describe('createMockBoard', () => {
    test('should create board with default values', () => {
      const board = createMockBoard();

      expect(board.id).toBe('test-board-id');
      expect(board.name).toBe('Test Board');
      expect(board.url).toBe('https://trello.com/b/test');
    });

    test('should create board with custom values', () => {
      const board = createMockBoard({
        id: 'custom-id',
        name: 'Custom Board',
        url: 'https://trello.com/b/custom',
      });

      expect(board.id).toBe('custom-id');
      expect(board.name).toBe('Custom Board');
      expect(board.url).toBe('https://trello.com/b/custom');
    });

    test('should create board with partial overrides', () => {
      const board = createMockBoard({
        name: 'Partial Override',
      });

      expect(board.id).toBe('test-board-id');
      expect(board.name).toBe('Partial Override');
      expect(board.url).toBe('https://trello.com/b/test');
    });
  });

  describe('createMockList', () => {
    test('should create list with default values', () => {
      const list = createMockList();

      expect(list.id).toBe('test-list-id');
      expect(list.name).toBe('Test List');
    });

    test('should create list with custom values', () => {
      const list = createMockList({
        id: 'custom-list-id',
        name: 'Custom List',
      });

      expect(list.id).toBe('custom-list-id');
      expect(list.name).toBe('Custom List');
    });

    test('should create list with partial overrides', () => {
      const list = createMockList({
        name: 'Partial List',
      });

      expect(list.id).toBe('test-list-id');
      expect(list.name).toBe('Partial List');
    });
  });

  describe('createMockCard', () => {
    test('should create card with default values', () => {
      const card = createMockCard();

      expect(card.id).toBe('test-card-id');
      expect(card.name).toBe('Test Card');
      expect(card.idList).toBe('test-list-id');
      expect(card.desc).toBe('Test Description');
      expect(card.url).toBe('https://trello.com/c/test');
    });

    test('should create card with custom values', () => {
      const card = createMockCard({
        id: 'custom-card-id',
        name: 'Custom Card',
        idList: 'custom-list-id',
        desc: 'Custom Description',
        url: 'https://trello.com/c/custom',
      });

      expect(card.id).toBe('custom-card-id');
      expect(card.name).toBe('Custom Card');
      expect(card.idList).toBe('custom-list-id');
      expect(card.desc).toBe('Custom Description');
      expect(card.url).toBe('https://trello.com/c/custom');
    });

    test('should create card with partial overrides', () => {
      const card = createMockCard({
        name: 'Partial Card',
        desc: 'Partial Description',
      });

      expect(card.id).toBe('test-card-id');
      expect(card.name).toBe('Partial Card');
      expect(card.idList).toBe('test-list-id');
      expect(card.desc).toBe('Partial Description');
      expect(card.url).toBe('https://trello.com/c/test');
    });
  });
});
