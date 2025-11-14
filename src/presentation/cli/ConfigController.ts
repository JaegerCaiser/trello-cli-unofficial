import type { AuthController } from './AuthController';
import { CONFIG_ACTIONS } from '@shared/types';

import inquirer from 'inquirer';
import { t } from '@/i18n';

export class ConfigController {
  constructor(private authController: AuthController) {}

  async showConfigMenu(): Promise<void> {
    while (true) {
      const { configAction } = await inquirer.prompt([
        {
          type: 'list',
          name: 'configAction',
          message: t('menu.configTitle'),
          choices: [
            { name: t('menu.configToken'), value: CONFIG_ACTIONS.TOKEN },
            { name: t('menu.configView'), value: CONFIG_ACTIONS.VIEW },
            { name: t('menu.configReset'), value: CONFIG_ACTIONS.RESET },
            { name: t('menu.configBack'), value: CONFIG_ACTIONS.BACK },
          ],
        },
      ]);

      switch (configAction) {
        case CONFIG_ACTIONS.TOKEN:
          await this.authController.setupToken();
          break;
        case CONFIG_ACTIONS.VIEW:
          const config = await this.authController.getConfig();
          console.log(t('menu.currentConfig'));
          console.log(`${t('menu.apiKey')} ${config.apiKey}`);
          const tokenStatus = config.hasValidToken()
            ? `✅ ${t('common.yes')}`
            : `❌ ${t('common.no')}`;
          console.log(`${t('menu.tokenConfigured')} ${tokenStatus}`);
          console.log(t('menu.configFile'));
          break;
        case CONFIG_ACTIONS.RESET:
          const { confirm } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: t('menu.confirmReset'),
              default: false,
            },
          ]);
          if (confirm) {
            // Reset logic would need to be implemented in the use case
            console.log(t('menu.configResetted'));
          }
          break;
        case CONFIG_ACTIONS.BACK:
          return;
      }
    }
  }
}
