import type { CardEntity, UpdateCardData } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export class UpdateCardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(
    cardId: string,
    updateData: UpdateCardData,
  ): Promise<CardEntity> {
    if (updateData.name !== undefined && !updateData.name.trim()) {
      throw new Error(t('card.validation.cardNameCannotBeEmpty'));
    }

    return await this.trelloRepository.updateCard(cardId, updateData);
  }
}
