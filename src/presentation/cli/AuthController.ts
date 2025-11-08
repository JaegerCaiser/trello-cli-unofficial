import type { ConfigRepository } from '@domain/repositories';
import { AuthenticateUserUseCase } from '@application/use-cases';
import inquirer from 'inquirer';

export class AuthController {
  private authenticateUseCase: AuthenticateUserUseCase;

  constructor(private configRepository: ConfigRepository) {
    this.authenticateUseCase = new AuthenticateUserUseCase(configRepository);
  }

  async ensureAuthenticated(): Promise<void> {
    const result = await this.authenticateUseCase.execute();
    if (!result.success) {
      console.log(result.message);
      await this.setupToken();
    }
  }

  async setupToken(): Promise<void> {
    const { token } = await inquirer.prompt([
      {
        type: 'input',
        name: 'token',
        message: 'Digite seu token do Trello (ATTA...):',
        validate: input =>
          input.startsWith('ATTA') || 'Token deve começar com ATTA',
      },
    ]);

    const result = await this.authenticateUseCase.execute(token);
    console.log(result.message);
  }

  async getConfig() {
    return await this.authenticateUseCase.getConfig();
  }
}
