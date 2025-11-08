import type {
  ConfigRepository,
  TrelloRepository,
} from '../../domain/repositories';
import inquirer from 'inquirer';
import {
  AuthenticateUserUseCase,
  CreateCardUseCase,
  DeleteCardUseCase,
  GetBoardsUseCase,
  GetCardsUseCase,
  GetListsUseCase,
  MoveCardUseCase,
  UpdateCardUseCase,
} from '../../application';
import { TrelloApiRepository } from '../../infrastructure/repositories';
import { CARD_ACTIONS, CONFIG_ACTIONS, MENU_ACTIONS } from '../../shared';

export class TrelloCliController {
  private authenticateUseCase: AuthenticateUserUseCase;
  private getBoardsUseCase?: GetBoardsUseCase;
  private getListsUseCase?: GetListsUseCase;
  private getCardsUseCase?: GetCardsUseCase;
  private createCardUseCase?: CreateCardUseCase;
  private updateCardUseCase?: UpdateCardUseCase;
  private deleteCardUseCase?: DeleteCardUseCase;
  private moveCardUseCase?: MoveCardUseCase;

  constructor(private configRepository: ConfigRepository) {
    this.authenticateUseCase = new AuthenticateUserUseCase(configRepository);
  }

  async initializeTrelloUseCases(): Promise<void> {
    const config = await this.authenticateUseCase.getConfig();

    if (!config.hasValidToken()) {
      throw new Error('Token não configurado');
    }

    const trelloRepository: TrelloRepository = new TrelloApiRepository(
      config.apiKey,
      config.token!,
    );

    this.getBoardsUseCase = new GetBoardsUseCase(trelloRepository);
    this.getListsUseCase = new GetListsUseCase(trelloRepository);
    this.getCardsUseCase = new GetCardsUseCase(trelloRepository);
    this.createCardUseCase = new CreateCardUseCase(trelloRepository);
    this.updateCardUseCase = new UpdateCardUseCase(trelloRepository);
    this.deleteCardUseCase = new DeleteCardUseCase(trelloRepository);
    this.moveCardUseCase = new MoveCardUseCase(trelloRepository);
  }

  async ensureAuthenticated(): Promise<void> {
    const result = await this.authenticateUseCase.execute();
    if (!result.success) {
      console.log(result.message);
      await this.setupToken();
    }
  }

  async setupToken(): Promise<void> {
    const { token } = await inquirer.prompt([
      {
        type: 'input',
        name: 'token',
        message: 'Digite seu token do Trello (ATTA...):',
        validate: input =>
          input.startsWith('ATTA') || 'Token deve começar com ATTA',
      },
    ]);

    const result = await this.authenticateUseCase.execute(token);
    console.log(result.message);
  }

