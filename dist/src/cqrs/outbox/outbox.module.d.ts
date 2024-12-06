import { DynamicModule } from '@nestjs/common';
import { CqrsRMQModuleInterface } from '../rmq.cqrs.module';
export declare class OutboxModule {
    static forRoot(options: CqrsRMQModuleInterface): DynamicModule;
}
