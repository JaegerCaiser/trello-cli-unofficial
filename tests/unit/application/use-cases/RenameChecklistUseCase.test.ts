import { RenameChecklistUseCase } from '@application/use-cases';
import { changeLanguage } from '@i18n';
import { MockTrelloRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('RenameChecklistUseCase', () => {
  let mockTrelloRepo: MockTrelloRepository;
  let useCase: RenameChecklistUseCase;

  beforeEach(() => {
    mockTrelloRepo = new MockTrelloRepository();
    mockTrelloRepo.setupMockData();
    useCase = new RenameChecklistUseCase(mockTrelloRepo);
    changeLanguage('pt-BR');
  });

  describe('execute', () => {
    test('should rename checklist with valid name', async () => {
      const checklist = await useCase.execute('checklist1', 'Novo Nome');

      expect(checklist.name).toBe('Novo Nome');
      expect(checklist.id).toBe('checklist1');
    });

    test('should throw error for empty name', async () => {
      await expect(useCase.execute('checklist1', '')).rejects.toThrow(
        'Nome do checklist é obrigatório',
      );
    });

    test('should throw error for whitespace-only name', async () => {
      await expect(useCase.execute('checklist1', '   ')).rejects.toThrow(
        'Nome do checklist é obrigatório',
      );
    });

    test('should accept name with leading/trailing spaces', async () => {
      const checklist = await useCase.execute('checklist1', '  Valid Name  ');
      expect(checklist.name).toBe('  Valid Name  ');
    });

    test('should call repository renameChecklist with correct args', async () => {
      let calledId: string | undefined;
      let calledName: string | undefined;
      const { ChecklistEntity } = await import('@domain/entities');
      mockTrelloRepo.renameChecklist = async (id: string, name: string) => {
        calledId = id;
        calledName = name;
        return new ChecklistEntity(id, name, 'card1', []);
      };

      await useCase.execute('abc', 'New Name');
      expect(calledId).toBe('abc');
      expect(calledName).toBe('New Name');
    });
  });
});
