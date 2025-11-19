import type { BoardEntity, CardEntity, ListEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import type { OutputFormatter } from '@/shared';

import {
  CreateBoardUseCase,
  CreateListUseCase,
  GetBoardDetailsUseCase,
  GetBoardsUseCase,
  GetCardsUseCase,
  GetListsUseCase,
} from '@application/use-cases';
import { t } from '@/i18n';

export class BoardController {
  private getBoardsUseCase: GetBoardsUseCase;
  private getListsUseCase: GetListsUseCase;
  private getCardsUseCase: GetCardsUseCase;
  private getBoardDetailsUseCase: GetBoardDetailsUseCase;
  private createBoardUseCase: CreateBoardUseCase;
  private createListUseCase: CreateListUseCase;
  private trelloRepository: TrelloRepository;
  private outputFormatter: OutputFormatter;

  constructor(
    trelloRepository: TrelloRepository,
    outputFormatter: OutputFormatter,
  ) {
    this.trelloRepository = trelloRepository;
    this.outputFormatter = outputFormatter;
    this.getBoardsUseCase = new GetBoardsUseCase(trelloRepository);
    this.getListsUseCase = new GetListsUseCase(trelloRepository);
    this.getCardsUseCase = new GetCardsUseCase(trelloRepository);
    this.getBoardDetailsUseCase = new GetBoardDetailsUseCase(trelloRepository);
    this.createBoardUseCase = new CreateBoardUseCase(trelloRepository);
    this.createListUseCase = new CreateListUseCase(trelloRepository);
  }

  async showBoards(): Promise<void> {
    const boards = await this.getBoardsUseCase.execute();

    this.outputFormatter.output(boards, {
      fields: ['name', 'id', 'url'],
      headers: ['Name', 'ID', 'URL'],
    });
  }

  async showBoardDetails(boardId: string): Promise<void> {
    const details = await this.getBoardDetailsUseCase.execute(boardId);

    this.outputFormatter.message(
      t('board.boardName', { name: details.board.name }),
    );
    this.outputFormatter.message(
      t('board.boardUrl', { url: details.board.url }),
    );
    this.outputFormatter.message(t('board.boardId', { id: details.board.id }));
    this.outputFormatter.message(
      t('board.boardStats', {
        lists: details.totalLists,
        cards: details.totalCards,
      }),
    );

    // Display members in a compact format
    if (details.members.length > 0) {
      const memberNames = details.members.map(m => m.fullName).join(', ');
      this.outputFormatter.message(t('board.members', { members: memberNames }));
    }

    // Display labels in a compact format
    if (details.labels.length > 0) {
      const labelNames = details.labels.map(l => l.name || l.color).join(', ');
      this.outputFormatter.message(t('board.labels', { labels: labelNames }));
    }

    this.outputFormatter.message('');

    if (details.lists.length > 0) {
      this.outputFormatter.message(t('board.listsTitle'));
      this.outputFormatter.output(details.lists, {
        fields: ['name', 'id'],
        headers: [t('board.listsHeaders.name'), t('board.listsHeaders.id')],
      });
    } else {
      this.outputFormatter.message(t('board.listsEmpty'));
    }
  }

  async getBoards(): Promise<BoardEntity[]> {
    return this.getBoardsUseCase.execute();
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
      console.log(`   ${t('list.listId', { id: list.id })}\n`);
    });
  }

  async getLists(boardId: string): Promise<ListEntity[]> {
    return this.getListsUseCase.execute(boardId);
  }

  async getCards(listId: string): Promise<CardEntity[]> {
    return this.getCardsUseCase.execute(listId);
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
      console.log(`   ${t('card.cardId', { id: card.id })}\n`);
    });
  }

  async showListsById(boardId: string): Promise<void> {
    const lists = await this.getListsUseCase.execute(boardId);

    this.outputFormatter.output(lists, {
      fields: ['name', 'id'],
      headers: ['Name', 'ID'],
    });
  }

  async showCardsByListId(listId: string): Promise<void> {
    const cards = await this.getCardsUseCase.execute(listId);

    if (cards.length === 0) {
      this.outputFormatter.message(t('list.cardsEmpty'));
      return;
    }

    this.outputFormatter.output(cards, {
      fields: ['name', 'id'],
      headers: ['Name', 'ID'],
    });
  }

  async createBoard(name: string, description?: string): Promise<void> {
    const board = await this.createBoardUseCase.execute(name, description);

    console.log(t('board.created', { name: board.name }));
    console.log(`🔗 ${board.url}`);
    console.log(`🆔 ${board.id}`);
  }

  async createList(boardId: string, name: string): Promise<void> {
    const list = await this.createListUseCase.execute(boardId, name);

    console.log(t('list.created', { name: list.name }));
    console.log(`🆔 ${list.id}`);
  }

  async deleteList(listId: string): Promise<void> {
    // Primeiro precisamos encontrar a lista para mostrar informações
    const boards = await this.getBoardsUseCase.execute();
    let list: ListEntity | undefined;

    for (const board of boards) {
      const lists = await this.getListsUseCase.execute(board.id);
      list = lists.find((l: ListEntity) => l.id === listId);

      if (list) {
        break;
      }
    }

    if (!list) {
      throw new Error(t('list.notFound', { listId }));
    }

    // Verificar se a lista está vazia antes de deletar
    const cards = await this.getCardsUseCase.execute(listId);
    if (cards.length > 0) {
      throw new Error(t('list.notEmpty', { listName: list.name }));
    }

    // Deletar a lista usando o repositório
    await this.trelloRepository.deleteList(listId);

    console.log(t('list.deleted', { name: list.name }));
    console.log(`🆔 ${list.id}`);
  }

  async moveList(listId: string, position: number): Promise<void> {
    // Primeiro precisamos encontrar a lista para mostrar informações
    const boards = await this.getBoardsUseCase.execute();
    let list: ListEntity | undefined;

    for (const board of boards) {
      const lists = await this.getListsUseCase.execute(board.id);
      list = lists.find((l: ListEntity) => l.id === listId);

      if (list) {
        break;
      }
    }

    if (!list) {
      throw new Error(t('list.notFound', { listId }));
    }

    // Mover a lista para a nova posição
    await this.trelloRepository.moveList(listId, position);

    console.log(t('list.moved', { name: list.name, position }));
    console.log(`🆔 ${list.id}`);
  }
}
