"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OutboxModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const schedule_1 = require("@nestjs/schedule");
const outbox_service_1 = require("./entity/outbox.service");
const outbox_datasource_1 = require("./entity/outbox-datasource");
const getRabbitUri = () => {
    return process.env.RABBIT_URL || 'amqp://127.0.0.1:5672';
};
let OutboxModule = OutboxModule_1 = class OutboxModule {
    static forRoot(options) {
        return {
            module: OutboxModule_1,
            providers: [
                outbox_service_1.OutboxService,
                outbox_datasource_1.OutboxDatabaseService,
                { provide: 'OPTIONS', useValue: options },
            ],
            exports: [outbox_datasource_1.OutboxDatabaseService],
            imports: [
                outbox_datasource_1.OutboxDatabaseModule.forRoot(options),
                schedule_1.ScheduleModule.forRoot(),
                nestjs_rabbitmq_1.RabbitMQModule.forRoot(nestjs_rabbitmq_1.RabbitMQModule, {
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
};
OutboxModule = OutboxModule_1 = __decorate([
    (0, common_1.Module)({})
], OutboxModule);
exports.OutboxModule = OutboxModule;
//# sourceMappingURL=outbox.module.js.map