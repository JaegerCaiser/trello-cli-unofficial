import {
  BoardEntity,
  CardEntity,
  ConfigEntity,
  ListEntity,
} from '@domain/entities';

export const TestData = {
  boards: {
    board1: new BoardEntity(
      'board1',
      'Test Board 1',
      'https://trello.com/b/board1',
    ),
    board2: new BoardEntity(
      'board2',
      'Test Board 2',
      'https://trello.com/b/board2',
    ),
  },

  lists: {
    toDo: new ListEntity('list1', 'To Do'),
    inProgress: new ListEntity('list2', 'In Progress'),
    done: new ListEntity('list3', 'Done'),
  },

  cards: {
    card1: new CardEntity(
      'card1',
      'Test Card 1',
      'list1',
      'Description 1',
      'https://trello.com/c/card1',
    ),
    card2: new CardEntity(
      'card2',
      'Test Card 2',
      'list1',
      'Description 2',
      'https://trello.com/c/card2',
    ),
  },

  configs: {
    default: ConfigEntity.createDefault(),
    withToken: new ConfigEntity(
      '630a01228b85df706aa520f3611e6490',
      'ATTA-test-token-123',
    ),
    withInvalidToken: new ConfigEntity(
      '630a01228b85df706aa520f3611e6490',
      'INVALID',
    ),
  },

  apiResponses: {
    board: {
      id: 'board1',
      name: 'Test Board',
      url: 'https://trello.com/b/board1',
    },
    list: {
      id: 'list1',
      name: 'To Do',
      idBoard: 'board1',
      pos: 1,
    },
    card: {
      id: 'card1',
      name: 'Test Card',
      desc: 'Test Description',
      idList: 'list1',
      pos: 1,
      url: 'https://trello.com/c/card1',
    },
  },
};

export function createMockBoard(overrides?: Partial<BoardEntity>): BoardEntity {
  return new BoardEntity(
    overrides?.id ?? 'test-board-id',
    overrides?.name ?? 'Test Board',
    overrides?.url ?? 'https://trello.com/b/test',
  );
}

export function createMockList(overrides?: Partial<ListEntity>): ListEntity {
  return new ListEntity(
    overrides?.id ?? 'test-list-id',
    overrides?.name ?? 'Test List',
  );
}

export function createMockCard(overrides?: Partial<CardEntity>): CardEntity {
  return new CardEntity(
    overrides?.id ?? 'test-card-id',
    overrides?.name ?? 'Test Card',
    overrides?.idList ?? 'test-list-id',
    overrides?.desc ?? 'Test Description',
    overrides?.url ?? 'https://trello.com/c/test',
  );
}
