#!/usr/bin/env bun
import { config } from 'dotenv';
import { t } from './src/i18n';
import { CommandController } from './src/presentation';

config();

async function main() {
  try {
    const commandController = new CommandController();
    await commandController.run();
  } catch (error) {
    console.error(
      t('errors.general', { message: (error as Error).message }),
      (error as Error).message,
    );

    // Show stack trace in verbose mode
    if (process.env.VERBOSE_ERRORS === 'true') {
      console.error('\n--- Stack Trace ---');
      console.error((error as Error).stack);
    }

    process.exit(1);
  }
}

main().catch(console.error);
