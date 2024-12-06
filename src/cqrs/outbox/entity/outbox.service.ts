import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Message } from './outbox.entity';
import { OutboxDatabaseService } from './outbox-datasource';

@Injectable()
export class OutboxService {
  constructor(
    private connection: AmqpConnection,
    private service: OutboxDatabaseService,
  ) {}

  private isRun = false;

  @Interval(10)
  async publish() {
    if (!this.service.dataSource.isInitialized) {
      await this.service.dataSource.initialize();
    }
    const queryRunner = this.service.dataSource.createQueryRunner();
    await queryRunner.connect();
    const repo = queryRunner.manager.getRepository(Message);
    try {
      if (this.isRun) return;
      this.isRun = true;
      await queryRunner.startTransaction('SERIALIZABLE');
      const unPublishedMessages = await repo.find({
        where: { published: false },
        order: { number: 'ASC' },
        transaction: true,
        lock: {
          mode: 'pessimistic_write',
        },
      });
      unPublishedMessages.forEach((message) => message.publish());
      for (const message of unPublishedMessages)
        await this.connection.publish('client', message.name, {
          name: message.name,
          data: message.data,
        });
      await repo.save(unPublishedMessages, {
        transaction: true,
      });
      await queryRunner.commitTransaction();
    } catch (e) {
    } finally {
      this.isRun = false;
      await queryRunner.release();
    }
  }
}
