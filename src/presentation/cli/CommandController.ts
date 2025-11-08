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

    this.program
      .command('boards')
      .description('List all your Trello boards')
      .action(async () => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showBoards();
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    this.program
      .command('setup')
      .description('Setup your Trello token')
      .action(async () => {
        await this.authController.setupToken();
      });

    this.program
      .command('lists <boardName>')
      .description('List all lists in a specific board')
      .action(async (boardName: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showLists(boardName);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    this.program
      .command('cards <boardName> <listName>')
      .description('List all cards in a specific list')
      .action(async (boardName: string, listName: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showCards(boardName, listName);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    this.program
      .command('create-card <boardName> <listName> <cardName>')
      .description('Create a new card in a specific board and list')
      .option('-d, --desc <description>', 'Card description')
      .action(
        async (
          boardName: string,
          listName: string,
          cardName: string,
          options: { desc?: string },
        ) => {
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
      .command('move-card <cardId> <listName>')
      .description('Move a card to a different list')
      .action(async (cardId: string, listName: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.cardController.moveCard(cardId, listName);
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    this.program
      .command('delete-card <cardId>')
      .description('Delete a card by its ID')
      .action(async (cardId: string) => {
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
