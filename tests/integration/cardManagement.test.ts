import {
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardsUseCase,
  UpdateCardUseCase,
} from '@application/use-cases';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('Card Management Integration', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let createCardUseCase: CreateCardUseCase;
  let getCardsUseCase: GetCardsUseCase;
  let updateCardUseCase: UpdateCardUseCase;
  let deleteCardUseCase: DeleteCardUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();

    createCardUseCase = new CreateCardUseCase(mockTrelloRepo);
    getCardsUseCase = new GetCardsUseCase(mockTrelloRepo);
    updateCardUseCase = new UpdateCardUseCase(mockTrelloRepo);
    deleteCardUseCase = new DeleteCardUseCase(mockTrelloRepo);
  });

  test('complete card lifecycle: create, read, update, delete', async () => {
    // 1. Create a new card
    const newCard = await createCardUseCase.execute({
      name: 'Integration Test Card',
      desc: 'Testing full lifecycle',
      listId: 'list1',
    });

    expect(newCard.name).toBe('Integration Test Card');
    expect(newCard.idList).toBe('list1');

    // 2. Read cards to verify creation
    const cardsAfterCreate = await getCardsUseCase.execute('list1');
    expect(cardsAfterCreate.length).toBeGreaterThan(0);
    const foundCard = cardsAfterCreate.find(c => c.id === newCard.id);
    expect(foundCard).toBeDefined();

    // 3. Update the card
    const updatedCard = await updateCardUseCase.execute(newCard.id, {
      name: 'Updated Integration Card',
      desc: 'Updated description',
    });

    expect(updatedCard.name).toBe('Updated Integration Card');
    expect(updatedCard.desc).toBe('Updated description');

    // 4. Delete the card
    await deleteCardUseCase.execute(newCard.id);

    // 5. Verify deletion
    const cardsAfterDelete = await getCardsUseCase.execute('list1');
    const deletedCard = cardsAfterDelete.find(c => c.id === newCard.id);
    expect(deletedCard).toBeUndefined();
  });

  test('move card between lists', async () => {
    // Create card in list1
    const card = await createCardUseCase.execute({
      name: 'Card to Move',
      listId: 'list1',
    });

    // Verify in list1
    const list1Cards = await getCardsUseCase.execute('list1');
    expect(list1Cards.find(c => c.id === card.id)).toBeDefined();

    // Move to list2
    const movedCard = await updateCardUseCase.execute(card.id, {
      idList: 'list2',
    });

    expect(movedCard.idList).toBe('list2');

    // Verify in list2
    const list2Cards = await getCardsUseCase.execute('list2');
    expect(list2Cards.find(c => c.id === card.id)).toBeDefined();
  });

  test('handle multiple cards in same list', async () => {
    const listId = 'list1';

    // Create multiple cards
    const card1 = await createCardUseCase.execute({
      name: 'Card 1',
      listId,
    });

    const card2 = await createCardUseCase.execute({
      name: 'Card 2',
      listId,
    });

    const card3 = await createCardUseCase.execute({
      name: 'Card 3',
      listId,
    });

    // Get all cards
    const cards = await getCardsUseCase.execute(listId);

    expect(cards.length).toBeGreaterThanOrEqual(3);
    expect(cards.find(c => c.id === card1.id)).toBeDefined();
    expect(cards.find(c => c.id === card2.id)).toBeDefined();
    expect(cards.find(c => c.id === card3.id)).toBeDefined();
  });
});
