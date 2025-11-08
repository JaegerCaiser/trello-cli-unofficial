import type { TrelloRepository } from '../../domain/repositories';

export class DeleteCardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(cardId: string): Promise<void> {
    await this.trelloRepository.deleteCard(cardId);
  }
}
