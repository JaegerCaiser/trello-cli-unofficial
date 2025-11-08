import type { ListEntity } from '../../domain/entities';
import type { TrelloRepository } from '../../domain/repositories';

export class GetListsUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(boardId: string): Promise<ListEntity[]> {
    return await this.trelloRepository.getLists(boardId);
  }
}
