import type { OutputFormat } from '@/shared';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AuthenticationService } from '@domain/services';
import {
  FileConfigRepository,
  TrelloApiRepository,
} from '@infrastructure/repositories';
import { Command } from 'commander';

import { t } from '@/i18n';
import { OutputFormatter } from '@/shared';
import { AuthController, BoardController, CardController } from './index';

export class CommandController {
  private authController: AuthController;
  private boardController!: BoardController;
  private cardController!: CardController;
  private program: Command;
  private outputFormatter: OutputFormatter;

  constructor() {
    const configRepository = new FileConfigRepository();
    this.authController = new AuthController(configRepository);
    this.program = new Command();
    this.outputFormatter = new OutputFormatter();
    this.initializeProgram();
    this.setupCommands();
  }

  private initializeProgram(): void {
    // Ensure program is properly initialized
    if (!this.program) {
      this.program = new Command();
    }
  }

  private getVersion(): string {
    // Try multiple approaches to find package.json (robust for different environments)

    // 1. Try relative to current working directory (development)
    const cwdPackageJson = join(process.cwd(), 'package.json');
    if (existsSync(cwdPackageJson)) {
      try {
        const packageJson = JSON.parse(readFileSync(cwdPackageJson, 'utf-8'));
        return packageJson.version;
      }
      catch {
        // Continue to next approach
      }
    }

    // 2. Try relative to this file's directory (when installed globally)
    try {
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = dirname(currentFilePath);
      const installedPackageJson = join(currentDir, '..', '..', '..', '..', 'package.json');

      if (existsSync(installedPackageJson)) {
        const packageJson = JSON.parse(readFileSync(installedPackageJson, 'utf-8'));
        return packageJson.version;
      }
    }
    catch {
      // Continue to fallback
    }

    // 3. Fallback to hardcoded version
    return '0.11.10';
  }

  private async initializeTrelloControllers(): Promise<void> {
    await this.authController.ensureAuthenticated();

    const authService = new AuthenticationService(new FileConfigRepository());
    const config = await authService.getConfig();
    const trelloRepository = new TrelloApiRepository(
      config.apiKey,
      config.token!,
    );

    this.boardController = new BoardController(
      trelloRepository,
      this.outputFormatter,
    );
    this.cardController = new CardController(
      trelloRepository,
      this.boardController,
      this.outputFormatter,
    );
  }

  private setupCommands(): void {
    // Ensure program is initialized
    if (!this.program) {
      throw new Error(t('errors.programNotInitialized'));
    }

    // Get version using robust method
    const version = this.getVersion();

    this.program
      .name('trello-cli-unofficial')
      .description(t('commands.description'))
      .version(version)
      .option('-f, --format <format>', t('commands.formatOption'), 'table')
      .option('-v', t('commands.versionOption'))
      .option('--verbose', t('commands.verboseOption'))
      .on('option:format', (format: string) => {
        this.outputFormatter.setFormat(format as OutputFormat);
      })
      .on('option:v', () => {
        console.log(version);
        process.exit(0);
      })
      .on('option:verbose', () => {
        // Enable verbose error reporting
        process.env.VERBOSE_ERRORS = 'true';
      });

    // Interactive mode
    this.program
      .command('interactive')
      .alias('i')
      .description(t('commands.interactive.description'))
      .action(async () => {
        const configRepository = new FileConfigRepository();
        const cli = new (
          await import('./TrelloCliController')
        ).TrelloCliController(configRepository, this.outputFormatter);
        await cli.run();
      });

    // Setup command
    this.program
      .command('setup')
      .description(t('commands.setup.description'))
      .action(async () => {
        await this.authController.setupToken();
      });

    // Boards subcommands
    const boardsCmd = this.program
      .command('boards')
      .description(t('commands.boards.manage'));

    boardsCmd
      .command('list')
      .description(t('commands.boards.description'))
      .option('-f, --format <format>', t('commands.formatOption'), 'table')
      .action(async (options: { format?: string }) => {
        try {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.boardController.showBoards();
        } catch (error) {
          console.error(
            t('commands.commandErrors.genericError'),
            (error as Error).message,
          );
        }
      });

    boardsCmd
      .command('show <boardId>')
      .description(t('commands.boards.show.description'))
      .option('-f, --format <format>', t('commands.formatOption'), 'table')
      .action(async (boardId: string, options: { format?: string }) => {
        try {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.boardController.showBoardDetails(boardId);
        } catch (error) {
          console.error(t('commands.commandErrors.genericError'), (error as Error).message);
        }
      });

    boardsCmd
      .command('create <name>')
      .description(t('commands.boards.create.description'))
      .option(
        '-d, --desc <description>',
        t('commands.boards.create.descOption'),
      )
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
      .description(t('commands.deprecated.boardsLegacyDescription'))
      .action(async () => {
        console.warn(t('commands.deprecated.boardsLegacyWarning'));
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showBoards();
        } catch (error) {
          console.error(
            t('commands.deprecated.boardsLegacyError'),
            (error as Error).message,
          );
        }
      });

