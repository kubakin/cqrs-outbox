import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxService } from './entity/outbox.service';
import { DataSource } from 'typeorm';
import {
  OutboxDatabaseModule,
  OutboxDatabaseService,
} from './entity/outbox-datasource';
import { CqrsRMQModuleInterface } from '../rmq.cqrs.module';
const getRabbitUri = () => {
  return process.env.RABBIT_URL || 'amqp://127.0.0.1:5672';
};

@Module({})
export class OutboxModule {
  static forRoot(options: CqrsRMQModuleInterface): DynamicModule {
    return {
      module: OutboxModule,
      providers: [OutboxService, OutboxDatabaseService],
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
