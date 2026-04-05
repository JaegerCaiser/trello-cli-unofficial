import type { TrelloRepository } from '@domain/repositories';

export class DeleteChecklistUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(checklistId: string): Promise<void> {
    await this.trelloRepository.deleteChecklist(checklistId);
  }
}
