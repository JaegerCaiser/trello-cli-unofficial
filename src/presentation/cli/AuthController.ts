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
  }

  async getConfig() {
    return await this.authenticateUseCase.getConfig();
  }
}
