import { DeleteChecklistUseCase } from '@application/use-cases';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('DeleteChecklistUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: DeleteChecklistUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new DeleteChecklistUseCase(mockTrelloRepo);
  });

  describe('execute', () => {
    test('should delete checklist successfully', async () => {
      await expect(useCase.execute('checklist1')).resolves.toBeUndefined();
    });

    test('should resolve without error for any checklist id', async () => {
      await expect(useCase.execute('any-id')).resolves.toBeUndefined();
    });

    test('should call repository deleteChecklist with correct id', async () => {
      let calledWith: string | undefined;
      mockTrelloRepo.deleteChecklist = async (id: string) => {
        calledWith = id;
      };

      await useCase.execute('checklist-abc');
      expect(calledWith).toBe('checklist-abc');
    });
  });
});
