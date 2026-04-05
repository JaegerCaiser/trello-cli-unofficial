import type { ChecklistItemEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';

export class UpdateChecklistItemStateUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(
    cardId: string,
    itemId: string,
    state: 'complete' | 'incomplete',
  ): Promise<ChecklistItemEntity> {
    return await this.trelloRepository.updateChecklistItemState(cardId, itemId, state);
  }
}
