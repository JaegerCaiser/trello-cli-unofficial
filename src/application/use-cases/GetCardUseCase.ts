import type { CardEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';

export class GetCardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(cardId: string): Promise<CardEntity> {
    return await this.trelloRepository.getCard(cardId);
  }
}
