import type { CardEntity, CreateCardData } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';

export class CreateCardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(cardData: CreateCardData): Promise<CardEntity> {
    if (!cardData.name.trim()) {
      throw new Error('Nome do cartão é obrigatório');
    }

    return await this.trelloRepository.createCard(cardData);
  }
}
