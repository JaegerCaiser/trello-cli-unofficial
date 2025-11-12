import type { CreateCardData, UpdateCardData } from '@domain/entities';
import type { TrelloRepository } from '@domain/repositories';
import { BoardEntity, CardEntity, ListEntity } from '@domain/entities';

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

export class TrelloApiRepository implements TrelloRepository {
  private readonly baseUrl = "https://api.trello.com/1";

  constructor(
    private readonly apiKey: string,
    private readonly token: string
  ) {}

  private async request(
    endpoint: string,
    options?: RequestInit
  ): Promise<unknown> {
    const url = `${this.baseUrl}${endpoint}?key=${this.apiKey}&token=${this.token}`;

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Trello API error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    return response.json();
  }

  private async requestBoards(
    endpoint: string,
    options?: RequestInit
  ): Promise<TrelloBoardResponse[]> {
    const data = await this.request(endpoint, options);
    return data as TrelloBoardResponse[];
  }

  private async requestLists(
    endpoint: string,
    options?: RequestInit
  ): Promise<TrelloListResponse[]> {
    const data = await this.request(endpoint, options);
    return data as TrelloListResponse[];
  }

  private async requestCards(
    endpoint: string,
    options?: RequestInit
  ): Promise<TrelloCardResponse[]> {
    const data = await this.request(endpoint, options);
    return data as TrelloCardResponse[];
  }

  private async requestList(
    endpoint: string,
    options?: RequestInit
  ): Promise<TrelloListResponse> {
    const data = await this.request(endpoint, options);
    return data as TrelloListResponse;
  }

  async getBoards(): Promise<BoardEntity[]> {
    const data = await this.requestBoards("/members/me/boards");
    return data.map((board: TrelloBoardResponse) =>
      BoardEntity.fromApiResponse(board)
    );
  }

  async createBoard(name: string, description?: string): Promise<BoardEntity> {
    const body = new URLSearchParams({
      name,
      desc: description || "",
      key: this.apiKey,
      token: this.token,
    });

    const data = await this.request("/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    return BoardEntity.fromApiResponse(data as TrelloBoardResponse);
  }

  async getLists(boardId: string): Promise<ListEntity[]> {
    const data = await this.requestLists(`/boards/${boardId}/lists`);
    return data.map((list: TrelloListResponse) =>
      ListEntity.fromApiResponse(list)
    );
  }

  async createList(boardId: string, name: string): Promise<ListEntity> {
    const body = new URLSearchParams({
      idBoard: boardId,
      name,
      key: this.apiKey,
      token: this.token,
    });

    const data = await this.request("/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    return ListEntity.fromApiResponse(data as TrelloListResponse);
  }

  async deleteList(listId: string): Promise<void> {
    await this.request(`/lists/${listId}`, {
      method: "DELETE",
    });
  }

  async moveList(listId: string, position: number): Promise<ListEntity> {
    const body = new URLSearchParams({
      pos: position.toString(),
      key: this.apiKey,
      token: this.token,
    });

    const data = await this.requestList(`/lists/${listId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    return ListEntity.fromApiResponse(data);
  }

  async getCards(listId: string): Promise<CardEntity[]> {
    const data = await this.requestCards(`/lists/${listId}/cards`);
    return data.map((card: TrelloCardResponse) =>
      CardEntity.fromApiResponse(card)
    );
  }

  async createCard(cardData: CreateCardData): Promise<CardEntity> {
    const body = new URLSearchParams({
      idList: cardData.listId,
      name: cardData.name,
      desc: cardData.desc || "",
      key: this.apiKey,
      token: this.token,
    });

    const data = await this.request("/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    return CardEntity.fromApiResponse(data as TrelloCardResponse);
  }

  async updateCard(
    cardId: string,
    updates: UpdateCardData
  ): Promise<CardEntity> {
    const body = new URLSearchParams({
      key: this.apiKey,
      token: this.token,
      ...updates,
    });

    const data = await this.request(`/cards/${cardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    return CardEntity.fromApiResponse(data as TrelloCardResponse);
  }

  async deleteCard(cardId: string): Promise<void> {
    await this.request(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  async moveCard(cardId: string, targetListId: string): Promise<CardEntity> {
    return this.updateCard(cardId, { idList: targetListId });
  }
}
