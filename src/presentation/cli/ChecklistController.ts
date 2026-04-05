import type { TrelloRepository } from '@domain/repositories';
import type { OutputFormatter } from '@/shared';

import {
  AddChecklistItemUseCase,
  CreateChecklistUseCase,
  DeleteChecklistItemUseCase,
  DeleteChecklistUseCase,
  RenameChecklistItemUseCase,
  RenameChecklistUseCase,
  UpdateChecklistItemStateUseCase,
} from '@application/use-cases';

import { t } from '@/i18n';

export class ChecklistController {
  private createChecklistUseCase: CreateChecklistUseCase;
  private deleteChecklistUseCase: DeleteChecklistUseCase;
  private renameChecklistUseCase: RenameChecklistUseCase;
  private addChecklistItemUseCase: AddChecklistItemUseCase;
  private deleteChecklistItemUseCase: DeleteChecklistItemUseCase;
  private renameChecklistItemUseCase: RenameChecklistItemUseCase;
  private updateChecklistItemStateUseCase: UpdateChecklistItemStateUseCase;

  constructor(
    trelloRepository: TrelloRepository,
    private outputFormatter: OutputFormatter,
  ) {
    this.createChecklistUseCase = new CreateChecklistUseCase(trelloRepository);
    this.deleteChecklistUseCase = new DeleteChecklistUseCase(trelloRepository);
    this.renameChecklistUseCase = new RenameChecklistUseCase(trelloRepository);
    this.addChecklistItemUseCase = new AddChecklistItemUseCase(trelloRepository);
    this.deleteChecklistItemUseCase = new DeleteChecklistItemUseCase(trelloRepository);
    this.renameChecklistItemUseCase = new RenameChecklistItemUseCase(trelloRepository);
    this.updateChecklistItemStateUseCase = new UpdateChecklistItemStateUseCase(trelloRepository);
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

  async deleteChecklist(checklistId: string, force: boolean): Promise<void> {
    if (!force) {
      this.outputFormatter.warning(t('checklist.forceRequired'));
      return;
    }

    await this.deleteChecklistUseCase.execute(checklistId);
    this.outputFormatter.success(t('checklist.deleted'));
  }

  async renameChecklist(checklistId: string, name: string): Promise<void> {
    const checklist = await this.renameChecklistUseCase.execute(checklistId, name);

    this.outputFormatter.success(t('checklist.renamed', { name: checklist.name }));
    console.log(t('checklist.checklistId', { id: checklist.id }));

    this.outputFormatter.output([checklist], {
      headers: ['ID', 'Name', 'Card ID'],
      fields: ['id', 'name', 'idCard'],
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

  async deleteChecklistItem(checklistId: string, itemId: string, force: boolean): Promise<void> {
    if (!force) {
      this.outputFormatter.warning(t('checklist.forceRequired'));
      return;
    }

    await this.deleteChecklistItemUseCase.execute(checklistId, itemId);
    this.outputFormatter.success(t('checklist.itemDeleted'));
  }

  async renameChecklistItem(cardId: string, itemId: string, name: string): Promise<void> {
    const item = await this.renameChecklistItemUseCase.execute(cardId, itemId, name);

    this.outputFormatter.success(t('checklist.itemRenamed', { name: item.name }));
    console.log(t('checklist.itemId', { id: item.id }));
    console.log(t('checklist.itemState', { state: item.state }));

    this.outputFormatter.output([item], {
      headers: ['ID', 'Name', 'State', 'Checklist ID'],
      fields: ['id', 'name', 'state', 'idChecklist'],
    });
  }

  async checkItem(cardId: string, itemId: string): Promise<void> {
    const item = await this.updateChecklistItemStateUseCase.execute(cardId, itemId, 'complete');

    this.outputFormatter.success(t('checklist.itemChecked', { name: item.name }));
    console.log(t('checklist.itemId', { id: item.id }));
    console.log(t('checklist.itemState', { state: item.state }));

    this.outputFormatter.output([item], {
      headers: ['ID', 'Name', 'State', 'Checklist ID'],
      fields: ['id', 'name', 'state', 'idChecklist'],
    });
  }

  async uncheckItem(cardId: string, itemId: string): Promise<void> {
    const item = await this.updateChecklistItemStateUseCase.execute(cardId, itemId, 'incomplete');

    this.outputFormatter.success(t('checklist.itemUnchecked', { name: item.name }));
    console.log(t('checklist.itemId', { id: item.id }));
    console.log(t('checklist.itemState', { state: item.state }));

    this.outputFormatter.output([item], {
      headers: ['ID', 'Name', 'State', 'Checklist ID'],
      fields: ['id', 'name', 'state', 'idChecklist'],
    });
  }
}
