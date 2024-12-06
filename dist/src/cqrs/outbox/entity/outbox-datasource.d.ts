import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Message } from './outbox.entity';
import { CqrsRMQModuleInterface } from 'src/cqrs/rmq.cqrs.module';
export declare const entities: (typeof Message)[];
export interface DatabaseOptions {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}
export declare class OutboxDatabaseService implements OnModuleDestroy {
    dataSource: DataSource;
    private options;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export declare class OutboxDatabaseModule {
    static forRoot(options: CqrsRMQModuleInterface): Promise<DynamicModule>;
}
