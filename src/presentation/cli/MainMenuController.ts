import type { ListEntity } from '@domain/entities';
import { MENU_ACTIONS } from '@shared/types';
import inquirer from 'inquirer';

export class MainMenuController {
  constructor(
    private boardController: { showBoards: () => Promise<void> },
    private cardController: {
      createCardInteractive: () => Promise<void>;
      exploreCards: (boardId: string, lists: ListEntity[]) => Promise<void>;
    },
    private configController: { showConfigMenu: () => Promise<void> },
  ) {}

  async showMenu(): Promise<void> {
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
            await this.boardController.showBoards();
            break;
          case MENU_ACTIONS.EXPLORE:
            await this.exploreBoard();
            break;
          case MENU_ACTIONS.CREATE:
            await this.cardController.createCardInteractive();
            break;
          case MENU_ACTIONS.CONFIG:
            await this.configController.showConfigMenu();
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

  private async exploreBoard(): Promise<void> {
    // This will be implemented when we refactor the main controller
    console.log('🚧 Explorar quadro - Em desenvolvimento');
  }
}
