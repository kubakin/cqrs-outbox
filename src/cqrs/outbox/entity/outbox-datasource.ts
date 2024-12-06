import {
  DynamicModule,
  Inject,
  Injectable,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Message } from './outbox.entity';
import { CqrsRMQModuleInterface } from 'src/cqrs/rmq.cqrs.module';

export const entities = [Message];

export interface DatabaseOptions {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

@Injectable()
export class OutboxDatabaseService implements OnModuleDestroy {
  dataSource: DataSource;
  @Inject('OPTIONS') private options: CqrsRMQModuleInterface;

  constructor() {}

  async onModuleInit(): Promise<void> {
    this.dataSource = new DataSource({
      type: 'postgres',
      entities,
      entityPrefix: `${this.options.name}_`,
      namingStrategy: new SnakeNamingStrategy(),
      logging: false,
      synchronize: true,
      applicationName: `${this.options.name}_outbox`,
      name: 'outbox',
      host: this.options.dbOptions.host,
      port: this.options.dbOptions.port,
      database: this.options.dbOptions.database,
      username: this.options.dbOptions.username,
      password: this.options.dbOptions.password,
    });
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
    } catch (error) {
      console.error(error?.message);
    }

    if (!this.dataSource.isInitialized)
      throw new Error('DataSource is not initialized');
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}

@Module({})
export class OutboxDatabaseModule {
  static async forRoot(
    options: CqrsRMQModuleInterface,
  ): Promise<DynamicModule> {
    return {
      module: OutboxDatabaseModule,
      providers: [
        OutboxDatabaseService,
        { provide: 'OPTIONS', useValue: options },
      ],
      exports: [OutboxDatabaseService],
    };
  }
}
