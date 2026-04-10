import type { ConfigEntity } from '@domain/entities';
import type { ConfigRepository } from '@domain/repositories';
import { AuthenticateUserUseCase } from '@application/use-cases';
import inquirer from 'inquirer';
import { t } from '@/i18n';

export class AuthController {
  private authenticateUseCase: AuthenticateUserUseCase;

  constructor(private configRepository: ConfigRepository) {
    this.authenticateUseCase = new AuthenticateUserUseCase(configRepository);
  }

  async ensureAuthenticated(): Promise<void> {
    const result = await this.authenticateUseCase.execute();
    if (!result.success) {
      console.log(t('auth.notAuthenticated'));
      await this.setupToken();
    }
  }

  async setupToken(): Promise<void> {
    console.log(t('auth.tokenHintTitle'));
    console.log(t('auth.tokenHintStep1'));
    console.log(t('auth.tokenHintUrl'));
    console.log(t('auth.tokenHintStep2'));
    console.log(t('auth.tokenHintStep3'));

    try {
      const { token } = await inquirer.prompt([
        {
          type: 'input',
          name: 'token',
          message: t('auth.enterToken'),
          validate: input => input.startsWith('ATTA') || t('auth.tokenInvalid'),
        },
      ]);

      const result = await this.authenticateUseCase.execute(token);
      console.log(result.success ? t('auth.tokenSaved') : result.message);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log(t('auth.setupCancelled'));
        process.exit(0);
      }

      throw error;
    }
  }

  async getConfig(): Promise<ConfigEntity> {
    return await this.authenticateUseCase.getConfig();
  }
}
