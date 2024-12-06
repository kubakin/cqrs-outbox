import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Message } from './outbox.entity';
export declare const entities: (typeof Message)[];
export interface DatabaseOptions {
    host: string;
    port: number;
    username: string;
    password: string;
    entities: any[];
}
export declare class OutboxDatabaseService implements OnModuleDestroy {
    configuration: any;
    readonly dataSource: DataSource;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export declare class OutboxDatabaseModule {
    static forRoot(): Promise<DynamicModule>;
}
