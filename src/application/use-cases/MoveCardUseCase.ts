import type { CardEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';

export class MoveCardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(cardId: string, targetListId: string): Promise<CardEntity> {
    return await this.trelloRepository.moveCard(cardId, targetListId);
  }
}
