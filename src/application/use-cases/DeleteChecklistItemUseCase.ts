import type { TrelloRepository } from '@domain/repositories';

export class DeleteChecklistItemUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(checklistId: string, itemId: string): Promise<void> {
    await this.trelloRepository.deleteChecklistItem(checklistId, itemId);
  }
}
