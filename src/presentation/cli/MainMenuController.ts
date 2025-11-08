import type { ListEntity } from '@domain/entities';

import { MENU_ACTIONS } from '@shared/types';

import inquirer from 'inquirer';
import { t } from '@/i18n';

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
          message: t('menu.title'),
          choices: [
            { name: t('menu.boards'), value: MENU_ACTIONS.BOARDS },
            { name: t('menu.explore'), value: MENU_ACTIONS.EXPLORE },
            { name: t('menu.create'), value: MENU_ACTIONS.CREATE },
            { name: t('menu.config'), value: MENU_ACTIONS.CONFIG },
            { name: t('menu.exit'), value: MENU_ACTIONS.EXIT },
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
            console.log(t('menu.goodbye'));
            return;
        }
      } catch (error) {
        console.error(t('errors.generic'), (error as Error).message);
      }

      console.log(`\n${'='.repeat(50)}\n`);
    }
  }

  private async exploreBoard(): Promise<void> {
    // This will be implemented when we refactor the main controller
    console.log(t('menu.exploreInDevelopment'));
  }
}
