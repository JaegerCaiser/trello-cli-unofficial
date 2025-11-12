/**
 * Base error class for Trello CLI application
 */
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
  constructor(message: string = 'Network connection failed') {
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
        console.error(`❌ ${prefix}Authentication failed: ${error.message}`);
        console.error('💡 Try running: trello-cli-unofficial setup');
        break;

      case 'API_ERROR':
        console.error(
          `❌ ${prefix}API Error (${error.statusCode}): ${error.message}`,
        );
        if (error instanceof ApiError && error.endpoint) {
          console.error(`📍 Endpoint: ${error.endpoint}`);
        }
        break;

      case 'VALIDATION_ERROR':
        console.error(`❌ ${prefix}Validation Error: ${error.message}`);
        if (error instanceof ValidationError && error.field) {
          console.error(`📝 Field: ${error.field}`);
        }
        break;

      case 'NOT_FOUND_ERROR':
        console.error(`❌ ${prefix}Not Found: ${error.message}`);
        if (error instanceof NotFoundError) {
          console.error(`🔍 Resource Type: ${error.resourceType}`);
          if (error.resourceId) {
            console.error(`🆔 Resource ID: ${error.resourceId}`);
          }
        }
        break;

      case 'CONFIG_ERROR':
        console.error(`❌ ${prefix}Configuration Error: ${error.message}`);
        console.error(
          '💡 Check your configuration file: ~/.trello-cli-unofficial/config.json',
        );
        break;

      case 'NETWORK_ERROR':
        console.error(`❌ ${prefix}Network Error: ${error.message}`);
        console.error('💡 Check your internet connection and try again');
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
  private static handleGenericError(error: Error, context?: string): void {
    const prefix = context ? `[${context}] ` : '';
    console.error(`❌ ${prefix}Unexpected error: ${error.message}`);

    // In development, show stack trace
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error.stack);
    }

    process.exit(1);
  }

  /**
   * Handle unknown errors
   */
  private static handleUnknownError(error: unknown, context?: string): void {
    const prefix = context ? `[${context}] ` : '';
    console.error(`❌ ${prefix}Unknown error occurred:`, error);
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
        || 'Unknown API error';

    switch (statusCode) {
      case 401:
        return new AuthenticationError('Invalid or expired token');
      case 403:
        return new AuthenticationError('Access denied');
      case 404:
        return new NotFoundError('Resource not found', 'unknown');
      case 400:
        return new ValidationError(message);
      case 429:
        return new ApiError(
          'Rate limit exceeded. Please try again later.',
          statusCode,
          endpoint,
        );
      case 500:
        return new ApiError(
          'Internal server error. Please try again later.',
          statusCode,
          endpoint,
        );
      default:
        return new ApiError(message, statusCode, endpoint);
    }
  }
}
