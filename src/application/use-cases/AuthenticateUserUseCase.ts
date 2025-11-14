import type { ConfigEntity } from '@domain/entities';
import type { ConfigRepository } from '@domain/repositories';
import { AuthenticationService } from '@domain/services';
import { t } from '@/i18n';

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
          message: t('auth.tokenInvalid'),
        };
      }

      await this.authService.saveToken(token);
      return {
        success: true,
        message: t('auth.tokenSaved'),
      };
    }

    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      return {
        success: true,
        message: t('auth.authenticated'),
      };
    }

    return {
      success: false,
      message: t('auth.notAuthenticated'),
    };
  }

  async getConfig(): Promise<ConfigEntity> {
    return await this.authService.getConfig();
  }
}
