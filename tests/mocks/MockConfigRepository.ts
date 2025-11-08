import type { ConfigRepository } from '@domain/repositories';
import { ConfigEntity } from '@domain/entities';

export class MockConfigRepository implements ConfigRepository {
  private config: ConfigEntity = ConfigEntity.createDefault();

  async load(): Promise<ConfigEntity> {
    return this.config;
  }

  async save(config: ConfigEntity): Promise<void> {
    this.config = config;
  }

  // Helper methods for testing
  setConfig(config: ConfigEntity): void {
    this.config = config;
  }

  getStoredConfig(): ConfigEntity {
    return this.config;
  }

  reset(): void {
    this.config = ConfigEntity.createDefault();
  }
}
