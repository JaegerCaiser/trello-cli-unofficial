import type { ConfigRepository } from '@domain/repositories';
import path from 'node:path';
import { ConfigEntity } from '@domain/entities';
import fs from 'fs-extra';

export class FileConfigRepository implements ConfigRepository {
  private readonly configDir: string;
  private readonly configFile: string;

  constructor() {
    this.configDir = path.join(
      process.env.HOME || '~',
      '.trello-cli-unofficial',
    );
    this.configFile = path.join(this.configDir, 'config.json');
  }

  async load(): Promise<ConfigEntity> {
    try {
      if (await fs.pathExists(this.configFile)) {
        const data = await fs.readJson(this.configFile);
        return new ConfigEntity(
          data.apiKey || '630a01228b85df706aa520f3611e6490',
          data.token || process.env.TRELLO_TOKEN,
        );
      }
    } catch (error) {
      console.error('Error loading config:', (error as Error).message);
    }

    return ConfigEntity.createDefault();
  }

  async save(config: ConfigEntity): Promise<void> {
    try {
      await fs.ensureDir(this.configDir);
      await fs.writeJson(
        this.configFile,
        {
          apiKey: config.apiKey,
          token: config.token,
        },
        { spaces: 2 },
      );
    } catch (error) {
      console.error('Error saving config:', (error as Error).message);
    }
  }
}
