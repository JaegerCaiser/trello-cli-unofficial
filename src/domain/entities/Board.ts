export interface Board {
  id: string;
  name: string;
  url: string;
}

export class BoardEntity implements Board {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly url: string,
  ) {}

  static fromApiResponse(data: any): BoardEntity {
    return new BoardEntity(data.id, data.name, data.url);
  }
}
