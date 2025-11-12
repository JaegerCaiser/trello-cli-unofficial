import type { ListEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';

export class CreateListUseCase {
  constructor(private readonly trelloRepository: TrelloRepository) {}

  async execute(boardId: string, name: string): Promise<ListEntity> {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome da lista não pode estar vazio');
    }

    if (name.length > 16384) {
      throw new Error('Nome da lista não pode ter mais de 16384 caracteres');
    }

    return this.trelloRepository.createList(boardId, name.trim());
  }
}
