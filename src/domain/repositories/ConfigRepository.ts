import type { ConfigEntity } from '@domain/entities';

export interface ConfigRepository {
  load: () => Promise<ConfigEntity>;
  save: (config: ConfigEntity) => Promise<void>;
}
