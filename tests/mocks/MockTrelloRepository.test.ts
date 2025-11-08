import { BoardEntity, CardEntity, ListEntity } from '@domain/entities';
import { beforeEach, describe, expect, test } from 'bun:test';
import { MockTrelloRepository } from './MockTrelloRepository';

describe('MockTrelloRepository', () => {
  let repo: MockTrelloRepository;

  beforeEach(() => {
    repo = new MockTrelloRepository();
    repo.setupMockData();
  });

  describe('createCard', () => {
    test('should create card with provided data', async () => {
      const cardData = {
        name: 'New Card',
        desc: 'New Description',
        listId: 'list1',
      };

      const card = await repo.createCard(cardData);

      expect(card.name).toBe('New Card');
      expect(card.desc).toBe('New Description');
      expect(card.idList).toBe('list1');
      expect(card.id).toMatch(/^card-\d+$/);
      expect(card.url).toMatch(/^https:\/\/trello\.com\/c\/card-\d+$/);
    });

    test('should create card without description', async () => {
      const cardData = {
        name: 'Card without desc',
        desc: '',
        listId: 'list1',
      };

      const card = await repo.createCard(cardData);

      expect(card.name).toBe('Card without desc');
      expect(card.desc).toBe('');
      expect(card.idList).toBe('list1');
    });

    test('should add card to the correct list', async () => {
      const initialCards = await repo.getCards('list2');
      const initialCount = initialCards.length;

      const cardData = {
        name: 'Card for list2',
        desc: 'Description',
        listId: 'list2',
      };

      await repo.createCard(cardData);

      const updatedCards = await repo.getCards('list2');
      expect(updatedCards).toHaveLength(initialCount + 1);
      expect(updatedCards[updatedCards.length - 1]?.name).toBe('Card for list2');
    });
  });

  describe('updateCard', () => {
    test('should update card name', async () => {
      const updatedCard = await repo.updateCard('card1', { name: 'Updated Name' });

      expect(updatedCard.id).toBe('card1');
      expect(updatedCard.name).toBe('Updated Name');
      expect(updatedCard.desc).toBe('Description 1');
      expect(updatedCard.idList).toBe('list1');
    });

    test('should update card description', async () => {
      const updatedCard = await repo.updateCard('card1', { desc: 'Updated Description' });

      expect(updatedCard.id).toBe('card1');
      expect(updatedCard.name).toBe('Test Card 1');
      expect(updatedCard.desc).toBe('Updated Description');
      expect(updatedCard.idList).toBe('list1');
    });

    test('should move card to different list', async () => {
      const initialList1Cards = await repo.getCards('list1');
      const initialList2Cards = await repo.getCards('list2');
      const expectedFinalList1Length = initialList1Cards.length - 1;
      const expectedFinalList2Length = initialList2Cards.length + 1;

      const updatedCard = await repo.updateCard('card1', { idList: 'list2' });

      expect(updatedCard.id).toBe('card1');
      expect(updatedCard.idList).toBe('list2');

      const finalList1Cards = await repo.getCards('list1');
      const finalList2Cards = await repo.getCards('list2');

      expect(finalList1Cards).toHaveLength(expectedFinalList1Length);
      expect(finalList2Cards).toHaveLength(expectedFinalList2Length);
    });

    test('should update multiple fields at once', async () => {
      const updatedCard = await repo.updateCard('card1', {
        name: 'Multi Update',
        desc: 'Multi Description',
        idList: 'list3',
      });

      expect(updatedCard.id).toBe('card1');
      expect(updatedCard.name).toBe('Multi Update');
      expect(updatedCard.desc).toBe('Multi Description');
      expect(updatedCard.idList).toBe('list3');
    });

    test('should throw error for non-existent card', async () => {
      await expect(repo.updateCard('nonexistent', { name: 'Test' })).rejects.toThrow('Card not found');
    });
  });

  describe('deleteCard', () => {
    test('should delete existing card', async () => {
      const initialCards = await repo.getCards('list1');
      const initialCount = initialCards.length;

      await repo.deleteCard('card1');

      const finalCards = await repo.getCards('list1');
      expect(finalCards).toHaveLength(initialCount - 1);
      expect(finalCards.find(c => c.id === 'card1')).toBeUndefined();
    });

    test('should throw error for non-existent card', async () => {
      await expect(repo.deleteCard('nonexistent')).rejects.toThrow('Card not found');
    });
  });

  describe('moveCard', () => {
    test('should move card to different list', async () => {
      const initialList1Cards = await repo.getCards('list1');
      const initialList2Cards = await repo.getCards('list2');
      const expectedFinalList1Length = initialList1Cards.length - 1;
      const expectedFinalList2Length = initialList2Cards.length + 1;

      const movedCard = await repo.moveCard('card1', 'list2');

      expect(movedCard.id).toBe('card1');
      expect(movedCard.idList).toBe('list2');

      const finalList1Cards = await repo.getCards('list1');
      const finalList2Cards = await repo.getCards('list2');

      expect(finalList1Cards).toHaveLength(expectedFinalList1Length);
      expect(finalList2Cards).toHaveLength(expectedFinalList2Length);
    });
  });

  describe('helper methods', () => {
    test('reset should clear all data', () => {
      repo.reset();

      expect(repo.getBoards()).resolves.toHaveLength(0);
      expect(repo.getLists('board1')).resolves.toHaveLength(0);
      expect(repo.getCards('list1')).resolves.toHaveLength(0);
    });

    test('addBoard should add board to repository', () => {
      repo.reset();
      const board = new BoardEntity('test-board', 'Test Board', 'https://trello.com/b/test');

      repo.addBoard(board);

      expect(repo.getBoards()).resolves.toContain(board);
    });

    test('addList should add list to specific board', () => {
      const list = new ListEntity('test-list', 'Test List');

      repo.addList('board1', list);

      expect(repo.getLists('board1')).resolves.toContain(list);
    });

    test('addCard should add card to specific list', () => {
      const card = new CardEntity('test-card', 'Test Card', 'list1', 'Description', 'https://trello.com/c/test');

      repo.addCard('list1', card);

      expect(repo.getCards('list1')).resolves.toContain(card);
    });
  });
});
