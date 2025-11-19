import type { BoardEntity, ListEntity } from '@domain/entities';
import type { BoardLabel, BoardMember, TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export interface BoardDetails {
  board: BoardEntity;
  lists: ListEntity[];
  members: BoardMember[];
  labels: BoardLabel[];
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

    // Get members for this board
    const members = await this.trelloRepository.getBoardMembers(boardId);

    // Get labels for this board
    const labels = await this.trelloRepository.getBoardLabels(boardId);

    // Get cards for each list and count total
    let totalCards = 0;
    for (const list of lists) {
      const cards = await this.trelloRepository.getCards(list.id);
      totalCards += cards.length;
    }

    return {
      board,
      lists,
      members,
      labels,
      totalLists: lists.length,
      totalCards,
    };
  }
}
