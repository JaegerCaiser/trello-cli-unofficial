export interface Board {
  id: string;
  name: string;
  url: string;
}

// API Response types
interface TrelloBoardResponse {
  id: string;
  name: string;
  url: string;
  [key: string]: unknown;
}

export class BoardEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly url: string,
  ) {}

  static fromApiResponse(data: TrelloBoardResponse): BoardEntity {
    return new BoardEntity(data.id, data.name, data.url);
  }
}
