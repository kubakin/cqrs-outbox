import { IEventPublisher } from '@nestjs/cqrs';
import { OutboxDatabaseService } from './outbox/entity/outbox-datasource';
export declare class RabbitMQPublisher implements IEventPublisher {
    private service;
    constructor(service: OutboxDatabaseService);
    connect(): void;
    publish<T>(event: T): any;
    private get messageRepo();
}
