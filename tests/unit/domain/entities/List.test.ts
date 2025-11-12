import { ListEntity } from '@domain/entities';
import { describe, expect, test } from 'bun:test';

describe('ListEntity', () => {
  describe('constructor', () => {
    test('should create a list with all properties', () => {
      const list = new ListEntity('list1', 'To Do');

      expect(list.id).toBe('list1');
      expect(list.name).toBe('To Do');
    });

    test('should have readonly properties', () => {
      const list = new ListEntity('list1', 'To Do');

      // Properties should be readonly (TypeScript enforces this at compile time)
      expect(list).toHaveProperty('id');
      expect(list).toHaveProperty('name');
    });
  });

  describe('fromApiResponse', () => {
    test('should create list from API response', () => {
      const apiData = {
        id: "list123",
        name: "In Progress",
        idBoard: "board1",
        pos: 1,
      };

      const list = ListEntity.fromApiResponse(apiData);

      expect(list.id).toBe('list123');
      expect(list.name).toBe('In Progress');
    });

    test('should handle API response with extra fields', () => {
      const apiData = {
        id: 'list456',
        name: 'Done',
        pos: 1024,
        closed: false,
        idBoard: 'board1',
        subscribed: true,
      };

      const list = ListEntity.fromApiResponse(apiData);

      expect(list.id).toBe('list456');
      expect(list.name).toBe('Done');
    });
  });
});
