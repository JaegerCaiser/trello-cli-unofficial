export interface List {
  id: string;
  name: string;
}

export class ListEntity implements List {
  constructor(public readonly id: string, public readonly name: string) {}

  static fromApiResponse(data: any): ListEntity {
    return new ListEntity(data.id, data.name);
  }
}
