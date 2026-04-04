import type { ChecklistEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export class CreateChecklistUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(cardId: string, name: string): Promise<ChecklistEntity> {
    if (!name.trim()) {
      throw new Error(t('checklist.validation.requiredName'));
    }

    return await this.trelloRepository.createChecklist(cardId, name);
  }
}