    // Lists subcommands
    const listsCmd = this.program
      .command('lists')
      .description(t('commands.lists.description'));

    listsCmd
      .command('list <boardId>')
      .description(t('commands.lists.list.description'))
      .option('-f, --format <format>', t('commands.formatOption'), 'table')
      .action(async (boardId: string, options: { format?: string }) => {
        try {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.boardController.showListsById(boardId);
        } catch (error) {
          console.error(t('commands.commandErrors.genericError'), (error as Error).message);
        }
      });

    listsCmd
      .command('create <boardId> <name>')
      .description(t('commands.lists.create.description'))
      .action(async (boardId: string, name: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.createList(boardId, name);
        } catch (error) {
          console.error(
            t('commands.commandErrors.genericError'),
            (error as Error).message,
          );
        }
      });

    listsCmd
      .command('delete <listId>')
      .description(t('commands.lists.delete.description'))
      .action(async (listId: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.deleteList(listId);
        } catch (error) {
          console.error(
            t('commands.commandErrors.genericError'),
            (error as Error).message,
          );
        }
      });

    listsCmd
      .command('move <listId> <position>')
      .description(t('commands.lists.move.description'))
      .action(async (listId: string, position: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.boardController.moveList(
            listId,
            Number.parseInt(position),
          );
        } catch (error) {
          console.error(
            t('commands.commandErrors.genericError'),
            (error as Error).message,
          );
        }
      });

    // Legacy lists command with deprecation warning
    this.program
      .command('lists-legacy <boardName>')
      .description(t('commands.deprecated.listsLegacyDescription'))
      .action(async (boardName: string) => {
        console.warn(t('commands.deprecated.listsLegacyWarning'));
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showLists(boardName);
        } catch (error) {
          console.error(
            t('commands.deprecated.listsLegacyError'),
            (error as Error).message,
          );
        }
      });

    // Cards subcommands
    const cardsCmd = this.program
      .command('cards')
      .description(t('commands.cards.manage'));

    cardsCmd
      .command('list <listId>')
      .description(t('commands.cards.list.description'))
      .option('-f, --format <format>', t('commands.formatOption'), 'table')
      .action(async (listId: string, options: { format?: string }) => {
        try {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.boardController.showCardsByListId(listId);
        } catch (error) {
          console.error(t('commands.commandErrors.genericError'), (error as Error).message);
        }
      });

    cardsCmd
      .command('create <listId> <name>')
      .description(t('commands.cards.create.description'))
      .option('-d, --desc <description>', t('commands.options.cardDescription'))
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
            console.error(
              t('commands.commandErrors.genericError'),
              (error as Error).message,
            );
          }
        },
      );

    cardsCmd
      .command('move <cardId>')
      .description(t('commands.cards.move.description'))
      .requiredOption('-t, --to <listId>', t('commands.options.targetListId'))
      .action(async (cardId: string, options: { to: string }) => {
        try {
          await this.initializeTrelloControllers();
          await this.cardController.moveCardToList(cardId, options.to);
        } catch (error) {
          console.error(
            t('commands.commandErrors.genericError'),
            (error as Error).message,
          );
        }
      });

    cardsCmd
      .command('delete <cardId>')
      .description(t('commands.cards.delete.description'))
      .action(async (cardId: string) => {
        try {
          await this.initializeTrelloControllers();
          await this.cardController.deleteCard(cardId);
        } catch (error) {
          console.error(
            t('commands.commandErrors.genericError'),
            (error as Error).message,
          );
        }
      });

    cardsCmd
      .command('update <cardId>')
      .description(t('commands.cards.update.description'))
      .option('-n, --name <name>', t('commands.options.newCardName'))
      .option(
        '-d, --desc <description>',
        t('commands.options.newCardDescription'),
      )
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
            console.error(
              t('commands.commandErrors.genericError'),
              (error as Error).message,
            );
          }
        },
      );

    // Legacy commands with deprecation warnings
    this.program
      .command('cards-legacy <boardName> <listName>')
      .description(t('commands.deprecated.cardsLegacyDescription'))
      .action(async (boardName: string, listName: string) => {
        console.warn(t('commands.deprecated.cardsLegacyWarning'));
        try {
          await this.initializeTrelloControllers();
          await this.boardController.showCards(boardName, listName);
        } catch (error) {
          console.error(
            t('commands.deprecated.cardsLegacyError'),
            (error as Error).message,
          );
        }
      });

    this.program
      .command('create-card-legacy <boardName> <listName> <cardName>')
      .description(t('commands.deprecated.createCardLegacyDescription'))
      .option('-d, --desc <description>', t('commands.options.cardDescription'))
      .action(
        async (
          boardName: string,
          listName: string,
          cardName: string,
          options: { desc?: string },
        ) => {
          console.warn(t('commands.deprecated.createCardLegacyWarning'));
          try {
            await this.initializeTrelloControllers();
            await this.cardController.createCard(
              boardName,
              listName,
              cardName,
              options.desc,
            );
          } catch (error) {
            console.error(
              t('commands.commandErrors.genericError'),
              (error as Error).message,
            );
          }
        },
      );

    this.program
      .command('move-card-legacy <cardId> <listName>')
      .description(t('commands.deprecated.moveCardLegacyDescription'))
      .action(async (cardId: string, listName: string) => {
        console.warn(t('commands.deprecated.moveCardLegacyWarning'));
        try {
          await this.initializeTrelloControllers();
          await this.cardController.moveCard(cardId, listName);
        } catch (error) {
          console.error(
            t('commands.commandErrors.genericError'),
            (error as Error).message,
          );
        }
      });

    this.program
      .command('delete-card-legacy <cardId>')
      .description(t('commands.deprecated.deleteCardLegacyDescription'))
      .action(async (cardId: string) => {
        console.warn(t('commands.deprecated.deleteCardLegacyWarning'));
        try {
          await this.initializeTrelloControllers();
          await this.cardController.deleteCard(cardId);
        } catch (error) {
          console.error(
            t('commands.commandErrors.genericError'),
            (error as Error).message,
          );
        }
      });
  }

  async run(): Promise<void> {
    // Ensure program is initialized before parsing
    if (!this.program) {
      this.initializeProgram();
      this.setupCommands();
    }

    // Fallback to interactive mode if no command specified
    if (process.argv.length === 2) {
      const configRepository = new FileConfigRepository();
      const cli = new (
        await import('./TrelloCliController')
      ).TrelloCliController(configRepository, this.outputFormatter);
      await cli.run();
    } else {
      this.program.parse();
    }
  }
}
