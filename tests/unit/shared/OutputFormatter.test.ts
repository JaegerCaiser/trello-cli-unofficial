import { describe, expect, test } from 'bun:test';
import { OutputFormatter } from '@/shared';

describe('OutputFormatter', () => {
  describe('constructor', () => {
    test('should create with default format "table"', () => {
      const formatter = new OutputFormatter();
      expect(formatter).toBeInstanceOf(OutputFormatter);
    });

    test('should create with specified format', () => {
      const formatter = new OutputFormatter('json');
      expect(formatter).toBeInstanceOf(OutputFormatter);
    });
  });

  describe('setFormat', () => {
    test('should change format', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      formatter.setFormat('json');
      formatter.output({ test: 'data' });
      expect(logs[0]).toBe('{\n  "test": "data"\n}');
      console.log = originalLog;
    });
  });

  describe('output', () => {
    test('should output in table format by default', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [{ name: 'Test', value: 123 }];
      formatter.output(data);
      expect(logs.length).toBe(3);
      console.log = originalLog;
    });

    test('should output in json format', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = { name: 'Test', value: 123 };
      formatter.output(data, { format: 'json' });
      expect(logs[0]).toBe('{\n  "name": "Test",\n  "value": 123\n}');
      console.log = originalLog;
    });

    test('should output in csv format', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [{ name: 'Test', value: 123 }];
      formatter.output(data, { format: 'csv' });
      expect(logs[0]).toBe('name,value');
      expect(logs[1]).toBe('Test,123');
      console.log = originalLog;
    });
  });

  describe('outputJson', () => {
    test('should output single object as JSON', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = { name: 'Test', value: 123 };
      (formatter as any).outputJson(data);
      expect(logs[0]).toBe('{\n  "name": "Test",\n  "value": 123\n}');
      console.log = originalLog;
    });

    test('should output array as JSON', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [{ name: 'Test1' }, { name: 'Test2' }];
      (formatter as any).outputJson(data);
      expect(logs[0]).toBe('[\n  {\n    "name": "Test1"\n  },\n  {\n    "name": "Test2"\n  }\n]');
      console.log = originalLog;
    });
  });

  describe('outputCsv', () => {
    test('should output CSV with headers and data', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [
        { name: 'Test1', value: 123 },
        { name: 'Test2', value: 456 },
      ];
      (formatter as any).outputCsv(data);
      expect(logs[0]).toBe('name,value');
      expect(logs[1]).toBe('Test1,123');
      expect(logs[2]).toBe('Test2,456');
      console.log = originalLog;
    });

    test('should handle empty array', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data: any[] = [];
      (formatter as any).outputCsv(data);
      expect(logs[0]).toBe('No data to display');
      console.log = originalLog;
    });

    test('should escape commas in CSV', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [{ name: 'Test, with comma', value: 123 }];
      (formatter as any).outputCsv(data);
      expect(logs[0]).toBe('name,value');
      expect(logs[1]).toBe('"Test, with comma",123');
      console.log = originalLog;
    });

    test('should escape quotes in CSV', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [{ name: 'Test "with" quotes', value: 123 }];
      (formatter as any).outputCsv(data);
      expect(logs[0]).toBe('name,value');
      expect(logs[1]).toBe('"Test ""with"" quotes",123');
      console.log = originalLog;
    });

    test('should escape newlines in CSV', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [{ name: 'Test\nwith\nnewlines', value: 123 }];
      (formatter as any).outputCsv(data);
      expect(logs[0]).toBe('name,value');
      expect(logs[1]).toBe('"Test\nwith\nnewlines",123');
      console.log = originalLog;
    });

    test('should use custom headers and fields', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [{ name: 'Test', value: 123, extra: 'ignore' }];
      (formatter as any).outputCsv(data, {
        headers: ['Nome', 'Valor'],
        fields: ['name', 'value'],
      });
      expect(logs[0]).toBe('Nome,Valor');
      expect(logs[1]).toBe('Test,123');
      console.log = originalLog;
    });
  });

  describe('outputTable', () => {
    test('should output table with headers and data', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [
        { name: 'Test1', value: 123 },
        { name: 'Test2', value: 456 },
      ];
      (formatter as any).outputTable(data);
      expect(logs.length).toBe(4);
      console.log = originalLog;
    });

    test('should handle empty array', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data: any[] = [];
      (formatter as any).outputTable(data);
      expect(logs[0]).toBe('No data to display');
      console.log = originalLog;
    });

    test('should use custom headers and fields', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      const data = [{ name: 'Test', value: 123 }];
      (formatter as any).outputTable(data, {
        headers: ['Nome', 'Valor'],
        fields: ['name', 'value'],
      });
      expect(logs[0]).toContain('Nome');
      expect(logs[0]).toContain('Valor');
      console.log = originalLog;
    });
  });

  describe('toPlainObject', () => {
    test('should return plain object as is', () => {
      const formatter = new OutputFormatter();
      const obj = { name: 'Test', value: 123 };
      const result = (formatter as any).toPlainObject(obj);
      expect(result).toEqual(obj);
    });

    test('should convert class instance to plain object', () => {
      const formatter = new OutputFormatter();
      class TestClass {
        name = 'Test';
        value = 123;
      }
      const instance = new TestClass();
      const result = (formatter as any).toPlainObject(instance);
      expect(result).toEqual({ name: 'Test', value: 123 });
    });

    test('should handle null and undefined', () => {
      const formatter = new OutputFormatter();
      expect((formatter as any).toPlainObject(null)).toEqual({});
      expect((formatter as any).toPlainObject(undefined)).toEqual({});
    });
  });

  describe('message helpers', () => {
    test('message should output plain message', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      formatter.message('Test message');
      expect(logs[0]).toBe('Test message');
      console.log = originalLog;
    });

    test('error should output with error emoji', () => {
      const formatter = new OutputFormatter();
      const originalError = console.error;
      const errors: string[] = [];
      console.error = (...args) => errors.push(args.join(' '));
      formatter.error('Test error');
      expect(errors[0]).toBe('❌ Test error');
      console.error = originalError;
    });

    test('success should output with success emoji', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      formatter.success('Test success');
      expect(logs[0]).toBe('✅ Test success');
      console.log = originalLog;
    });

    test('warning should output with warning emoji', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      formatter.warning('Test warning');
      expect(logs[0]).toBe('⚠️  Test warning');
      console.log = originalLog;
    });

    test('info should output with info emoji', () => {
      const formatter = new OutputFormatter();
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => logs.push(args.join(' '));
      formatter.info('Test info');
      expect(logs[0]).toBe('ℹ️  Test info');
      console.log = originalLog;
    });
  });
});
