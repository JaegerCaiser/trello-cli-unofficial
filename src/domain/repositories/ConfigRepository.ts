import type { ConfigEntity } from '../entities';

export interface ConfigRepository {
  load: () => Promise<ConfigEntity>;
  save: (config: ConfigEntity) => Promise<void>;
}
