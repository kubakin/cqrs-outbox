import {
  DynamicModule,
  Inject,
  Injectable,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
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
  entities: any[];
}

@Injectable()
export class OutboxDatabaseService implements OnModuleDestroy {
  configuration: any;
  readonly dataSource: DataSource;
  @Inject('OPTIONS') private options: CqrsRMQModuleInterface

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      entities,
      entityPrefix: `${this.options.name}_`,
      namingStrategy: new SnakeNamingStrategy(),
      migrationsRun: true,
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
  }

  async onModuleInit(): Promise<void> {
    // await this.dataSource.initialize();
    try {
      if (!this.dataSource.isInitialized) {
        // dataSource.enti
        await this.dataSource.initialize();
      }
    } catch (error) {
      console.error(error?.message);
    }
    // return dataSource;
    // await addTransactionalDataSource(this.dataSource.manager.connection);

    if (!this.dataSource.isInitialized)
      throw new Error('DataSource is not initialized');
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}

@Module({
  // providers: [DatabaseService],
})
export class OutboxDatabaseModule {
  static async forRoot(options: CqrsRMQModuleInterface): Promise<DynamicModule> {
    return {
      module: OutboxDatabaseModule,
      providers: [OutboxDatabaseService, {provide: "OPTIONS", useValue: options}],
      exports: [OutboxDatabaseService],
    };
  }
}
