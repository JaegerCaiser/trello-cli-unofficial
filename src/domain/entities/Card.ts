export interface Card {
  id: string;
  name: string;
  desc?: string;
  idList: string;
  url?: string;
  labels?: Array<{ id: string; name?: string; color?: string }>;
  members?: Array<{ id: string; username?: string; fullName?: string }>;
  checklists?: Array<Record<string, unknown>>;
  attachments?: Array<Record<string, unknown>>;
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
  labels?: Array<{ id: string; name?: string; color?: string }>;
  members?: Array<{ id: string; username?: string; fullName?: string }>;
  checklists?: Array<Record<string, unknown>>;
  attachments?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export class CardEntity implements Card {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly idList: string,
    public readonly desc?: string,
    public readonly url?: string,
    public readonly labels?: Array<{ id: string; name?: string; color?: string }>,
    public readonly members?: Array<{ id: string; username?: string; fullName?: string }>,
    public readonly checklists?: Array<Record<string, unknown>>,
    public readonly attachments?: Array<Record<string, unknown>>,
  ) {}

  static fromApiResponse(data: TrelloCardResponse): CardEntity {
    return new CardEntity(
      data.id,
      data.name,
      data.idList,
      data.desc,
      data.url,
      data.labels,
      data.members,
      data.checklists,
      data.attachments,
    );
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
