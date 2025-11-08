import type { ConfigEntity } from '@domain/entities';
import type { ConfigRepository } from '@domain/repositories';

export class AuthenticationService {
  constructor(private configRepository: ConfigRepository) {}

  async getConfig(): Promise<ConfigEntity> {
    return await this.configRepository.load();
  }

  async saveToken(token: string): Promise<ConfigEntity> {
    const config = await this.configRepository.load();
    const updatedConfig = config.withToken(token);
    await this.configRepository.save(updatedConfig);
    return updatedConfig;
  }

  async isAuthenticated(): Promise<boolean> {
    const config = await this.configRepository.load();
    return config.hasValidToken();
  }

  validateToken(token: string): boolean {
    return token.startsWith('ATTA') && token.length > 10;
  }
}
