import type { TrelloRepository } from '@domain/repositories';
import { GetBoardsUseCase, GetCardsUseCase, GetListsUseCase } from '@application/use-cases';

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

    console.log('📋 Seus Quadros do Trello:');
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
      throw new Error(`Quadro "${boardName}" não encontrado`);
    }

    const lists = await this.getListsUseCase.execute(board.id);

    console.log(`📋 Listas do quadro "${boardName}":`);
    lists.forEach((list, index) => {
      console.log(`${index + 1}. ${list.name}`);
      console.log(`   🆔 ${list.id}\n`);
    });
  }

  async showCards(boardName: string, listName: string): Promise<void> {
    const boards = await this.getBoardsUseCase.execute();
    const board = boards.find(b => b.name === boardName);

    if (!board) {
      throw new Error(`Quadro "${boardName}" não encontrado`);
    }

    const lists = await this.getListsUseCase.execute(board.id);
    const list = lists.find(l => l.name === listName);

    if (!list) {
      throw new Error(
        `Lista "${listName}" não encontrada no quadro "${boardName}"`,
      );
    }

    const cards = await this.getCardsUseCase.execute(list.id);

    console.log(`📋 Cartões da lista "${listName}" no quadro "${boardName}":`);
    if (cards.length === 0) {
      console.log('📭 Esta lista está vazia.');
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
