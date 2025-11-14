import type { CardEntity, CreateCardData } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export class CreateCardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(cardData: CreateCardData): Promise<CardEntity> {
    if (!cardData.name.trim()) {
      throw new Error(t('card.validation.requiredCardName'));
    }

    return await this.trelloRepository.createCard(cardData);
  }
}
