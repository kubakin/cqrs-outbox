import {
  DynamicModule,
  Global,
  Injectable,
  Module,
  OnApplicationBootstrap,
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

export const entities = [Message];

interface WriteConnection {
  readonly startTransaction: (
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(
    target: EntityTarget<T>,
  ) => Repository<T>;
  readonly query: (query: string) => Promise<void>;
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ) => SelectQueryBuilder<Entity>;
}

export interface DatabaseOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  entities: any[];
}

@Injectable()
export class OutboxDatabaseService implements OnModuleDestroy {
  configuration: any;
  readonly dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      entities,
      migrations: ['migrations/referral/*{.ts,.js}'],
      migrationsTableName: 'referral_migrations',
      entityPrefix: 'referral_',
      namingStrategy: new SnakeNamingStrategy(),
      migrationsRun: true,
      logging: false,
      synchronize: true,
      applicationName: 'outbox',
      name: 'default',
      host: 'localhost',
      port: 5432,
      database: 'mlreferral',
      username: 'postgres',
      password: 'postgres',
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
  static async forRoot(): Promise<DynamicModule> {
    // const service = new DatabaseService();
    // await service.onModuleInit();
    return {
      module: OutboxDatabaseModule,
      providers: [OutboxDatabaseService],
      exports: [OutboxDatabaseService],
      // exports: providers,
    };
  }
}
