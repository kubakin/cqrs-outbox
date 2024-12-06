import { OutboxDatabaseService } from './entity/outbox-datasource';
export declare class MessageCleaner {
    private service;
    constructor(service: OutboxDatabaseService);
    clean(): Promise<void>;
}
