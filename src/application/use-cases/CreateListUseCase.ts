import type { ListEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export class CreateListUseCase {
  constructor(private readonly trelloRepository: TrelloRepository) {}

  async execute(boardId: string, name: string): Promise<ListEntity> {
    if (!name || name.trim().length === 0) {
      throw new Error(t('list.validation.nameCannotBeEmpty'));
    }

    if (name.length > 16384) {
      throw new Error(t('list.validation.nameTooLong'));
    }

    return this.trelloRepository.createList(boardId, name.trim());
  }
}
