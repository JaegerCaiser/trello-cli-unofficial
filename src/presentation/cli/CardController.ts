import type { BoardEntity, CardEntity, ListEntity } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import type { BoardController } from './BoardController';
import type { OutputFormatter } from '@/shared';

import {
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardUseCase,
  MoveCardUseCase,
  UpdateCardUseCase,
} from '@application/use-cases';

import { CARD_ACTIONS } from '@shared/types';
import inquirer from 'inquirer';
import { t } from '@/i18n';

export class CardController {
  private createCardUseCase: CreateCardUseCase;
  private updateCardUseCase: UpdateCardUseCase;
  private deleteCardUseCase: DeleteCardUseCase;
  private moveCardUseCase: MoveCardUseCase;
  private getCardUseCase: GetCardUseCase;

  constructor(
    private trelloRepository: TrelloRepository,
    private boardController: BoardController, // Will be injected to avoid circular dependency
    private outputFormatter: OutputFormatter,
  ) {
    this.createCardUseCase = new CreateCardUseCase(trelloRepository);
    this.updateCardUseCase = new UpdateCardUseCase(trelloRepository);
    this.deleteCardUseCase = new DeleteCardUseCase(trelloRepository);
    this.moveCardUseCase = new MoveCardUseCase(trelloRepository);
    this.getCardUseCase = new GetCardUseCase(trelloRepository);
  }

