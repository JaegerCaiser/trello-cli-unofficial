import type { BoardEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export class CreateBoardUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(name: string, description?: string): Promise<BoardEntity> {
    if (!name || name.trim().length === 0) {
      throw new Error(t('board.validation.nameRequired'));
    }

    if (name.length > 16384) {
      throw new Error(t('board.validation.nameTooLong'));
    }

    return await this.trelloRepository.createBoard(name.trim(), description);
  }
}
