import { beforeEach, describe, expect, test } from 'bun:test';
import { ConfigEntity } from '../../../../src/domain/entities';
import { AuthenticationService } from '../../../../src/domain/services';
import { MockConfigRepository } from '../../../mocks';

describe('AuthenticationService', () => {
  let mockConfigRepo: MockConfigRepository;
  let authService: AuthenticationService;

  beforeEach(() => {
    mockConfigRepo = new MockConfigRepository();
    authService = new AuthenticationService(mockConfigRepo);
  });

  describe('getConfig', () => {
    test('should return current config', async () => {
      const config = await authService.getConfig();

      expect(config).toBeInstanceOf(ConfigEntity);
      expect(config.apiKey).toBe('630a01228b85df706aa520f3611e6490');
    });
  });

  describe('saveToken', () => {
    test('should save valid token', async () => {
      const token = 'ATTA-test-token-123';
      const result = await authService.saveToken(token);

      expect(result.token).toBe(token);
      expect(mockConfigRepo.getStoredConfig().token).toBe(token);
    });

    test('should preserve API key when saving token', async () => {
      const originalKey = '630a01228b85df706aa520f3611e6490';
      const token = 'ATTA-new-token';

      const result = await authService.saveToken(token);

      expect(result.apiKey).toBe(originalKey);
    });

    test('should update existing token', async () => {
      await authService.saveToken('ATTA-first-token');
      const result = await authService.saveToken('ATTA-second-token');

      expect(result.token).toBe('ATTA-second-token');
      expect(mockConfigRepo.getStoredConfig().token).toBe('ATTA-second-token');
    });
  });

  describe('isAuthenticated', () => {
    test('should return true when valid token exists', async () => {
      mockConfigRepo.setConfig(
        new ConfigEntity('630a01228b85df706aa520f3611e6490', 'ATTA-valid-token'),
      );

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    test('should return false when no token exists', async () => {
      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });

    test('should return false when token is invalid', async () => {
      mockConfigRepo.setConfig(
        new ConfigEntity('630a01228b85df706aa520f3611e6490', 'INVALID-TOKEN'),
      );

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('validateToken', () => {
    test('should return true for valid ATTA token', () => {
      const result = authService.validateToken(
        'ATTA-valid-token-with-enough-length',
      );

      expect(result).toBe(true);
    });

    test('should return false for token not starting with ATTA', () => {
      const result = authService.validateToken('INVALID-token-format');

      expect(result).toBe(false);
    });

    test('should return false for short ATTA token', () => {
      const result = authService.validateToken('ATTA-short');

      expect(result).toBe(false);
    });

    test('should return false for empty token', () => {
      const result = authService.validateToken('');

      expect(result).toBe(false);
    });

    test('should accept token with exactly 11 characters', () => {
      const result = authService.validateToken('ATTA-123456'); // 11 characters total

      expect(result).toBe(true);
    });
  });
});
