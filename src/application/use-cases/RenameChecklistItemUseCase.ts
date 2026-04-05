import type { ChecklistItemEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export class RenameChecklistItemUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(cardId: string, itemId: string, name: string): Promise<ChecklistItemEntity> {
    if (!name.trim()) {
      throw new Error(t('checklist.validation.requiredItemName'));
    }

    return await this.trelloRepository.renameChecklistItem(cardId, itemId, name);
  }
}
