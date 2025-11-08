import type { CardEntity, UpdateCardData } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';

export class UpdateCardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(
    cardId: string,
    updateData: UpdateCardData,
  ): Promise<CardEntity> {
    if (updateData.name !== undefined && !updateData.name.trim()) {
      throw new Error('Nome do cartão não pode estar vazio');
    }

    return await this.trelloRepository.updateCard(cardId, updateData);
  }
}
