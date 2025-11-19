import type { CreateCardData, UpdateCardData } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { BoardEntity, CardEntity, ListEntity } from '@domain/entities';
import { t } from '@/i18n';

// API Response types
interface TrelloBoardResponse {
  id: string;
  name: string;
  url: string;
  [key: string]: unknown;
}

interface TrelloListResponse {
  id: string;
  name: string;
  idBoard: string;
  pos: number;
  [key: string]: unknown;
}

interface TrelloCardResponse {
  id: string;
  name: string;
  desc?: string;
  idList: string;
  pos: number;
  [key: string]: unknown;
}

interface TrelloMemberResponse {
  id: string;
  fullName: string;
  username: string;
  initials: string;
  [key: string]: unknown;
}

interface TrelloLabelResponse {
  id: string;
  name: string;
  color: string;
  [key: string]: unknown;
}

export class TrelloApiRepository implements TrelloRepository {
  private readonly baseUrl = 'https://api.trello.com/1';

  constructor(
    private readonly apiKey: string,
    private readonly token: string,
  ) {}

  private async request(
    endpoint: string,
    options?: RequestInit,
  ): Promise<unknown> {
    // If the endpoint already contains query params, add key/token with & otherwise use ?
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${endpoint}${separator}key=${this.apiKey}&token=${this.token}`;

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `${t('api.trelloError')} ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    return response.json();
  }

  private async requestBoards(
    endpoint: string,
    options?: RequestInit,
  ): Promise<TrelloBoardResponse[]> {
    const data = await this.request(endpoint, options);
    return data as TrelloBoardResponse[];
  }

  private async requestLists(
    endpoint: string,
    options?: RequestInit,
  ): Promise<TrelloListResponse[]> {
    const data = await this.request(endpoint, options);
    return data as TrelloListResponse[];
  }

  private async requestCards(
    endpoint: string,
    options?: RequestInit,
  ): Promise<TrelloCardResponse[]> {
    const data = await this.request(endpoint, options);
    return data as TrelloCardResponse[];
  }

  private async requestList(
    endpoint: string,
    options?: RequestInit,
  ): Promise<TrelloListResponse> {
    const data = await this.request(endpoint, options);
    return data as TrelloListResponse;
  }

  async getBoards(): Promise<BoardEntity[]> {
    const data = await this.requestBoards('/members/me/boards');
    return data.map((board: TrelloBoardResponse) =>
      BoardEntity.fromApiResponse(board),
    );
  }

  async getBoardMembers(boardId: string): Promise<import('@domain/repositories').BoardMember[]> {
    const data = await this.request(`/boards/${boardId}/members`);
    return (data as TrelloMemberResponse[]).map((member: TrelloMemberResponse) => ({
      id: member.id,
      fullName: member.fullName,
      username: member.username,
      initials: member.initials,
    }));
  }

  async getBoardLabels(boardId: string): Promise<import('@domain/repositories').BoardLabel[]> {
    const data = await this.request(`/boards/${boardId}/labels`);
    return (data as TrelloLabelResponse[]).map((label: TrelloLabelResponse) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    }));
  }

  async createBoard(name: string, description?: string): Promise<BoardEntity> {
    const body = new URLSearchParams({
      name,
      desc: description || '',
      key: this.apiKey,
      token: this.token,
    });

    const data = await this.request('/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    return BoardEntity.fromApiResponse(data as TrelloBoardResponse);
  }

  async getLists(boardId: string): Promise<ListEntity[]> {
    const data = await this.requestLists(`/boards/${boardId}/lists`);
    return data.map((list: TrelloListResponse) =>
      ListEntity.fromApiResponse(list),
    );
  }

  async createList(boardId: string, name: string): Promise<ListEntity> {
    const body = new URLSearchParams({
      idBoard: boardId,
      name,
      key: this.apiKey,
      token: this.token,
    });

    const data = await this.request('/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    return ListEntity.fromApiResponse(data as TrelloListResponse);
  }

  async deleteList(listId: string): Promise<void> {
    // Primeiro, fechar (arquivar) a lista
    const closeBody = new URLSearchParams({
      closed: 'true',
      key: this.apiKey,
      token: this.token,
    });

    await this.request(`/lists/${listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: closeBody.toString(),
    });

    // Depois, deletar a lista
    await this.request(`/lists/${listId}`, {
      method: 'DELETE',
    });
  }

  async moveList(listId: string, position: number): Promise<ListEntity> {
    const body = new URLSearchParams({
      pos: position.toString(),
      key: this.apiKey,
      token: this.token,
    });

    const data = await this.requestList(`/lists/${listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    return ListEntity.fromApiResponse(data);
  }

  async getCards(listId: string): Promise<CardEntity[]> {
    const data = await this.requestCards(`/lists/${listId}/cards`);
    return data.map((card: TrelloCardResponse) =>
      CardEntity.fromApiResponse(card),
    );
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

    return CardEntity.fromApiResponse(data as TrelloCardResponse);
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

    return CardEntity.fromApiResponse(data as TrelloCardResponse);
  }

  async deleteCard(cardId: string): Promise<void> {
    await this.request(`/cards/${cardId}`, {
      method: 'DELETE',
    });
  }

  async moveCard(cardId: string, targetListId: string): Promise<CardEntity> {
    return this.updateCard(cardId, { idList: targetListId });
  }

  async getCard(cardId: string): Promise<CardEntity> {
    // Request the card with details: members, checklists and attachments
    const endpoint = `/cards/${cardId}?checklists=all&members=true&attachments=true`;
    const data = await this.request(endpoint);
    return CardEntity.fromApiResponse(data as TrelloCardResponse);
  }
}
