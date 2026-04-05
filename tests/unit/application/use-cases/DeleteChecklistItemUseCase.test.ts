import { DeleteChecklistItemUseCase } from '@application/use-cases';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('DeleteChecklistItemUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: DeleteChecklistItemUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new DeleteChecklistItemUseCase(mockTrelloRepo);
  });

  describe('execute', () => {
    test('should delete checklist item successfully', async () => {
      await expect(useCase.execute('checklist1', 'item1')).resolves.toBeUndefined();
    });

    test('should resolve for any checklist and item ids', async () => {
      await expect(useCase.execute('any-checklist', 'any-item')).resolves.toBeUndefined();
    });

    test('should call repository deleteChecklistItem with correct args', async () => {
      let calledChecklist: string | undefined;
      let calledItem: string | undefined;
      mockTrelloRepo.deleteChecklistItem = async (checklistId: string, itemId: string) => {
        calledChecklist = checklistId;
        calledItem = itemId;
      };

      await useCase.execute('cl-123', 'it-456');
      expect(calledChecklist).toBe('cl-123');
      expect(calledItem).toBe('it-456');
    });
  });
});
