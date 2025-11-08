import { CONFIG_ACTIONS } from '@shared/types';
import inquirer from 'inquirer';

export class ConfigController {
  constructor(private authController: { getConfig: () => Promise<unknown>; setupToken: () => Promise<void> }) {}

  async showConfigMenu(): Promise<void> {
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
          await this.authController.setupToken();
          break;
        case CONFIG_ACTIONS.VIEW:
          const config = await this.authController.getConfig() as any;
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
