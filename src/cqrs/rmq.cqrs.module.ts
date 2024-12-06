import { Inject, Injectable } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQPublisher } from './publisher';
import { RabbitMQSubscriber } from './subscriber';
import { DynamicModule, Module, OnApplicationBootstrap } from '@nestjs/common';
import {
  CommandBus,
  QueryBus,
  EventBus,
  UnhandledExceptionBus,
  EventPublisher,
  IEvent,
} from '@nestjs/cqrs';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { OutboxDatabaseModule } from './outbox/entity/outbox-datasource';
import { OutboxModule } from './outbox/outbox.module';

const getRabbitUri = () => {
  return process.env.RABBIT_URL || 'amqp://127.0.0.1:5672';
};
export * from '@nestjs/cqrs';
export class ExplorerService1 {}

export interface CqrsRMQModuleInterface {
  name: string;
  uri: string[];
}

@Module({})
export class CqrsRMQModule<EventBase extends IEvent = IEvent>
  implements OnApplicationBootstrap
{
  /**
   * Registers the CQRS Module globally.
   * @returns DynamicModule
   */
  static forRoot(name = 'referral'): DynamicModule {
    return {
      module: CqrsRMQModule,
      global: true,
      imports: [
        OutboxModule.forRoot(),
        RabbitMQModule.forRoot(RabbitMQModule, {
          exchanges: [
            {
              name: 'client',
              type: 'topic',
            },
          ],
          connectionManagerOptions: {
            heartbeatIntervalInSeconds: 0,
          },
          uri: getRabbitUri().split(','),
        }),
      ],
      providers: [
        CommandBus,
        QueryBus,
        EventBus,
        UnhandledExceptionBus,
        EventPublisher,
        ExplorerService,
        RabbitMQPublisher,
        RabbitMQSubscriber,
      ],
      exports: [
        CommandBus,
        QueryBus,
        EventBus,
        UnhandledExceptionBus,
        EventPublisher,
      ],
    };
  }

  constructor(
    private readonly explorerService: ExplorerService<EventBase>,
    private readonly eventBus: EventBus<EventBase>,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private eventSubscriber: RabbitMQSubscriber,
    private readonly eventPublisher: RabbitMQPublisher,
  ) {}

  async onApplicationBootstrap() {
    console.log('init');
    await this.eventSubscriber.connect('ml-referral');
    this.eventSubscriber.bridgeEventsTo(this.eventBus.subject$);

    const { events, queries, sagas, commands } = this.explorerService.explore();
    this.eventBus.publisher = this.eventPublisher;
    this.eventBus.register(events);
    this.commandBus.register(commands);
    this.queryBus.register(queries);
    this.eventBus.registerSagas(sagas);
  }
}
