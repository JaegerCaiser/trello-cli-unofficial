import type { BoardEntity, ListEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export interface BoardDetails {
  board: BoardEntity;
  lists: ListEntity[];
  totalLists: number;
  totalCards: number;
}

export class GetBoardDetailsUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(boardId: string): Promise<BoardDetails> {
    // Get board info
    const boards = await this.trelloRepository.getBoards();
    const board = boards.find(b => b.id === boardId);

    if (!board) {
      throw new Error(t('board.notFoundById', { id: boardId }));
    }

    // Get lists for this board
    const lists = await this.trelloRepository.getLists(boardId);

    // Get cards for each list and count total
    let totalCards = 0;
    for (const list of lists) {
      const cards = await this.trelloRepository.getCards(list.id);
      totalCards += cards.length;
    }

    return {
      board,
      lists,
      totalLists: lists.length,
      totalCards,
    };
  }
}
