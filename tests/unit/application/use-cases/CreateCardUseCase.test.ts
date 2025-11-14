import { CreateCardUseCase } from '@application/use-cases';
import { changeLanguage } from '@i18n';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('CreateCardUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: CreateCardUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new CreateCardUseCase(mockTrelloRepo);
    changeLanguage('pt-BR'); // Ensure tests run in Portuguese
  });

  describe('execute', () => {
    test('should create card with valid data', async () => {
      const cardData = {
        name: 'New Card',
        desc: 'New Description',
        listId: 'list1',
      };

      const card = await useCase.execute(cardData);

      expect(card.name).toBe('New Card');
      expect(card.desc).toBe('New Description');
      expect(card.idList).toBe('list1');
      expect(card.id).toBeDefined();
      expect(card.url).toBeDefined();
    });

    test('should create card without description', async () => {
      const cardData = {
        name: 'Card Without Desc',
        listId: 'list1',
      };

      const card = await useCase.execute(cardData);

      expect(card.name).toBe('Card Without Desc');
      expect(card.desc).toBeUndefined();
    });

    test('should throw error for empty card name', async () => {
      const cardData = {
        name: '',
        listId: 'list1',
      };

      await expect(useCase.execute(cardData)).rejects.toThrow(
        'Nome do cartão é obrigatório',
      );
    });

    test('should throw error for whitespace-only card name', async () => {
      const cardData = {
        name: '   ',
        listId: 'list1',
      };

      await expect(useCase.execute(cardData)).rejects.toThrow(
        'Nome do cartão é obrigatório',
      );
    });

    test('should accept card name with leading/trailing spaces', async () => {
      const cardData = {
        name: '  Valid Name  ',
        listId: 'list1',
      };

      const card = await useCase.execute(cardData);

      expect(card.name).toBe('  Valid Name  ');
    });
  });
});