  async createCardInteractive(): Promise<void> {
    const boards = await this.boardController.getBoards();

    const { selectedBoard } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBoard',
        message: t('card.selectBoard'),
        choices: boards.map((board: BoardEntity) => ({
          name: board.name,
          value: board.id,
        })),
      },
    ]);

    const lists = await this.boardController.getLists(selectedBoard);

    const { selectedList } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedList',
        message: t('card.selectList'),
        choices: lists.map((list: ListEntity) => ({
          name: list.name,
          value: list.id,
        })),
      },
    ]);

    const { cardName, cardDesc } = await inquirer.prompt([
      {
        type: 'input',
        name: 'cardName',
        message: t('card.enterName'),
        validate: input =>
          input.length > 0 || t('card.validation.requiredName'),
      },
      {
        type: 'input',
        name: 'cardDesc',
        message: t('card.enterDescription'),
      },
    ]);

    const newCard = await this.createCardUseCase.execute({
      name: cardName,
      desc: cardDesc,
      listId: selectedList,
    });

    console.log(t('card.created'));
    console.log(t('card.cardName', { name: newCard.name }));
    console.log(t('card.cardUrl', { url: newCard.url }));
  }

  async exploreCards(boardId: string, lists: ListEntity[]): Promise<void> {
    const { selectedList } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedList',
        message: t('card.selectList'),
        choices: lists.map(list => ({ name: list.name, value: list.id })),
      },
    ]);

    const cards = await this.boardController.getCards(selectedList);

    if (cards.length === 0) {
      console.log(t('card.emptyList'));
      return;
    }

    console.log(
      t('card.cardsInList', {
        listName: lists.find(l => l.id === selectedList)?.name,
      }),
    );
    cards.forEach((card: CardEntity, index: number) => {
      console.log(`${index + 1}. ${card.name}`);
      if (card.desc) {
        const desc
          = card.desc.length > 100
            ? `${card.desc.substring(0, 100)}...`
            : card.desc;
        console.log(t('card.cardDescription', { description: desc }));
      }
      console.log(`${t('card.cardUrl', { url: card.url })}\n`);
    });

    // Opções adicionais
    const { nextAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'nextAction',
        message: t('card.whatToDo'),
        choices: [
          { name: t('card.actions.back'), value: CARD_ACTIONS.BACK },
          { name: t('card.actions.edit'), value: CARD_ACTIONS.EDIT },
          { name: t('card.actions.delete'), value: CARD_ACTIONS.DELETE },
          { name: t('card.actions.moveCard'), value: CARD_ACTIONS.MOVE },
        ],
      },
    ]);

    if (nextAction !== CARD_ACTIONS.BACK) {
      const { selectedCard } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCard',
          message: t('card.selectCard'),
          choices: cards.map((card: CardEntity) => ({
            name: card.name,
            value: card.id,
          })),
        },
      ]);

      const selectedCardEntity = cards.find(
        (c: CardEntity) => c.id === selectedCard,
      )!;

      switch (nextAction) {
        case CARD_ACTIONS.EDIT:
          await this.editCard(selectedCard, selectedCardEntity);
          break;
        case CARD_ACTIONS.DELETE:
          await this.deleteCardInteractive(selectedCard, selectedCardEntity);
          break;
        case CARD_ACTIONS.MOVE:
          await this.moveCardInteractive(selectedCard, boardId, lists);
          break;
      }
    }
  }

  private async editCard(cardId: string, card: CardEntity): Promise<void> {
    const { newName, newDesc } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newName',
        message: t('card.newName'),
        default: card.name,
      },
      {
        type: 'input',
        name: 'newDesc',
        message: t('card.newDescription'),
        default: card.desc || '',
      },
    ]);

    await this.updateCardUseCase.execute(cardId, {
      name: newName,
      desc: newDesc,
    });
    console.log(t('card.updated'));
  }

  private async deleteCardInteractive(
    cardId: string,
    card: CardEntity,
  ): Promise<void> {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: t('card.confirmDelete', { name: card.name }),
        default: false,
      },
    ]);

    if (confirm) {
      await this.deleteCard(cardId);
    }
  }

  private async moveCardInteractive(
    cardId: string,
    currentBoardId: string,
    lists: ListEntity[],
  ): Promise<void> {
    const { targetList } = await inquirer.prompt([
      {
        type: 'list',
        name: 'targetList',
        message: t('card.moveToWhichList'),
        choices: lists.map(list => ({ name: list.name, value: list.id })),
      },
    ]);

    // Encontrar o nome da lista de destino para passar para o método público
    const targetListObj = lists.find(list => list.id === targetList);
    if (targetListObj) {
      await this.moveCard(cardId, targetListObj.name);
    }
  }

  async createCard(
    boardName: string,
    listName: string,
    cardName: string,
    description?: string,
  ): Promise<void> {
    const boards = await this.boardController.getBoards();
    const board = boards.find((b: BoardEntity) => b.name === boardName);

    if (!board) {
      throw new Error(t('board.notFound', { name: boardName }));
    }

    const lists = await this.boardController.getLists(board.id);
    const list = lists.find((l: ListEntity) => l.name === listName);

    if (!list) {
      throw new Error(t('list.notFound', { listName, boardName }));
    }

    const newCard = await this.createCardUseCase.execute({
      name: cardName,
      desc: description || '',
      listId: list.id,
    });

    console.log(t('card.created'));
    console.log(t('card.cardName', { name: newCard.name }));
    console.log(t('card.cardUrl', { url: newCard.url }));
    console.log(t('card.cardId', { id: newCard.id }));
  }

  async moveCard(cardId: string, targetListName: string): Promise<void> {
    // Primeiro precisamos encontrar em qual board o cartão está
    // Para isso, vamos buscar todas as listas de todos os boards
    const boards = await this.boardController.getBoards();

    for (const board of boards) {
      const lists = await this.boardController.getLists(board.id);

      // Verificar se alguma lista contém o cartão
      for (const list of lists) {
        try {
          const cards = await this.boardController.getCards(list.id);
          const card = cards.find((c: CardEntity) => c.id === cardId);

          if (card) {
            // Encontrou o cartão! Agora procurar a lista de destino
            const targetList = lists.find(
              (l: ListEntity) => l.name === targetListName,
            );

            if (!targetList) {
              throw new Error(
                t('list.notFound', {
                  listName: targetListName,
                  boardName: board.name,
                }),
              );
            }

            await this.moveCardUseCase.execute(cardId, targetList.id);
            console.log(t('card.moved'));
            console.log(t('card.cardName', { name: card.name }));
            console.log(t('card.movedTo', { listName: targetList.name }));
            return;
          }
        } catch {
          // Ignorar erros ao buscar cards, continuar procurando
          continue;
        }
      }
    }

    throw new Error(t('card.notFound', { cardId }));
  }

  async deleteCard(cardId: string): Promise<void> {
    // Primeiro precisamos encontrar o cartão para mostrar informações
    const boards = await this.trelloRepository.getBoards();
    let card: CardEntity | undefined;

    for (const board of boards) {
      const lists = await this.trelloRepository.getLists(board.id);

      for (const list of lists) {
        try {
          const cards = await this.trelloRepository.getCards(list.id);
          card = cards.find((c: CardEntity) => c.id === cardId);

          if (card) {
            break;
          }
        } catch {
          continue;
        }
      }
      if (card) {
        break;
      }
    }

    if (!card) {
      throw new Error(t('card.notFound', { cardId }));
    }

    await this.deleteCardUseCase.execute(cardId);
    console.log(t('card.deleted'));
    console.log(t('card.cardName', { name: card.name }));
  }

  async createCardByListId(
    listId: string,
    cardName: string,
    description?: string,
  ): Promise<void> {
    const newCard = await this.createCardUseCase.execute({
      name: cardName,
      desc: description || '',
      listId,
    });

    console.log(t('card.created'));
    console.log(t('card.cardName', { name: newCard.name }));
    console.log(t('card.cardUrl', { url: newCard.url }));
    console.log(t('card.cardId', { id: newCard.id }));
  }

  async updateCard(
    cardId: string,
    name?: string,
    desc?: string,
  ): Promise<void> {
    // Primeiro precisamos encontrar o cartão para mostrar informações
    const boards = await this.trelloRepository.getBoards();
    let card: CardEntity | undefined;

    for (const board of boards) {
      const lists = await this.trelloRepository.getLists(board.id);

      for (const list of lists) {
        try {
          const cards = await this.trelloRepository.getCards(list.id);
          card = cards.find((c: CardEntity) => c.id === cardId);

          if (card) {
            break;
          }
        } catch {
          continue;
        }
      }
      if (card) {
        break;
      }
    }

    if (!card) {
      throw new Error(t('card.notFound', { cardId }));
    }

    const updateData: { name?: string; desc?: string } = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (desc !== undefined) {
      updateData.desc = desc;
    }

    const updatedCard = await this.updateCardUseCase.execute(
      cardId,
      updateData,
    );
    console.log(t('card.updated'));
    console.log(t('card.cardName', { name: updatedCard.name }));
  }

  async showCard(cardId: string): Promise<void> {
    // Get detailed card from the repository
    const card = await this.getCardUseCase.execute(cardId);

    // Try to find board and list names
    const boards = await this.boardController.getBoards();
    let boardName: string | undefined;
    let listName: string | undefined;
    for (const board of boards) {
      const lists = await this.boardController.getLists(board.id);
      const list = lists.find(l => l.id === card.idList);
      if (list) {
        boardName = board.name;
        listName = list.name;
        break;
      }
    }

    this.outputFormatter.message(t('card.cardName', { name: card.name }));
    if (card.desc) {
      this.outputFormatter.message(t('card.cardDescription', { description: card.desc }));
    }
    this.outputFormatter.message(t('card.cardUrl', { url: card.url }));
    this.outputFormatter.message(t('card.cardId', { id: card.id }));
    if (boardName && listName) {
      this.outputFormatter.message(`${t('board.boardName', { name: boardName })} / ${t('list.boardLists', { boardName: listName })}`);
    }

    // Show labels, members and checklists if present
    if (card.labels && card.labels.length > 0) {
      this.outputFormatter.message(t('card.show.labels'));
      this.outputFormatter.output(card.labels);
    }

    if (card.members && card.members.length > 0) {
      this.outputFormatter.message(t('card.show.members'));
      this.outputFormatter.output(card.members);
    }

    if (card.checklists && card.checklists.length > 0) {
      this.outputFormatter.message(t('card.show.checklists'));
      this.outputFormatter.output(card.checklists);
    }

    if (card.attachments && card.attachments.length > 0) {
      this.outputFormatter.message(t('card.show.attachments'));
      this.outputFormatter.output(card.attachments);
    }
  }

  async moveCardToList(cardId: string, targetListId: string): Promise<void> {
    // Primeiro precisamos encontrar o cartão para mostrar informações
    const boards = await this.trelloRepository.getBoards();
    let card: CardEntity | undefined;

    for (const board of boards) {
      const lists = await this.trelloRepository.getLists(board.id);

      for (const list of lists) {
        try {
          const cards = await this.trelloRepository.getCards(list.id);
          card = cards.find((c: CardEntity) => c.id === cardId);

          if (card) {
            break;
          }
        } catch {
          continue;
        }
      }
      if (card) {
        break;
      }
    }

    if (!card) {
      throw new Error(t('card.notFound', { cardId }));
    }

    // Verificar se a lista de destino existe procurando em todos os boards
    let targetList: ListEntity | undefined;
    for (const board of boards) {
      const lists = await this.trelloRepository.getLists(board.id);
      targetList = lists.find((l: ListEntity) => l.id === targetListId);
      if (targetList) {
        break;
      }
    }

    if (!targetList) {
      throw new Error(t('list.notFound', { listId: targetListId }));
    }

    await this.moveCardUseCase.execute(cardId, targetListId);
    console.log(t('card.moved'));
    console.log(t('card.cardName', { name: card.name }));
    console.log(t('card.movedTo', { listName: targetList.name }));
  }
}
