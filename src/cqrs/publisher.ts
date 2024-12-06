import {  Injectable } from '@nestjs/common';
import { IEventPublisher } from '@nestjs/cqrs';
import { Messages } from './msg/msg';
import { DataSource } from 'typeorm';
import { OutboxDatabaseService } from './outbox/entity/outbox-datasource';
import { Message } from './outbox/entity/outbox.entity';
import { generateString } from '@nestjs/typeorm';

@Injectable()
export class RabbitMQPublisher implements IEventPublisher {
  // @Inject('DATA_SOURCE') private dataSource: DataSource;
  constructor(private service: OutboxDatabaseService) {}

  connect(): void {
    console.log('Cqrs rabbit connected');
  }

  publish<T>(event: T): any {
    const routingKey = Messages.getNameFromInstance(event);
    const message = new Message(
      generateString(),
      routingKey,
      event,
      new Date(),
    );
    this.messageRepo.save(message).then().catch(console.log);
  }

  private get messageRepo() {
    return this.service.dataSource.manager.getRepository(Message);
  }
}
