import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxService } from './entity/outbox.service';
import {
  OutboxDatabaseModule,
  OutboxDatabaseService,
} from './entity/outbox-datasource';
import { CqrsRMQModuleInterface } from '../rmq.cqrs.module';

@Module({})
export class OutboxModule {
  static forRoot(options: CqrsRMQModuleInterface): DynamicModule {
    return {
      module: OutboxModule,
      providers: [
        OutboxService,
        OutboxDatabaseService,
        { provide: 'OPTIONS', useValue: options },
      ],
      exports: [OutboxDatabaseService],
      imports: [
        OutboxDatabaseModule.forRoot(options),
        ScheduleModule.forRoot(),
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
          uri: options.uri,
        }),
      ],
    };
  }
}
