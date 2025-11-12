export type OutputFormat = 'table' | 'json' | 'csv';

export interface OutputFormatterOptions {
  format: OutputFormat;
  headers?: string[];
  fields?: string[];
}

export class OutputFormatter {
  private format: OutputFormat;

  constructor(format: OutputFormat = 'table') {
    this.format = format;
  }

  setFormat(format: OutputFormat): void {
    this.format = format;
  }

  /**
   * Format and output data based on the current format
   */
  output<T>(data: T[] | T, options?: Partial<OutputFormatterOptions>): void {
    const format = options?.format || this.format;

    switch (format) {
      case 'json':
        this.outputJson(data);
        break;
      case 'csv':
        this.outputCsv(data as T[], options);
        break;
      case 'table':
      default:
        this.outputTable(data as T[], options);
        break;
    }
  }

  /**
   * Output data in JSON format
   */
  private outputJson<T>(data: T[] | T): void {
    console.log(JSON.stringify(data, null, 2));
  }

  /**
   * Output data in CSV format
   */
  private outputCsv<T>(
    data: T[],
    options?: Partial<OutputFormatterOptions>,
  ): void {
    if (!Array.isArray(data) || data.length === 0) {
      console.log('No data to display');
      return;
    }

    const firstItem = data[0];
    if (!firstItem) {
      console.log('No data to display');
      return;
    }

    // Convert to plain object if it's a class instance
    const plainItem = this.toPlainObject(firstItem);
    const fields = options?.fields || Object.keys(plainItem);
    const headers = options?.headers || fields;

    // Output headers
    console.log(headers.join(','));

    // Output data rows
    for (const item of data) {
      const plainObject = this.toPlainObject(item);
      const row = fields.map((field) => {
        const value = plainObject[field];
        // Escape commas and quotes in CSV
        const stringValue = String(value || '');
        if (
          stringValue.includes(',')
          || stringValue.includes('"')
          || stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      console.log(row.join(','));
    }
  }

  /**
   * Output data in table format (default)
   */
  private outputTable<T>(
    data: T[],
    options?: Partial<OutputFormatterOptions>,
  ): void {
    if (!Array.isArray(data) || data.length === 0) {
      console.log('No data to display');
      return;
    }

    const firstItem = data[0];
    if (!firstItem) {
      console.log('No data to display');
      return;
    }

    // Convert to plain object if it's a class instance
    const plainItem = this.toPlainObject(firstItem);
    const fields = options?.fields || Object.keys(plainItem);
    const headers = options?.headers || fields;

    // Calculate column widths
    const columnWidths = headers.map((header, index) => {
      const field = fields[index]!;
      const headerWidth = header.length;
      const maxDataWidth = Math.max(
        ...data.map((item) => {
          const plainObject = this.toPlainObject(item);
          return String(plainObject[field] || '').length;
        }),
      );
      return Math.max(headerWidth, maxDataWidth);
    });

    // Output header
    const headerRow = headers
      .map((header, index) => header.padEnd(columnWidths[index]!))
      .join(' | ');
    console.log(headerRow);

    // Output separator
    const separator = columnWidths
      .map(width => '-'.repeat(width))
      .join('-+-');
    console.log(separator);

    // Output data rows
    for (const item of data) {
      const plainObject = this.toPlainObject(item);
      const row = fields
        .map((field, index) => {
          const value = String(plainObject[field!] || '');
          return value.padEnd(columnWidths[index]!);
        })
        .join(' | ');
      console.log(row);
    }
  }

  /**
   * Convert an object to a plain object for serialization
   */
  private toPlainObject<T>(obj: T): Record<string, unknown> {
    if (obj === null || obj === undefined) {
      return {};
    }

    if (typeof obj === 'object' && obj.constructor !== Object) {
      // It's a class instance, convert to plain object
      const plain: Record<string, unknown> = {};
      for (const key of Object.keys(obj as object)) {
        plain[key] = (obj as Record<string, unknown>)[key];
      }
      return plain;
    }

    return obj as Record<string, unknown>;
  }

  /**
   * Output a simple message
   */
  message(message: string): void {
    console.log(message);
  }

  /**
   * Output an error message
   */
  error(message: string): void {
    console.error(`❌ ${message}`);
  }

  /**
   * Output a success message
   */
  success(message: string): void {
    console.log(`✅ ${message}`);
  }

  /**
   * Output a warning message
   */
  warning(message: string): void {
    console.log(`⚠️  ${message}`);
  }

  /**
   * Output an info message
   */
  info(message: string): void {
    console.log(`ℹ️  ${message}`);
  }
}
