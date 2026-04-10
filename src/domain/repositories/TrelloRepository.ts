import type {
  BoardEntity,
  CardEntity,
  ChecklistEntity,
  ChecklistItemEntity,
  CreateCardData,
  ListEntity,
  UpdateCardData,
} from '@domain/entities';

export interface BoardMember {
  id: string;
  fullName: string;
  username: string;
  initials: string;
}

export interface BoardLabel {
  id: string;
  name: string;
  color: string;
}

export interface SearchCardsOptions {
  boardId?: string;
  limit?: number;
  page?: number;
}

export interface TrelloRepository {
  getBoards: () => Promise<BoardEntity[]>;
  createBoard: (name: string, description?: string) => Promise<BoardEntity>;
  getBoardMembers: (boardId: string) => Promise<BoardMember[]>;
  getBoardLabels: (boardId: string) => Promise<BoardLabel[]>;
  getLists: (boardId: string) => Promise<ListEntity[]>;
  getList: (listId: string) => Promise<ListEntity>;
  createList: (boardId: string, name: string) => Promise<ListEntity>;
  deleteList: (listId: string) => Promise<void>;
  moveList: (listId: string, position: number) => Promise<ListEntity>;
  getCards: (listId: string) => Promise<CardEntity[]>;
  getCard: (cardId: string) => Promise<CardEntity>;
  createCard: (data: CreateCardData) => Promise<CardEntity>;
  updateCard: (cardId: string, data: UpdateCardData) => Promise<CardEntity>;
  deleteCard: (cardId: string) => Promise<void>;
  moveCard: (cardId: string, targetListId: string) => Promise<CardEntity>;
  createChecklist: (cardId: string, name: string) => Promise<ChecklistEntity>;
  deleteChecklist: (checklistId: string) => Promise<void>;
  renameChecklist: (checklistId: string, name: string) => Promise<ChecklistEntity>;
  addChecklistItem: (checklistId: string, name: string) => Promise<ChecklistItemEntity>;
  deleteChecklistItem: (checklistId: string, itemId: string) => Promise<void>;
  renameChecklistItem: (cardId: string, itemId: string, name: string) => Promise<ChecklistItemEntity>;
  updateChecklistItemState: (cardId: string, itemId: string, state: 'complete' | 'incomplete') => Promise<ChecklistItemEntity>;
  searchCards: (query: string, options?: SearchCardsOptions) => Promise<CardEntity[]>;
}
