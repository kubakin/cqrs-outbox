import { Logger } from '@nestjs/common';
import { IEvent, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import 'reflect-metadata';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
export declare class RabbitMQSubscriber implements IMessageSource {
    private readonly amqpConnection;
    private bridge;
    readonly logger: Logger;
    events: Array<any>;
    constructor(amqpConnection: AmqpConnection);
    register(events: any[]): void;
    connect(name: string): Promise<void>;
    bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any;
}
