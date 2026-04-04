import type { TrelloRepository } from '@domain/repositories';
import type { OutputFormatter } from '@/shared';

import {
  AddChecklistItemUseCase,
  CreateChecklistUseCase,
} from '@application/use-cases';

import { t } from '@/i18n';

export class ChecklistController {
  private createChecklistUseCase: CreateChecklistUseCase;
  private addChecklistItemUseCase: AddChecklistItemUseCase;

  constructor(
    trelloRepository: TrelloRepository,
    private outputFormatter: OutputFormatter,
  ) {
    this.createChecklistUseCase = new CreateChecklistUseCase(trelloRepository);
    this.addChecklistItemUseCase = new AddChecklistItemUseCase(trelloRepository);
  }

  async createChecklist(cardId: string, name: string): Promise<void> {
    const checklist = await this.createChecklistUseCase.execute(cardId, name);

    console.log(t('checklist.created', { name: checklist.name }));
    console.log(t('checklist.checklistId', { id: checklist.id }));
    console.log(t('checklist.checklistCard', { idCard: checklist.idCard }));

    this.outputFormatter.output([checklist], {
      headers: ['ID', 'Name', 'Card ID', 'Items'],
      fields: ['id', 'name', 'idCard', 'checkItems'],
    });
  }

  async addChecklistItem(checklistId: string, name: string): Promise<void> {
    const item = await this.addChecklistItemUseCase.execute(checklistId, name);

    console.log(t('checklist.itemAdded', { name: item.name }));
    console.log(t('checklist.itemId', { id: item.id }));
    console.log(t('checklist.itemState', { state: item.state }));

    this.outputFormatter.output([item], {
      headers: ['ID', 'Name', 'State', 'Checklist ID'],
      fields: ['id', 'name', 'state', 'idChecklist'],
    });
  }
}
