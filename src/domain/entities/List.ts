export interface List {
  id: string;
  name: string;
}

// API Response types
interface TrelloListResponse {
  id: string;
  name: string;
  idBoard: string;
  pos: number;
  [key: string]: unknown;
}

export class ListEntity implements List {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  static fromApiResponse(data: TrelloListResponse): ListEntity {
    return new ListEntity(data.id, data.name);
  }
}
