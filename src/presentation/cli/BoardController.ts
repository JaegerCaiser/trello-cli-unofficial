import type { TrelloRepository } from '@domain/repositories';

import { GetBoardsUseCase, GetCardsUseCase, GetListsUseCase } from '@application/use-cases';
import { t } from '@/i18n';

export class BoardController {
  private getBoardsUseCase: GetBoardsUseCase;
  private getListsUseCase: GetListsUseCase;
  private getCardsUseCase: GetCardsUseCase;

  constructor(trelloRepository: TrelloRepository) {
    this.getBoardsUseCase = new GetBoardsUseCase(trelloRepository);
    this.getListsUseCase = new GetListsUseCase(trelloRepository);
    this.getCardsUseCase = new GetCardsUseCase(trelloRepository);
  }

  async showBoards(): Promise<void> {
    const boards = await this.getBoardsUseCase.execute();

    console.log(t('board.yourBoards'));
    boards.forEach((board, index) => {
      console.log(`${index + 1}. ${board.name}`);
      console.log(`   🔗 ${board.url}`);
      console.log(`   🆔 ${board.id}\n`);
    });
  }

  async showLists(boardName: string): Promise<void> {
    const boards = await this.getBoardsUseCase.execute();
    const board = boards.find(b => b.name === boardName);

    if (!board) {
      throw new Error(t('board.notFound', { name: boardName }));
    }

    const lists = await this.getListsUseCase.execute(board.id);

    console.log(t('list.boardLists', { boardName }));
    lists.forEach((list, index) => {
      console.log(`${index + 1}. ${list.name}`);
      console.log(`   🆔 ${list.id}\n`);
    });
  }

  async showCards(boardName: string, listName: string): Promise<void> {
    const boards = await this.getBoardsUseCase.execute();
    const board = boards.find(b => b.name === boardName);

    if (!board) {
      throw new Error(t('board.notFound', { name: boardName }));
    }

    const lists = await this.getListsUseCase.execute(board.id);
    const list = lists.find(l => l.name === listName);

    if (!list) {
      throw new Error(t('list.notFound', { listName, boardName }));
    }

    const cards = await this.getCardsUseCase.execute(list.id);

    console.log(t('card.listCards', { listName, boardName }));
    if (cards.length === 0) {
      console.log(t('card.emptyList'));
      return;
    }

    cards.forEach((card, index) => {
      console.log(`${index + 1}. ${card.name}`);
      console.log(`   🆔 ${card.id}\n`);
    });
  }

  async getBoards() {
    return await this.getBoardsUseCase.execute();
  }

  async getLists(boardId: string) {
    return await this.getListsUseCase.execute(boardId);
  }

  async getCards(listId: string) {
    return await this.getCardsUseCase.execute(listId);
  }
}
