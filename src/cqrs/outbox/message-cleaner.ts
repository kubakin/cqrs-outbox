import { Injectable } from '@nestjs/common';
import { LessThan } from 'typeorm';
import { DateTime } from 'luxon';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxDatabaseService } from './entity/outbox-datasource';
import { Message } from '../msg/event';

@Injectable()
export class MessageCleaner {
  constructor(private service: OutboxDatabaseService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async clean() {
    await this.service.dataSource.manager.getRepository(Message).delete({
      published: true,
      publishedAt: LessThan(
        DateTime.fromJSDate(new Date()).minus({ days: 1 }).toJSDate(),
      ),
    });
  }
}
