import { describe, expect, test } from 'bun:test';
import { CardEntity } from '../../../../src/domain/entities';
import { createMockCard, TestData } from '../../../helpers';

describe('CardEntity', () => {
  describe('constructor', () => {
    test('should create a card with all properties', () => {
      const card = new CardEntity(
        'card1',
        'Test Card',
        'list1',
        'Test Description',
        'https://trello.com/c/card1',
      );

      expect(card.id).toBe('card1');
      expect(card.name).toBe('Test Card');
      expect(card.idList).toBe('list1');
      expect(card.desc).toBe('Test Description');
      expect(card.url).toBe('https://trello.com/c/card1');
    });

    test('should create card with optional description', () => {
      const card = new CardEntity(
        'card1',
        'Test Card',
        'list1',
        undefined,
        'https://trello.com/c/card1',
      );

      expect(card.desc).toBeUndefined();
    });
  });

  describe('fromApiResponse', () => {
    test('should create card from API response', () => {
      const apiResponse = TestData.apiResponses.card;
      const card = CardEntity.fromApiResponse(apiResponse);

      expect(card.id).toBe(apiResponse.id);
      expect(card.name).toBe(apiResponse.name);
      expect(card.idList).toBe(apiResponse.idList);
      expect(card.desc).toBe(apiResponse.desc);
      expect(card.url).toBe(apiResponse.url);
    });
  });

  describe('create', () => {
    test('should create card data from CreateCardData', () => {
      const createData = {
        name: 'New Card',
        desc: 'New Description',
        listId: 'list1',
      };

      const cardData = CardEntity.create(createData);

      expect(cardData.name).toBe('New Card');
      expect(cardData.desc).toBe('New Description');
      expect(cardData.idList).toBe('list1');
    });

    test('should handle optional description', () => {
      const createData = {
        name: 'New Card',
        listId: 'list1',
      };

      const cardData = CardEntity.create(createData);

      expect(cardData.name).toBe('New Card');
      expect(cardData.desc).toBeUndefined();
      expect(cardData.idList).toBe('list1');
    });
  });

  describe('update', () => {
    test('should update card name', () => {
      const card = createMockCard();
      const updated = card.update({ name: 'Updated Name' });

      expect(updated.name).toBe('Updated Name');
      expect(updated.desc).toBe(card.desc);
      expect(updated.idList).toBe(card.idList);
    });

    test('should update card description', () => {
      const card = createMockCard();
      const updated = card.update({ desc: 'Updated Description' });

      expect(updated.name).toBe(card.name);
      expect(updated.desc).toBe('Updated Description');
      expect(updated.idList).toBe(card.idList);
    });

    test('should move card to different list', () => {
      const card = createMockCard();
      const updated = card.update({ idList: 'new-list-id' });

      expect(updated.idList).toBe('new-list-id');
      expect(updated.name).toBe(card.name);
    });

    test('should not mutate original card', () => {
      const card = createMockCard({ name: 'Original' });
      const updated = card.update({ name: 'Updated' });

      expect(card.name).toBe('Original');
      expect(updated.name).toBe('Updated');
    });
  });
});
