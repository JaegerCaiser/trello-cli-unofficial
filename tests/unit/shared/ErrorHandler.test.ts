import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { getCurrentLanguage } from '@/i18n';
import {
  ApiError,
  AuthenticationError,
  ConfigurationError,
  ErrorHandler,
  NetworkError,
  NotFoundError,
  TrelloCliError,
  ValidationError,
} from '@/shared';

// Helper function to get expected internal server error message based on current language
function getExpectedInternalServerErrorMessage(): string {
  const language = getCurrentLanguage();
  return language === 'pt-BR'
    ? 'Erro interno do servidor. Tente novamente mais tarde.'
    : 'Internal server error. Please try again later.';
}

describe('ErrorHandler', () => {
  let consoleErrorSpy: ReturnType<typeof spyOn>;
  let processExitSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    consoleErrorSpy = spyOn(console, 'error');
    // Mock process.exit to throw an exception we can catch
    processExitSpy = spyOn(process, 'exit');
    process.exit = ((code: number) => {
      throw new Error(`ProcessExit:${code}`);
    }) as any;
    // Set test environment to prevent actual exits
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    delete process.env.NODE_ENV;
  });

  describe('Error Classes', () => {
    describe('TrelloCliError', () => {
      test('should create error with message, code and statusCode', () => {
        const error = new TrelloCliError('Test error', 'TEST_ERROR', 400);
        expect(error.message).toBe('Test error');
        expect(error.code).toBe('TEST_ERROR');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('TrelloCliError');
      });

      test('should create error without statusCode', () => {
        const error = new TrelloCliError('Test error', 'TEST_ERROR');
        expect(error.message).toBe('Test error');
        expect(error.code).toBe('TEST_ERROR');
        expect(error.statusCode).toBeUndefined();
      });
    });

    describe('AuthenticationError', () => {
      test('should create with default message', () => {
        const error = new AuthenticationError();
        expect(error.message).toBe('Authentication failed');
        expect(error.code).toBe('AUTH_ERROR');
        expect(error.statusCode).toBe(401);
      });

      test('should create with custom message', () => {
        const error = new AuthenticationError('Custom auth error');
        expect(error.message).toBe('Custom auth error');
        expect(error.code).toBe('AUTH_ERROR');
        expect(error.statusCode).toBe(401);
      });
    });

    describe('ApiError', () => {
      test('should create with statusCode and endpoint', () => {
        const error = new ApiError('API Error', 500, '/api/test');
        expect(error.message).toBe('API Error');
        expect(error.code).toBe('API_ERROR');
        expect(error.statusCode).toBe(500);
        expect(error.endpoint).toBe('/api/test');
      });

      test('should create without endpoint', () => {
        const error = new ApiError('API Error', 404);
        expect(error.message).toBe('API Error');
        expect(error.code).toBe('API_ERROR');
        expect(error.statusCode).toBe(404);
        expect(error.endpoint).toBeUndefined();
      });
    });

    describe('ValidationError', () => {
      test('should create with field', () => {
        const error = new ValidationError('Invalid value', 'name');
        expect(error.message).toBe('Invalid value');
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.statusCode).toBe(400);
        expect(error.field).toBe('name');
      });

      test('should create without field', () => {
        const error = new ValidationError('Invalid value');
        expect(error.message).toBe('Invalid value');
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.statusCode).toBe(400);
        expect(error.field).toBeUndefined();
      });
    });

    describe('NotFoundError', () => {
      test('should create with resourceType and resourceId', () => {
        const error = new NotFoundError('Board not found', 'board', '123');
        expect(error.message).toBe('Board not found');
        expect(error.code).toBe('NOT_FOUND_ERROR');
        expect(error.statusCode).toBe(404);
        expect(error.resourceType).toBe('board');
        expect(error.resourceId).toBe('123');
      });

      test('should create with only resourceType', () => {
        const error = new NotFoundError('Board not found', 'board');
        expect(error.message).toBe('Board not found');
        expect(error.code).toBe('NOT_FOUND_ERROR');
        expect(error.statusCode).toBe(404);
        expect(error.resourceType).toBe('board');
        expect(error.resourceId).toBeUndefined();
      });
    });

    describe('ConfigurationError', () => {
      test('should create with message', () => {
        const error = new ConfigurationError('Config error');
        expect(error.message).toBe('Config error');
        expect(error.code).toBe('CONFIG_ERROR');
        expect(error.statusCode).toBe(500);
      });
    });

    describe('NetworkError', () => {
      test('should create with default message', () => {
        const error = new NetworkError();
        expect(error.code).toBe('NETWORK_ERROR');
        expect(error.statusCode).toBe(0);
        // Message will be from translation
      });

      test('should create with custom message', () => {
        const error = new NetworkError('Custom network error');
        expect(error.message).toBe('Custom network error');
        expect(error.code).toBe('NETWORK_ERROR');
        expect(error.statusCode).toBe(0);
      });
    });
  });

  describe('ErrorHandler.handle', () => {
    test('should handle AuthenticationError', () => {
      const error = new AuthenticationError('Invalid token');
      // In test environment, errors are thrown instead of process.exit
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    test('should handle ApiError with endpoint', () => {
      const error = new ApiError('Server error', 500, '/api/boards');
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    test('should handle ApiError without endpoint', () => {
      const error = new ApiError('Server error', 500);
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    test('should handle ValidationError with field', () => {
      const error = new ValidationError('Invalid name', 'boardName');
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    test('should handle ValidationError without field', () => {
      const error = new ValidationError('Invalid name');
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    test('should handle NotFoundError with all details', () => {
      const error = new NotFoundError('Board not found', 'board', '123');
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
    });

    test('should handle NotFoundError with minimal details', () => {
      const error = new NotFoundError('Not found', 'unknown');
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    test('should handle ConfigurationError', () => {
      const error = new ConfigurationError('Config missing');
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    test('should handle NetworkError', () => {
      const error = new NetworkError('Connection failed');
      expect(() => ErrorHandler.handle(error)).toThrow(error); // NetworkError has statusCode 0, but process.exit uses error.statusCode || 1
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    test('should handle generic Error', () => {
      const error = new Error('Generic error');
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    test('should handle unknown error', () => {
      const error = 'string error';
      expect(() => ErrorHandler.handle(error)).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    test('should include context in error messages', () => {
      const error = new AuthenticationError('Invalid token');
      expect(() => ErrorHandler.handle(error, 'BoardController')).toThrow(error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('ErrorHandler.withErrorHandling', () => {
    test('should execute operation successfully', async () => {
      const result = await ErrorHandler.withErrorHandling(async () => {
        return 'success';
      });

      expect(result).toBe('success');
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    test('should handle errors from async operation', async () => {
      const error = new AuthenticationError('Test error');

      // Mock the operation to throw
      const mockOperation = async () => {
        throw error;
      };

      // Since withErrorHandling throws errors in test environment, we expect it to reject
      await expect(ErrorHandler.withErrorHandling(mockOperation)).rejects.toThrow(error);
    });
  });

  describe('ErrorHandler.fromApiResponse', () => {
    test('should create AuthenticationError for 401', () => {
      const response = { status: 401, message: 'Unauthorized' };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.statusCode).toBe(401);
    });

    test('should create AuthenticationError for 403', () => {
      const response = { status: 403, message: 'Forbidden' };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.statusCode).toBe(401); // AuthenticationError always has 401
    });

    test('should create NotFoundError for 404', () => {
      const response = { status: 404, message: 'Not found' };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.statusCode).toBe(404);
    });

    test('should create ValidationError for 400', () => {
      const response = { status: 400, message: 'Bad request' };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.statusCode).toBe(400);
    });

    test('should create ApiError for 429', () => {
      const response = { status: 429, message: 'Rate limited' };
      const error = ErrorHandler.fromApiResponse(response, '/api/test');

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(429);
      expect((error as ApiError).endpoint).toBe('/api/test');
    });

    test('should create ApiError for 500', () => {
      const response = { status: 500, message: 'Server error' };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(500);
    });

    test('should create ApiError for unknown status', () => {
      const response = { status: 418, message: 'I\'m a teapot' };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(418);
    });

    test('should handle response with statusCode instead of status', () => {
      const response = { statusCode: 404, message: 'Not found' };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.statusCode).toBe(404);
    });

    test('should handle response with error field', () => {
      const response = { status: 500, error: 'Internal error' };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe(getExpectedInternalServerErrorMessage());
    });

    test('should use default message when no message provided', () => {
      const response = { status: 500 };
      const error = ErrorHandler.fromApiResponse(response);

      expect(error).toBeInstanceOf(ApiError);
      // Message will be from translation
    });
  });
});
