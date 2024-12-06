import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OutboxDatabaseService } from './outbox-datasource';
export declare class OutboxService {
    private connection;
    private service;
    constructor(connection: AmqpConnection, service: OutboxDatabaseService);
    private isRun;
    publish1dd(): Promise<void>;
}
