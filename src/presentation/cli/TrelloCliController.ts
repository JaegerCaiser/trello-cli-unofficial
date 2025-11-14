import type { ConfigRepository } from '@domain/repositories';
import type { OutputFormatter } from '@/shared';
import { AuthenticationService } from '@domain/services';
import { TrelloApiRepository } from '@infrastructure/repositories';
import {
  AuthController,
  BoardController,
  CardController,
  ConfigController,
  MainMenuController,
} from './index';

export class TrelloCliController {
  private authController!: AuthController;
  private boardController!: BoardController;
  private cardController!: CardController;
  private configController!: ConfigController;
  private mainMenuController!: MainMenuController;

  constructor(
    private configRepository: ConfigRepository,
    private outputFormatter: OutputFormatter,
  ) {
    this.initializeControllers();
  }

  private async initializeControllers(): Promise<void> {
    this.authController = new AuthController(this.configRepository);

    // Ensure we have a valid token before creating TrelloRepository
    await this.authController.ensureAuthenticated();

    const authService = new AuthenticationService(this.configRepository);
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
    this.configController = new ConfigController(this.authController);
    this.mainMenuController = new MainMenuController(
      this.boardController,
      this.cardController,
      this.configController,
    );
  }

  async run(): Promise<void> {
    await this.initializeControllers();
    await this.mainMenuController.showMenu();
  }
}
