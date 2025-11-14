import { AuthenticateUserUseCase } from '@application/use-cases';
import { ConfigEntity } from '@domain/entities';
import { changeLanguage } from '@i18n';
import { MockConfigRepository } from '@tests/mocks';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('AuthenticateUserUseCase', () => {
  let mockConfigRepo: MockConfigRepository;
  let useCase: AuthenticateUserUseCase;

  beforeEach(() => {
    mockConfigRepo = new MockConfigRepository();
    useCase = new AuthenticateUserUseCase(mockConfigRepo);
    changeLanguage('pt-BR'); // Ensure tests run in Portuguese
  });

  describe('execute with token', () => {
    test('should save valid token successfully', async () => {
      const token = 'ATTA-valid-token-123';
      const result = await useCase.execute(token);

      expect(result.success).toBe(true);
      expect(result.message).toContain('✅');
      expect(mockConfigRepo.getStoredConfig().token).toBe(token);
    });

    test('should reject invalid token format', async () => {
      const token = 'INVALID-token';
      const result = await useCase.execute(token);

      expect(result.success).toBe(false);
      expect(result.message).toContain('❌');
      expect(result.message).toContain('inválido');
    });

    test('should reject short token', async () => {
      const token = 'ATTA-123';
      const result = await useCase.execute(token);

      expect(result.success).toBe(false);
      expect(result.message).toContain('❌');
      expect(result.message).toContain('inválido');
    });
  });

  describe('execute without token', () => {
    test('should return success when already authenticated', async () => {
      mockConfigRepo.setConfig(
        new ConfigEntity('630a01228b85df706aa520f3611e6490', 'ATTA-valid-token'),
      );

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.message).toContain('autenticado');
    });

    test('should return failure when not authenticated', async () => {
      const result = await useCase.execute();

      expect(result.success).toBe(false);
      expect(result.message).toContain('🔐');
      expect(result.message).toContain('autenticado');
    });
  });

  describe('getConfig', () => {
    test('should return current configuration', async () => {
      const config = await useCase.getConfig();

      expect(config).toBeInstanceOf(ConfigEntity);
      expect(config.apiKey).toBeDefined();
    });
  });
});
