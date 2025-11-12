import type { BoardEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';

export class CreateBoardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(name: string, description?: string): Promise<BoardEntity> {
    if (!name || name.trim().length === 0) {
      throw new Error('Board name is required');
    }

    if (name.length > 16384) {
      throw new Error('Board name is too long (max 16384 characters)');
    }

    return await this.trelloRepository.createBoard(name.trim(), description);
  }
}
