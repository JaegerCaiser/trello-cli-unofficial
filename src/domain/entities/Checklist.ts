export interface ChecklistItem {
  id: string;
  name: string;
  state: 'incomplete' | 'complete';
  idChecklist: string;
}

export interface Checklist {
  id: string;
  name: string;
  idCard: string;
  checkItems: ChecklistItem[];
}

interface TrelloChecklistItemResponse {
  id: string;
  name: string;
  state: string;
  idChecklist: string;
  [key: string]: unknown;
}

interface TrelloChecklistResponse {
  id: string;
  name: string;
  idCard: string;
  checkItems: TrelloChecklistItemResponse[];
  [key: string]: unknown;
}

export class ChecklistItemEntity implements ChecklistItem {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly state: 'incomplete' | 'complete',
    public readonly idChecklist: string,
  ) {}

  static fromApiResponse(data: TrelloChecklistItemResponse): ChecklistItemEntity {
    return new ChecklistItemEntity(
      data.id,
      data.name,
      data.state === 'complete' ? 'complete' : 'incomplete',
      data.idChecklist,
    );
  }
}

export class ChecklistEntity implements Checklist {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly idCard: string,
    public readonly checkItems: ChecklistItemEntity[],
  ) {}

  static fromApiResponse(data: TrelloChecklistResponse): ChecklistEntity {
    return new ChecklistEntity(
      data.id,
      data.name,
      data.idCard,
      (data.checkItems || []).map(item => ChecklistItemEntity.fromApiResponse(item)),
    );
  }
}
