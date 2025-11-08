import type { CreateCardData, UpdateCardData } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { BoardEntity, CardEntity, ListEntity } from '@domain/entities';

export class MockTrelloRepository implements TrelloRepository {
  private boards: BoardEntity[] = [];
  private lists: Map<string, ListEntity[]> = new Map();
  private cards: Map<string, CardEntity[]> = new Map();

  // Stub data for testing
  setupMockData(): void {
    this.boards = [
      new BoardEntity('board1', 'Test Board 1', 'https://trello.com/b/board1'),
      new BoardEntity('board2', 'Test Board 2', 'https://trello.com/b/board2'),
    ];

    this.lists.set('board1', [
      new ListEntity('list1', 'To Do'),
      new ListEntity('list2', 'In Progress'),
      new ListEntity('list3', 'Done'),
    ]);

    this.cards.set('list1', [
      new CardEntity(
        'card1',
        'Test Card 1',
        'list1',
        'Description 1',
        'https://trello.com/c/card1',
      ),
      new CardEntity(
        'card2',
        'Test Card 2',
        'list1',
        'Description 2',
        'https://trello.com/c/card2',
      ),
    ]);
  }

  async getBoards(): Promise<BoardEntity[]> {
    return Promise.resolve(this.boards);
  }

  async getLists(boardId: string): Promise<ListEntity[]> {
    return Promise.resolve(this.lists.get(boardId) || []);
  }

  async getCards(listId: string): Promise<CardEntity[]> {
    return Promise.resolve(this.cards.get(listId) || []);
  }

  async createCard(data: CreateCardData): Promise<CardEntity> {
    const newCard = new CardEntity(
      `card-${Date.now()}`,
      data.name,
      data.listId,
      data.desc,
      `https://trello.com/c/card-${Date.now()}`,
    );

    const listCards = this.cards.get(data.listId) || [];
    listCards.push(newCard);
    this.cards.set(data.listId, listCards);

    return Promise.resolve(newCard);
  }

  async updateCard(
    cardId: string,
    updates: UpdateCardData,
  ): Promise<CardEntity> {
    // Find and update the card
    for (const [listId, cards] of this.cards.entries()) {
      const cardIndex = cards.findIndex(c => c.id === cardId);
      if (cardIndex !== -1) {
        const oldCard = cards[cardIndex]!;
        const updatedCard = new CardEntity(
          cardId,
          updates.name ?? oldCard.name,
          updates.idList ?? oldCard.idList,
          updates.desc ?? oldCard.desc,
          oldCard.url,
        );

        // If moving to a different list, remove from old list and add to new list
        if (updates.idList && updates.idList !== listId) {
          cards.splice(cardIndex, 1);
          this.cards.set(listId, cards); // Save the modified original list
          const targetListCards = this.cards.get(updates.idList) || [];
          targetListCards.push(updatedCard);
          this.cards.set(updates.idList, targetListCards);
        } else {
          cards[cardIndex] = updatedCard;
        }

        return Promise.resolve(updatedCard);
      }
    }
    throw new Error('Card not found');
  }

  async deleteCard(cardId: string): Promise<void> {
    for (const [listId, cards] of this.cards.entries()) {
      const filteredCards = cards.filter(c => c.id !== cardId);
      if (filteredCards.length !== cards.length) {
        this.cards.set(listId, filteredCards);
        return Promise.resolve();
      }
    }
    throw new Error('Card not found');
  }

  async moveCard(cardId: string, targetListId: string): Promise<CardEntity> {
    return this.updateCard(cardId, { idList: targetListId });
  }

  // Helper methods for testing
  reset(): void {
    this.boards = [];
    this.lists.clear();
    this.cards.clear();
  }

  addBoard(board: BoardEntity): void {
    this.boards.push(board);
  }

  addList(boardId: string, list: ListEntity): void {
    const lists = this.lists.get(boardId) || [];
    lists.push(list);
    this.lists.set(boardId, lists);
  }

  addCard(listId: string, card: CardEntity): void {
    const cards = this.cards.get(listId) || [];
    cards.push(card);
    this.cards.set(listId, cards);
  }
}
