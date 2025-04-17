import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as TelegramBot from 'node-telegram-bot-api';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = path.join(__dirname, '..', '..', 'backups');
  private readonly bot: TelegramBot;

  constructor() {
    this.logger.log('BOT_TOKEN:', process.env.BOT_TOKEN ? 'Set' : 'Missing');
    this.logger.log('POSTGRES_DB:', process.env.POSTGRES_DB || 'Missing');
    this.logger.log('POSTGRES_PORT:', process.env.POSTGRES_PORT || 'Missing');
    this.logger.log('TELEGRAM_USER_IDS:', process.env.TELEGRAM_USER_IDS || 'Missing');

    if (!process.env.BOT_TOKEN) {
      throw new Error('BOT_TOKEN is not defined in environment variables');
    }
    this.bot = new TelegramBot(`${process.env.BOT_TOKEN}`, { polling: false });

    this.bot.on('error', (error) => {
      this.logger.error(`Telegram bot error: ${error.message}`, error.stack);
    });

    this.bot.on('webhook_error', (error) => {
      this.logger.error(`Webhook error: ${error.message}`, error.stack);
    });

    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyBackup() {
    this.logger.log('Starting daily PostgreSQL backup...');

    try {
      const backupFile = await this.createBackup();
      await this.sendBackupToTelegram(backupFile);
      this.logger.log('Backup completed and sent to Telegram.');
    } catch (error) {
      this.logger.error('Backup failed:', error);
    }
  }

  private async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupDir, `backup-${timestamp}.sql`);

    const pgDumpArgs = [
      `-h ${process.env.POSTGRES_HOST}`,
      `-p ${process.env.POSTGRES_PORT}`,
      `-U ${process.env.POSTGRES_USER}`,
      `-d ${process.env.POSTGRES_DB}`,
      '-F p',
    ];

    try {
      await new Promise<void>((resolve, reject) => {
        const pgDump = spawn('pg_dump', pgDumpArgs, {
          env: { ...process.env, PGPASSWORD: process.env.POSTGRES_PASSWORD },
          shell: true,
        });

        const writeStream = fs.createWriteStream(backupFile);

        pgDump.stdout.pipe(writeStream);

        pgDump.stderr.on('data', (data) => {
          this.logger.error(`pg_dump stderr: ${data}`);
        });

        pgDump.on('error', (error) => {
          reject(new Error(`pg_dump error: ${error.message}`));
        });

        pgDump.on('close', (code) => {
          writeStream.close();
          if (code !== 0) {
            reject(new Error(`pg_dump exited with code ${code}`));
          } else {
            resolve();
          }
        });
      });

      this.logger.log(`Backup command executed: ${backupFile}`);

      let retries = 10;
      let fileSize = 0;
      let lastSize = -1;

      while (retries > 0) {
        if (fs.existsSync(backupFile)) {
          const stats = fs.statSync(backupFile);
          fileSize = stats.size;

          if (fileSize > 0 && fileSize === lastSize) {
            this.logger.log(`Backup file ready: ${backupFile}, size: ${fileSize} bytes`);
            return backupFile;
          }

          lastSize = fileSize;
          this.logger.log(`File exists, size: ${fileSize} bytes, waiting for completion...`);
        } else {
          this.logger.log(`Backup file not yet created: ${backupFile}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        retries--;
      }

      this.logger.error(`Backup file not found or not ready after retries: ${backupFile}`);
      throw new Error(`Backup file not ready: ${backupFile}`);
    } catch (error) {
      this.logger.error('Error creating backup:', error);
      throw error;
    }
  }

  private async sendBackupToTelegram(backupFile: string) {
    const userIds = [...new Set(process.env.TELEGRAM_USER_IDS?.split(',').map(id => id.trim()) || [])];
    this.logger.log('Parsed TELEGRAM_USER_IDS:', userIds);

    if (!userIds.length) {
      this.logger.warn('No TELEGRAM_USER_IDS provided; skipping Telegram send.');
      return;
    }

    const normalizedBackupFile = path.normalize(backupFile);
    const fileName = path.basename(normalizedBackupFile);

    if (!fs.existsSync(normalizedBackupFile)) {
      this.logger.error(`Backup file does not exist: ${normalizedBackupFile}`);
      return;
    }

    for (const userId of userIds) {
      try {
        this.logger.log(`Attempting to send backup to userId: ${userId}`);
        await this.bot.sendDocument(
          userId,
          fs.createReadStream(normalizedBackupFile),
          {
            caption: `Daily PostgreSQL backup for ${process.env.POSTGRES_DB || 'unknown'} - ${new Date().toISOString()}`,
          },
          {
            filename: fileName,
            contentType: 'application/sql',
          },
        );
        this.logger.log(`Backup sent to user ${userId}`);
      } catch (error) {
        this.logger.error(`Failed to send backup to user ${userId}: ${error.message}`);
      }
    }

    try {
      if (fs.existsSync(normalizedBackupFile)) {
        fs.unlinkSync(normalizedBackupFile);
        this.logger.log(`Backup file deleted: ${normalizedBackupFile}`);
      } else {
        this.logger.warn(`Backup file already deleted or not found: ${normalizedBackupFile}`);
      }
    } catch (error) {
      this.logger.error('Error deleting backup file:', error);
    }
  }
}