import type {
  BoardEntity,
  CardEntity,
  CreateCardData,
  ListEntity,
  UpdateCardData,
} from '@domain/entities';

export interface TrelloRepository {
  getBoards: () => Promise<BoardEntity[]>;
  createBoard: (name: string, description?: string) => Promise<BoardEntity>;
  getLists: (boardId: string) => Promise<ListEntity[]>;
  createList: (boardId: string, name: string) => Promise<ListEntity>;
  deleteList: (listId: string) => Promise<void>;
  moveList: (listId: string, position: number) => Promise<ListEntity>;
  getCards: (listId: string) => Promise<CardEntity[]>;
  createCard: (data: CreateCardData) => Promise<CardEntity>;
  updateCard: (cardId: string, data: UpdateCardData) => Promise<CardEntity>;
  deleteCard: (cardId: string) => Promise<void>;
  moveCard: (cardId: string, targetListId: string) => Promise<CardEntity>;
}
