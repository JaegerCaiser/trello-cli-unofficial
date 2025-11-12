import { AuthenticationService } from '@domain/services';
import {
  FileConfigRepository,
  TrelloApiRepository,
} from '@infrastructure/repositories';
import { Command } from 'commander';
import { AuthController, BoardController, CardController } from './index';

export class CommandController {
  private authController: AuthController;
  private boardController!: BoardController;
  private cardController!: CardController;
  private program: Command;

  constructor() {
    const configRepository = new FileConfigRepository();
    this.authController = new AuthController(configRepository);
    this.program = new Command();
    this.setupCommands();
  }

  private async initializeTrelloControllers(): Promise<void> {
    await this.authController.ensureAuthenticated();

    const authService = new AuthenticationService(new FileConfigRepository());
    const config = await authService.getConfig();
    const trelloRepository = new TrelloApiRepository(
      config.apiKey,
      config.token!,
    );

    this.boardController = new BoardController(trelloRepository);
    this.cardController = new CardController(
      trelloRepository,
      this.boardController,
    );
  }

  private setupCommands(): void {
    this.program
      .name('trello-cli-unofficial')
      .description('Unofficial Trello CLI using Power-Up authentication')
      .version('1.0.0');

    // Interactive mode
    this.program
      .command('interactive')
      .alias('i')
      .description('Start interactive mode')
      .action(async () => {
        const configRepository = new FileConfigRepository();
        const cli = new (
          await import('./TrelloCliController')
        ).TrelloCliController(configRepository);
        await cli.run();
      });

    // Setup command
    this.program
      .command('setup')
      .description('Setup your Trello token')
      .action(async () => {
        await this.authController.setupToken();
      });

    // Boards subcommands
    const boardsCmd = this.program
      .command('boards')
      .description('Manage Trello boards');

    boardsCmd
      .command('list')
      .description('List all your Trello boards')
      .action(async () => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showBoards();
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    boardsCmd
      .command('create <name>')
      .description('Create a new Trello board')
      .option('-d, --desc <description>', 'Board description')
      .action(async (name: string, options: { desc?: string }) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.createBoard(name, options.desc);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    // Legacy boards command with deprecation warning
    this.program
      .command('boards-legacy')
      .description('[DEPRECATED] Use "boards list" instead')
      .action(async () => {
        console.warn(
          '⚠️  Warning: "boards" command is deprecated. Use "boards list" instead.',
        );
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showBoards();
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    // Lists subcommands
    const listsCmd = this.program
      .command('lists')
      .description('Manage Trello lists');

    listsCmd
      .command('list <boardId>')
      .description('List all lists in a specific board')
      .action(async (boardId: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showListsById(boardId);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    listsCmd
      .command('create <boardId> <name>')
      .description('Create a new list in a specific board')
      .action(async (boardId: string, name: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.createList(boardId, name);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    listsCmd
      .command('delete <listId>')
      .description('Delete a list')
      .action(async (listId: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.deleteList(listId);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    listsCmd
      .command('move <listId> <position>')
      .description('Move a list to a new position')
      .action(async (listId: string, position: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.moveList(
            listId,
            Number.parseInt(position),
          );
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    // Legacy lists command with deprecation warning
    this.program
      .command('lists-legacy <boardName>')
      .description('[DEPRECATED] Use "lists list <boardId>" instead')
      .action(async (boardName: string) => {
        console.warn(
          '⚠️  Warning: "lists <boardName>" command is deprecated. Use "lists list <boardId>" instead.',
        );
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showLists(boardName);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    // Cards subcommands
    const cardsCmd = this.program
      .command('cards')
      .description('Manage Trello cards');

    cardsCmd
      .command('list <listId>')
      .description('List all cards in a specific list')
      .action(async (listId: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showCardsByListId(listId);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    cardsCmd
      .command('create <listId> <name>')
      .description('Create a new card in a specific list')
      .option('-d, --desc <description>', 'Card description')
      .action(
        async (listId: string, name: string, options: { desc?: string }) => {
          try {
            await this.initializeTrelloControllers();
            await this.cardController.createCardByListId(
              listId,
              name,
              options.desc,
            );
          } catch (error) {
            console.error('❌ Erro:', (error as Error).message);
          }
        },
      );

    cardsCmd
      .command('move <cardId>')
      .description('Move a card to a different list')
      .requiredOption('-t, --to <listId>', 'Target list ID')
      .action(async (cardId: string, options: { to: string }) => {
        try {
          await this.initializeTrelloControllers();
          await this.cardController.moveCardToList(cardId, options.to);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    cardsCmd
      .command('delete <cardId>')
      .description('Delete a card')
      .action(async (cardId: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.cardController.deleteCard(cardId);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    cardsCmd
      .command('update <cardId>')
      .description('Update a card')
      .option('-n, --name <name>', 'New card name')
      .option('-d, --desc <description>', 'New card description')
      .action(
        async (cardId: string, options: { name?: string; desc?: string }) => {
          try {
            await this.initializeTrelloControllers();
            await this.cardController.updateCard(
              cardId,
              options.name,
              options.desc,
            );
          } catch (error) {
            console.error('❌ Erro:', (error as Error).message);
          }
        },
      );

    // Legacy commands with deprecation warnings
    this.program
      .command('cards-legacy <boardName> <listName>')
      .description('[DEPRECATED] Use "cards list <listId>" instead')
      .action(async (boardName: string, listName: string) => {
        console.warn(
          '⚠️  Warning: "cards <boardName> <listName>" command is deprecated. Use "cards list <listId>" instead.',
        );
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showCards(boardName, listName);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    this.program
      .command('create-card-legacy <boardName> <listName> <cardName>')
      .description('[DEPRECATED] Use "cards create <listId> <name>" instead')
      .option('-d, --desc <description>', 'Card description')
      .action(
        async (
          boardName: string,
          listName: string,
          cardName: string,
          options: { desc?: string },
        ) => {
          console.warn(
            '⚠️  Warning: "create-card" command is deprecated. Use "cards create <listId> <name>" instead.',
          );
          try {
            await this.initializeTrelloControllers();
            await this.cardController.createCard(
              boardName,
              listName,
              cardName,
              options.desc,
            );
          } catch (error) {
            console.error('❌ Erro:', (error as Error).message);
          }
        },
      );

    this.program
      .command('move-card-legacy <cardId> <listName>')
      .description(
        '[DEPRECATED] Use "cards move <cardId> --to <listId>" instead',
      )
      .action(async (cardId: string, listName: string) => {
        console.warn(
          '⚠️  Warning: "move-card" command is deprecated. Use "cards move <cardId> --to <listId>" instead.',
        );
        try {
          await this.initializeTrelloControllers();
          await this.cardController.moveCard(cardId, listName);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    this.program
      .command('delete-card-legacy <cardId>')
      .description('[DEPRECATED] Use "cards delete <cardId>" instead')
      .action(async (cardId: string) => {
        console.warn(
          '⚠️  Warning: "delete-card" command is deprecated. Use "cards delete <cardId>" instead.',
        );
        try {
          await this.initializeTrelloControllers();
          await this.cardController.deleteCard(cardId);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });
  }

  async run(): Promise<void> {
    // Fallback to interactive mode if no command specified
    if (process.argv.length === 2) {
      const configRepository = new FileConfigRepository();
      const cli = new (
        await import('./TrelloCliController')
      ).TrelloCliController(configRepository);
      await cli.run();
    } else {
      this.program.parse();
    }
  }
}
