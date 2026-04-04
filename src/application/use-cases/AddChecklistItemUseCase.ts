import type { ChecklistItemEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export class AddChecklistItemUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(checklistId: string, name: string): Promise<ChecklistItemEntity> {
    if (!name.trim()) {
      throw new Error(t('checklist.validation.requiredItemName'));
    }

    return await this.trelloRepository.addChecklistItem(checklistId, name);
  }
}
