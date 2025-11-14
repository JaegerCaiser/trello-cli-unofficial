export interface Config {
  apiKey: string;
  token?: string;
}

export class ConfigEntity implements Config {
  constructor(public readonly apiKey: string, public readonly token?: string) {}

  static createDefault(): ConfigEntity {
    return new ConfigEntity(
      process.env.TRELLO_API_KEY || '630a01228b85df706aa520f3611e6490',
    );
  }

  withToken(token: string): ConfigEntity {
    return new ConfigEntity(this.apiKey, token);
  }

  hasValidToken(): boolean {
    return !!(this.token && this.token.startsWith('ATTA'));
  }
}
