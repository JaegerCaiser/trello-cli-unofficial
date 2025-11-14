/**
 * Base error class for Trello CLI application
 */
import { t } from '@/i18n';

export class TrelloCliError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Authentication related errors
 */
export class AuthenticationError extends TrelloCliError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
  }
}

/**
 * API related errors
 */
export class ApiError extends TrelloCliError {
  constructor(
    message: string,
    override readonly statusCode: number,
    public readonly endpoint?: string,
  ) {
    super(message, 'API_ERROR', statusCode);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends TrelloCliError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends TrelloCliError {
  constructor(
    message: string,
    public readonly resourceType: string,
    public readonly resourceId?: string,
  ) {
    super(message, 'NOT_FOUND_ERROR', 404);
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends TrelloCliError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR', 500);
  }
}

/**
 * Network connectivity errors
 */
export class NetworkError extends TrelloCliError {
  constructor(message: string = t('api.networkConnectionFailed')) {
    super(message, 'NETWORK_ERROR', 0);
  }
}

/**
 * Error handler class for consistent error handling and user feedback
 */
export class ErrorHandler {
  /**
   * Handle an error and provide appropriate user feedback
   */
  static handle(error: unknown, context?: string): void {
    if (error instanceof TrelloCliError) {
      this.handleTrelloError(error, context);
    } else if (error instanceof Error) {
      this.handleGenericError(error, context);
    } else {
      this.handleUnknownError(error, context);
    }
  }

  /**
   * Handle Trello CLI specific errors
   */
  private static handleTrelloError(
    error: TrelloCliError,
    context?: string,
  ): void {
    const prefix = context ? `[${context}] ` : '';

    switch (error.code) {
      case 'AUTH_ERROR':
        console.error(t('errors.authFailed', { message: error.message }));
        console.error(t('errors.trySetup'));
        break;

      case 'API_ERROR':
        console.error(
          t('errors.apiError', { statusCode: error.statusCode, message: error.message }),
        );
        if (error instanceof ApiError && error.endpoint) {
          console.error(t('errors.endpoint', { endpoint: error.endpoint }));
        }
        break;

      case 'VALIDATION_ERROR':
        console.error(t('errors.validationError', { message: error.message }));
        if (error instanceof ValidationError && error.field) {
          console.error(t('errors.field', { field: error.field }));
        }
        break;

      case 'NOT_FOUND_ERROR':
        console.error(t('errors.notFound', { message: error.message }));
        if (error instanceof NotFoundError) {
          if (error.resourceType) {
            console.error(
              t('errors.resourceType', { resourceType: error.resourceType }),
            );
          }
          if (error.resourceId) {
            console.error(
              t('errors.resourceId', { resourceId: error.resourceId }),
            );
          }
        }
        break;

      case 'CONFIG_ERROR':
        console.error(t('errors.configError', { message: error.message }));
        console.error(t('errors.checkConfig'));
        break;

      case 'NETWORK_ERROR':
        console.error(t('errors.networkError', { message: error.message }));
        console.error(t('errors.checkConnection'));
        break;

      default:
        console.error(`❌ ${prefix}${error.message}`);
    }

    // Exit with appropriate code for automation
    process.exit(error.statusCode || 1);
  }

  /**
   * Handle generic JavaScript errors
   */
  private static handleGenericError(error: Error, _context?: string): void {
    console.error(t('errors.unexpectedError', { message: error.message }));

    // In development, show stack trace
    if (process.env.NODE_ENV === 'development') {
      console.error(t('errors.stackTrace'), error.stack);
    }

    process.exit(1);
  }

  /**
   * Handle unknown errors
   */
  private static handleUnknownError(error: unknown, _context?: string): void {
    console.error(t('errors.unknownError'), error);
    process.exit(1);
  }

  /**
   * Wrap async operations with error handling
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, context);
      // This line won't be reached due to process.exit, but TypeScript needs it
      throw error;
    }
  }

  /**
   * Create user-friendly error messages from API responses
   */
  static fromApiResponse(
    response: Record<string, unknown>,
    endpoint?: string,
  ): TrelloCliError {
    const statusCode
      = (response.status as number) || (response.statusCode as number) || 500;
    const message
      = (response.message as string)
        || (response.error as string)
        || t('api.unknownApiError');

    switch (statusCode) {
      case 401:
        return new AuthenticationError(t('api.invalidToken'));
      case 403:
        return new AuthenticationError('Access denied');
      case 404:
        return new NotFoundError(t('api.resourceNotFound'), 'unknown');
      case 400:
        return new ValidationError(message);
      case 429:
        return new ApiError(t('api.rateLimitExceeded'), statusCode, endpoint);
      case 500:
        return new ApiError(t('api.internalServerError'), statusCode, endpoint);
      default:
        return new ApiError(message, statusCode, endpoint);
    }
  }
}
