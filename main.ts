#!/usr/bin/env bun
import { config } from 'dotenv';
import { t } from './src/i18n';
import { CommandController } from './src/presentation';

// Load environment variables
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
    process.exit(1);
  }
}

main().catch(console.error);
