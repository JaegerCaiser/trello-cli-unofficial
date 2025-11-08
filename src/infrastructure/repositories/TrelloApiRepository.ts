import type { CreateCardData, UpdateCardData } from '../../domain/entities';
import type { TrelloRepository } from '../../domain/repositories';
import { BoardEntity, CardEntity, ListEntity } from '../../domain/entities';

export class TrelloApiRepository implements TrelloRepository {
  private readonly baseUrl = 'https://api.trello.com/1';

  constructor(
    private readonly apiKey: string,
    private readonly token: string,
  ) {}

  private async request(endpoint: string, options?: RequestInit): Promise<any> {
    const url = `${this.baseUrl}${endpoint}?key=${this.apiKey}&token=${this.token}`;

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Trello API error: ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    return response.json();
  }

  async getBoards(): Promise<BoardEntity[]> {
    const data = await this.request('/members/me/boards');
    return data.map((board: any) => BoardEntity.fromApiResponse(board));
  }

  async getLists(boardId: string): Promise<ListEntity[]> {
    const data = await this.request(`/boards/${boardId}/lists`);
    return data.map((list: any) => ListEntity.fromApiResponse(list));
  }

  async getCards(listId: string): Promise<CardEntity[]> {
    const data = await this.request(`/lists/${listId}/cards`);
    return data.map((card: any) => CardEntity.fromApiResponse(card));
  }

  async createCard(cardData: CreateCardData): Promise<CardEntity> {
    const body = new URLSearchParams({
      idList: cardData.listId,
      name: cardData.name,
      desc: cardData.desc || '',
      key: this.apiKey,
      token: this.token,
    });

    const data = await this.request('/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    return CardEntity.fromApiResponse(data);
  }

  async updateCard(
    cardId: string,
    updates: UpdateCardData,
  ): Promise<CardEntity> {
    const body = new URLSearchParams({
      key: this.apiKey,
      token: this.token,
      ...updates,
    });

    const data = await this.request(`/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    return CardEntity.fromApiResponse(data);
  }

  async deleteCard(cardId: string): Promise<void> {
    await this.request(`/cards/${cardId}`, {
      method: 'DELETE',
    });
  }

  async moveCard(cardId: string, targetListId: string): Promise<CardEntity> {
    return this.updateCard(cardId, { idList: targetListId });
  }
}
