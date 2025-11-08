import type { ConfigRepository } from '../../domain/repositories';
import { AuthenticationService } from '../../domain/services';

export class AuthenticateUserUseCase {
  private authService: AuthenticationService;

  constructor(configRepository: ConfigRepository) {
    this.authService = new AuthenticationService(configRepository);
  }

  async execute(
    token?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (token) {
      if (!this.authService.validateToken(token)) {
        return {
          success: false,
          message:
            '❌ Token inválido. Deve começar com ATTA e ter pelo menos 10 caracteres.',
        };
      }

      await this.authService.saveToken(token);
      return {
        success: true,
        message: '✅ Token configurado com sucesso!',
      };
    }

    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      return {
        success: true,
        message: 'Usuário já autenticado.',
      };
    }

    return {
      success: false,
      message: '🔐 Você precisa configurar seu token do Trello primeiro.',
    };
  }

  async getConfig() {
    return await this.authService.getConfig();
  }
}
