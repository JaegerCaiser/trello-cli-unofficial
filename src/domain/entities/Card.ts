export interface Card {
  id: string;
  name: string;
  desc?: string;
  idList: string;
  url?: string;
}

export interface CreateCardData {
  name: string;
  desc?: string;
  listId: string;
}

export interface UpdateCardData {
  name?: string;
  desc?: string;
  idList?: string;
}

// API Response types
interface TrelloCardResponse {
  id: string;
  name: string;
  desc?: string;
  idList: string;
  pos: number;
  url?: string;
  [key: string]: unknown;
}

export class CardEntity implements Card {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly idList: string,
    public readonly desc?: string,
    public readonly url?: string,
  ) {}

  static fromApiResponse(data: TrelloCardResponse): CardEntity {
    return new CardEntity(data.id, data.name, data.idList, data.desc, data.url);
  }

  static create(
    data: CreateCardData,
  ): Pick<CardEntity, 'name' | 'desc' | 'idList'> {
    return {
      name: data.name,
      desc: data.desc,
      idList: data.listId,
    };
  }

  update(data: UpdateCardData): CardEntity {
    return new CardEntity(
      this.id,
      data.name ?? this.name,
      data.idList ?? this.idList,
      data.desc ?? this.desc,
      this.url,
    );
  }
}
