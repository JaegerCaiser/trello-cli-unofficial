import { ConfigEntity } from '@domain/entities';
import { describe, expect, test } from 'bun:test';

describe('ConfigEntity', () => {
  describe('createDefault', () => {
    test('should create config with default API key', () => {
      // Set environment variable for test
      process.env.TRELLO_API_KEY = '630a01228b85df706aa520f3611e6490';

      const config = ConfigEntity.createDefault();

      expect(config.apiKey).toBe('630a01228b85df706aa520f3611e6490');
      expect(config.token).toBeUndefined();

      // Clean up
      delete process.env.TRELLO_API_KEY;
    });
  });

  describe('withToken', () => {
    test('should create new config with token', () => {
      const config = ConfigEntity.createDefault();
      const withToken = config.withToken('ATTA-test-token');

      expect(withToken.token).toBe('ATTA-test-token');
      expect(withToken.apiKey).toBe(config.apiKey);
    });

    test('should not mutate original config', () => {
      const config = ConfigEntity.createDefault();
      const withToken = config.withToken('ATTA-test-token');

      expect(config.token).toBeUndefined();
      expect(withToken.token).toBe('ATTA-test-token');
    });
  });

  describe('hasValidToken', () => {
    test('should return true for valid ATTA token', () => {
      const config = new ConfigEntity('test-key', 'ATTA-valid-token-123');

      expect(config.hasValidToken()).toBe(true);
    });

    test('should return false for token not starting with ATTA', () => {
      const config = new ConfigEntity('test-key', 'invalid-token');

      expect(config.hasValidToken()).toBe(false);
    });

    test('should return false when token is undefined', () => {
      const config = ConfigEntity.createDefault();

      expect(config.hasValidToken()).toBe(false);
    });

    test('should return false for empty token', () => {
      const config = new ConfigEntity('test-key', '');

      expect(config.hasValidToken()).toBe(false);
    });
  });
});