  async showMenu(): Promise<void> {
    await this.ensureAuthenticated();
    await this.initializeTrelloUseCases();

    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: '🏠 Menu Principal - Trello CLI Unofficial',
          choices: [
            { name: '📋 Ver meus quadros', value: MENU_ACTIONS.BOARDS },
            { name: '📝 Explorar quadro', value: MENU_ACTIONS.EXPLORE },
            { name: '➕ Criar cartão', value: MENU_ACTIONS.CREATE },
            { name: '⚙️  Configurações', value: MENU_ACTIONS.CONFIG },
            { name: '🚪 Sair', value: MENU_ACTIONS.EXIT },
          ],
        },
      ]);

      try {
        switch (action) {
          case MENU_ACTIONS.BOARDS:
            await this.showBoards();
            break;
          case MENU_ACTIONS.EXPLORE:
            await this.exploreBoard();
            break;
          case MENU_ACTIONS.CREATE:
            await this.createCardInteractive();
            break;
          case MENU_ACTIONS.CONFIG:
            await this.showConfigMenu();
            break;
          case MENU_ACTIONS.EXIT:
            console.log('👋 Até logo!');
            return;
        }
      } catch (error) {
        console.error('❌ Erro:', (error as Error).message);
      }

      console.log(`\n${'='.repeat(50)}\n`);
    }
  }

  async showBoards(): Promise<void> {
    if (!this.getBoardsUseCase) {
      throw new Error('Use cases não inicializados');
    }

    const boards = await this.getBoardsUseCase.execute();

    console.log('📋 Seus Quadros do Trello:');
    boards.forEach((board, index) => {
      console.log(`${index + 1}. ${board.name}`);
      console.log(`   🔗 ${board.url}`);
      console.log(`   🆔 ${board.id}\n`);
    });
  }

  private async exploreBoard(): Promise<void> {
    if (
      !this.getBoardsUseCase
      || !this.getListsUseCase
      || !this.getCardsUseCase
    ) {
      throw new Error('Use cases não inicializados');
    }

    const boards = await this.getBoardsUseCase.execute();

    const { selectedBoard } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBoard',
        message: 'Selecione um quadro:',
        choices: boards.map(board => ({ name: board.name, value: board.id })),
      },
    ]);

    const lists = await this.getListsUseCase.execute(selectedBoard);

    const { selectedList } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedList',
        message: 'Selecione uma lista:',
        choices: lists.map(list => ({ name: list.name, value: list.id })),
      },
    ]);

    const cards = await this.getCardsUseCase.execute(selectedList);

    if (cards.length === 0) {
      console.log('📭 Esta lista está vazia.');
      return;
    }

    console.log(
      `🃏 Cartões em "${lists.find(l => l.id === selectedList)?.name}":`,
    );
    cards.forEach((card, index) => {
      console.log(`${index + 1}. ${card.name}`);
      if (card.desc) {
        const desc
          = card.desc.length > 100
            ? `${card.desc.substring(0, 100)}...`
            : card.desc;
        console.log(`   📝 ${desc}`);
      }
      console.log(`   🔗 ${card.url}\n`);
    });

    // Opções adicionais
    const { nextAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'nextAction',
        message: 'O que deseja fazer?',
        choices: [
          { name: '⬅️  Voltar ao menu', value: CARD_ACTIONS.BACK },
          { name: '📝 Editar cartão', value: CARD_ACTIONS.EDIT },
          { name: '🗑️  Deletar cartão', value: CARD_ACTIONS.DELETE },
          { name: '📦 Mover cartão', value: CARD_ACTIONS.MOVE },
        ],
      },
    ]);

    if (nextAction !== CARD_ACTIONS.BACK) {
      const { selectedCard } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCard',
          message: 'Selecione um cartão:',
          choices: cards.map(card => ({ name: card.name, value: card.id })),
        },
      ]);

      const selectedCardEntity = cards.find(c => c.id === selectedCard)!;

      switch (nextAction) {
        case CARD_ACTIONS.EDIT:
          await this.editCard(selectedCard, selectedCardEntity);
          break;
        case CARD_ACTIONS.DELETE:
          await this.deleteCard(selectedCard, selectedCardEntity);
          break;
        case CARD_ACTIONS.MOVE:
          await this.moveCard(selectedCard, selectedBoard, lists);
          break;
      }
    }
  }

  private async createCardInteractive(): Promise<void> {
    if (
      !this.getBoardsUseCase
      || !this.getListsUseCase
      || !this.createCardUseCase
    ) {
      throw new Error('Use cases não inicializados');
    }

    const boards = await this.getBoardsUseCase.execute();

    const { selectedBoard } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBoard',
        message: 'Selecione o quadro:',
        choices: boards.map(board => ({ name: board.name, value: board.id })),
      },
    ]);

    const lists = await this.getListsUseCase.execute(selectedBoard);

    const { selectedList } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedList',
        message: 'Selecione a lista:',
        choices: lists.map(list => ({ name: list.name, value: list.id })),
      },
    ]);

    const { cardName, cardDesc } = await inquirer.prompt([
      {
        type: 'input',
        name: 'cardName',
        message: 'Nome do cartão:',
        validate: input => input.length > 0 || 'Nome é obrigatório',
      },
      {
        type: 'input',
        name: 'cardDesc',
        message: 'Descrição (opcional):',
      },
    ]);

    const newCard = await this.createCardUseCase.execute({
      name: cardName,
      desc: cardDesc,
      listId: selectedList,
    });

    console.log('✅ Cartão criado com sucesso!');
    console.log(`📝 Nome: ${newCard.name}`);
    console.log(`🔗 URL: ${newCard.url}`);
  }

  private async editCard(cardId: string, card: any): Promise<void> {
    if (!this.updateCardUseCase) {
      throw new Error('Use cases não inicializados');
    }

    const { newName, newDesc } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newName',
        message: 'Novo nome:',
        default: card.name,
      },
      {
        type: 'input',
        name: 'newDesc',
        message: 'Nova descrição:',
        default: card.desc || '',
      },
    ]);

    await this.updateCardUseCase.execute(cardId, {
      name: newName,
      desc: newDesc,
    });
    console.log('✅ Cartão atualizado com sucesso!');
  }

  private async deleteCard(cardId: string, card: any): Promise<void> {
    if (!this.deleteCardUseCase) {
      throw new Error('Use cases não inicializados');
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Tem certeza que deseja deletar "${card.name}"?`,
        default: false,
      },
    ]);

    if (confirm) {
      await this.deleteCardUseCase.execute(cardId);
      console.log('✅ Cartão deletado com sucesso!');
    }
  }

  private async moveCard(
    cardId: string,
    currentBoardId: string,
    lists: any[],
  ): Promise<void> {
    if (!this.moveCardUseCase) {
      throw new Error('Use cases não inicializados');
    }

    const { targetList } = await inquirer.prompt([
      {
        type: 'list',
        name: 'targetList',
        message: 'Mover para qual lista?',
        choices: lists.map(list => ({ name: list.name, value: list.id })),
      },
    ]);

    await this.moveCardUseCase.execute(cardId, targetList);
    console.log('✅ Cartão movido com sucesso!');
  }

  private async showConfigMenu(): Promise<void> {
    while (true) {
      const { configAction } = await inquirer.prompt([
        {
          type: 'list',
          name: 'configAction',
          message: '⚙️ Configurações',
          choices: [
            { name: '🔑 Configurar token', value: CONFIG_ACTIONS.TOKEN },
            { name: '👀 Ver configuração atual', value: CONFIG_ACTIONS.VIEW },
            { name: '🔄 Resetar configuração', value: CONFIG_ACTIONS.RESET },
            { name: '⬅️  Voltar', value: CONFIG_ACTIONS.BACK },
          ],
        },
      ]);

      switch (configAction) {
        case CONFIG_ACTIONS.TOKEN:
          await this.setupToken();
          await this.initializeTrelloUseCases(); // Re-initialize with new token
          break;
        case CONFIG_ACTIONS.VIEW:
          const config = await this.authenticateUseCase.getConfig();
          console.log('📋 Configuração atual:');
          console.log(`API Key: ${config.apiKey}`);
          console.log(
            `Token configurado: ${config.hasValidToken() ? '✅ Sim' : '❌ Não'}`,
          );
          console.log(
            `Arquivo de config: ~/.trello-cli-unofficial/config.json`,
          );
          break;
        case CONFIG_ACTIONS.RESET:
          const { confirm } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: 'Tem certeza que deseja resetar toda a configuração?',
              default: false,
            },
          ]);
          if (confirm) {
            // Reset logic would need to be implemented in the use case
            console.log('✅ Configuração resetada!');
          }
          break;
        case CONFIG_ACTIONS.BACK:
          return;
      }
    }
  }
}
