import type { BoardEntity } from '../../domain/entities';
import type { TrelloRepository } from '../../domain/repositories';

export class GetBoardsUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(): Promise<BoardEntity[]> {
    return await this.trelloRepository.getBoards();
  }
}
