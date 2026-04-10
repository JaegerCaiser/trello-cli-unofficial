import type { CardEntity } from '@domain/entities';
import type { SearchCardsOptions, TrelloRepository } from '@domain/repositories';
import { t } from '@/i18n';

export interface SearchCardsFilters {
  boardId?: string;
  listId?: string;
  labels?: string;
  limit?: number;
  page?: number;
}

export class SearchCardsUseCase {
  constructor(private trelloRepository: TrelloRepository) {}

  async execute(query: string, filters?: SearchCardsFilters): Promise<CardEntity[]> {
    if (!query || query.trim().length === 0) {
      throw new Error(t('card.validation.requiredSearchQuery'));
    }

    let fullQuery = query.trim();
    if (filters?.labels) {
      const labelTerms = filters.labels.split(',').map(l => `label:"${l.trim()}"`).join(' ');
      fullQuery = `${fullQuery} ${labelTerms}`;
    }

    const options: SearchCardsOptions = {
      boardId: filters?.boardId,
      limit: filters?.limit,
      page: filters?.page,
    };

    const results = await this.trelloRepository.searchCards(fullQuery, options);

    if (filters?.listId) {
      return results.filter(card => card.idList === filters.listId);
    }

    return results;
  }
}
