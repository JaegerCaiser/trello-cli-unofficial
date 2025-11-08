import type { CardEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';

export class GetCardsUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(listId: string): Promise<CardEntity[]> {
    return await this.trelloRepository.getCards(listId);
  }
}
