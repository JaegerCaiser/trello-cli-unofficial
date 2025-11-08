import { Command } from 'commander';
import { FileConfigRepository } from '../../infrastructure/repositories';
import { TrelloCliController } from './TrelloCliController';

export class CommandController {
  private cli: TrelloCliController;
  private program: Command;

  constructor() {
    const configRepository = new FileConfigRepository();
    this.cli = new TrelloCliController(configRepository);
    this.program = new Command();
    this.setupCommands();
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
        await this.cli.showMenu();
      });

    this.program
      .command('boards')
      .description('List all your Trello boards')
      .action(async () => {
        try {
          await this.cli.ensureAuthenticated();
          await this.cli.initializeTrelloUseCases();
          await this.cli.showBoards();
        } catch (error) {
          console.error('❌ Erro:', (error as Error).message);
        }
      });

    this.program
      .command('setup')
      .description('Setup your Trello token')
      .action(async () => {
        await this.cli.setupToken();
      });
  }

  async run(): Promise<void> {
    // Fallback to interactive mode if no command specified
    if (process.argv.length === 2) {
      await this.cli.showMenu();
    } else {
      this.program.parse();
    }
  }
}
