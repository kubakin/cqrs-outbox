import { RabbitMQPublisher } from './publisher';
import { RabbitMQSubscriber } from './subscriber';
import { DynamicModule, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus, QueryBus, EventBus, IEvent } from '@nestjs/cqrs';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { DatabaseOptions } from './outbox/entity/outbox-datasource';
export * from '@nestjs/cqrs';
export declare class ExplorerService1 {
}
export interface CqrsRMQModuleInterface {
    name: string;
    uri: string[];
    dbOptions: DatabaseOptions;
}
export declare class CqrsRMQModule<EventBase extends IEvent = IEvent> implements OnApplicationBootstrap {
    private readonly explorerService;
    private readonly eventBus;
    private readonly commandBus;
    private readonly queryBus;
    private eventSubscriber;
    private readonly eventPublisher;
    private options;
    static forRoot(options: CqrsRMQModuleInterface): DynamicModule;
    constructor(explorerService: ExplorerService<EventBase>, eventBus: EventBus<EventBase>, commandBus: CommandBus, queryBus: QueryBus, eventSubscriber: RabbitMQSubscriber, eventPublisher: RabbitMQPublisher, options: CqrsRMQModuleInterface);
    onApplicationBootstrap(): Promise<void>;
}
