import type { BoardEntity, CardEntity, CreateCardData, ListEntity, UpdateCardData } from '../entities';

export interface TrelloRepository {
  getBoards: () => Promise<BoardEntity[]>;
  getLists: (boardId: string) => Promise<ListEntity[]>;
  getCards: (listId: string) => Promise<CardEntity[]>;
  createCard: (data: CreateCardData) => Promise<CardEntity>;
  updateCard: (cardId: string, data: UpdateCardData) => Promise<CardEntity>;
  deleteCard: (cardId: string) => Promise<void>;
  moveCard: (cardId: string, targetListId: string) => Promise<CardEntity>;
}
