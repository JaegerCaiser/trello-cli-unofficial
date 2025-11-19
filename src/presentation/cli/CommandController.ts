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
import { ErrorHandler, OutputFormatter } from '@/shared';
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
    // CRITICAL: Always get version from the CLI's package.json, not from user's cwd
    // This prevents showing wrong version when running inside other Node projects

    // Try relative to this file's directory (when installed globally or locally)
    try {
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = dirname(currentFilePath);

      // When bundled, dist/main.js is at root level, package.json is one level up
      // When unbundled, we're in src/presentation/cli, package.json is three levels up
      const possiblePaths = [
        join(currentDir, '..', 'package.json'), // dist/main.js -> package.json
        join(currentDir, '..', '..', '..', 'package.json'), // src/presentation/cli -> package.json
      ];

      for (const packagePath of possiblePaths) {
        if (existsSync(packagePath)) {
          const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));

          // Verify it's the right package.json by checking the name
          if (packageJson.name === 'trello-cli-unofficial') {
            return packageJson.version;
          }
        }
      }
    }
    catch {
      // Continue to fallback
    }

    // Could not determine package version from installed CLI package.json.
    // Remove hardcoded fallback to avoid showing incorrect versions when
    // the CLI is executed inside other Node projects. Return a neutral
    // unknown version string so callers can handle it explicitly.
    console.warn('⚠️  Could not determine trello-cli-unofficial version from package.json');
    return '0.0.0';
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
      .description(t('commands.boards.manage'))
      .action(async () => {
        // Backward compatibility: when 'boards' is called without subcommand,
        // show deprecation warning and execute 'boards list'
        console.warn(t('commands.deprecated.boardsAliasWarning'));
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.showBoards();
        }, 'boards');
      });

    boardsCmd
      .command('list')
      .description(t('commands.boards.description'))
      .option('-f, --format <format>', t('commands.formatOption'), 'table')
      .action(async (options: { format?: string }) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.boardController.showBoards();
        }, 'boards list');
      });

    boardsCmd
      .command('show <boardId>')
      .description(t('commands.boards.show.description'))
      .option('-f, --format <format>', t('commands.formatOption'), 'table')
      .action(async (boardId: string, options: { format?: string }) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.boardController.showBoardDetails(boardId);
        }, 'boards show');
      });

    boardsCmd
      .command('create <name>')
      .description(t('commands.boards.create.description'))
      .option(
        '-d, --desc <description>',
        t('commands.boards.create.descOption'),
      )
      .action(async (name: string, options: { desc?: string }) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.createBoard(name, options.desc);
        }, 'boards create');
      });

    // Legacy boards command with deprecation warning
    this.program
      .command('boards-legacy')
      .description(t('commands.deprecated.boardsLegacyDescription'))
      .action(async () => {
        console.warn(t('commands.deprecated.boardsLegacyWarning'));
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.showBoards();
        }, 'boards-legacy');
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
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.boardController.showListsById(boardId);
        }, 'lists list');
      });

    listsCmd
      .command('create <boardId> <name>')
      .description(t('commands.lists.create.description'))
      .action(async (boardId: string, name: string) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.createList(boardId, name);
        }, 'lists create');
      });

    listsCmd
      .command('delete <listId>')
      .description(t('commands.lists.delete.description'))
      .action(async (listId: string) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.deleteList(listId);
        }, 'lists delete');
      });

    listsCmd
      .command('move <listId> <position>')
      .description(t('commands.lists.move.description'))
      .action(async (listId: string, position: string) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.moveList(
            listId,
            Number.parseInt(position),
          );
        }, 'lists move');
      });

    // Backward compatibility subcommand for legacy behavior
    listsCmd
      .command('legacy <boardName>')
      .description(t('commands.deprecated.listsAliasDescription'))
      .action(async (boardName: string) => {
        console.warn(t('commands.deprecated.listsAliasWarning'));
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.showLists(boardName);
        }, 'lists legacy');
      });

    // Legacy lists command with deprecation warning
    this.program
      .command('lists-legacy <boardName>')
      .description(t('commands.deprecated.listsLegacyDescription'))
      .action(async (boardName: string) => {
        console.warn(t('commands.deprecated.listsLegacyWarning'));
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.showLists(boardName);
        }, 'lists-legacy');
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
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.boardController.showCardsByListId(listId);
        }, 'cards list');
      });

    cardsCmd
      .command('create <listId> <name>')
      .description(t('commands.cards.create.description'))
      .option('-d, --desc <description>', t('commands.options.cardDescription'))
      .action(
        async (listId: string, name: string, options: { desc?: string }) => {
          await ErrorHandler.withErrorHandling(async () => {
            await this.initializeTrelloControllers();
            await this.cardController.createCardByListId(
              listId,
              name,
              options.desc,
            );
          }, 'cards create');
        },
      );

    cardsCmd
      .command('move <cardId>')
      .description(t('commands.cards.move.description'))
      .requiredOption('-t, --to <listId>', t('commands.options.targetListId'))
      .action(async (cardId: string, options: { to: string }) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.cardController.moveCardToList(cardId, options.to);
        }, 'cards move');
      });

    cardsCmd
      .command('delete <cardId>')
      .description(t('commands.cards.delete.description'))
      .action(async (cardId: string) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.cardController.deleteCard(cardId);
        }, 'cards delete');
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
          await ErrorHandler.withErrorHandling(async () => {
            await this.initializeTrelloControllers();
            await this.cardController.updateCard(
              cardId,
              options.name,
              options.desc,
            );
          }, 'cards update');
        },
      );

    cardsCmd
      .command('show <cardId>')
      .description(t('commands.cards.show.description'))
      .option('-f, --format <format>', t('commands.formatOption'), 'table')
      .action(async (cardId: string, options: { format?: string }) => {
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          if (options.format) {
            this.outputFormatter.setFormat(options.format as OutputFormat);
          }
          await this.cardController.showCard(cardId);
        }, 'cards show');
      });

    // Backward compatibility subcommand for legacy behavior
    cardsCmd
      .command('legacy <boardName> <listName>')
      .description(t('commands.deprecated.cardsAliasDescription'))
      .action(async (boardName: string, listName: string) => {
        console.warn(t('commands.deprecated.cardsAliasWarning'));
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.showCards(boardName, listName);
        }, 'cards legacy');
      });

    // Legacy commands with deprecation warnings
    this.program
      .command('cards-legacy <boardName> <listName>')
      .description(t('commands.deprecated.cardsLegacyDescription'))
      .action(async (boardName: string, listName: string) => {
        console.warn(t('commands.deprecated.cardsLegacyWarning'));
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.boardController.showCards(boardName, listName);
        }, 'cards-legacy');
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
          await ErrorHandler.withErrorHandling(async () => {
            await this.initializeTrelloControllers();
            await this.cardController.createCard(
              boardName,
              listName,
              cardName,
              options.desc,
            );
          }, 'create-card-legacy');
        },
      );

    this.program
      .command('move-card-legacy <cardId> <listName>')
      .description(t('commands.deprecated.moveCardLegacyDescription'))
      .action(async (cardId: string, listName: string) => {
        console.warn(t('commands.deprecated.moveCardLegacyWarning'));
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.cardController.moveCard(cardId, listName);
        }, 'move-card-legacy');
      });

    this.program
      .command('delete-card-legacy <cardId>')
      .description(t('commands.deprecated.deleteCardLegacyDescription'))
      .action(async (cardId: string) => {
        console.warn(t('commands.deprecated.deleteCardLegacyWarning'));
        await ErrorHandler.withErrorHandling(async () => {
          await this.initializeTrelloControllers();
          await this.cardController.deleteCard(cardId);
        }, 'delete-card-legacy');
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
