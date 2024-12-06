"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CqrsRMQModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CqrsRMQModule = exports.ExplorerService1 = void 0;
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const publisher_1 = require("./publisher");
const subscriber_1 = require("./subscriber");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const explorer_service_1 = require("@nestjs/cqrs/dist/services/explorer.service");
const outbox_module_1 = require("./outbox/outbox.module");
const getRabbitUri = () => {
    return process.env.RABBIT_URL || 'amqp://127.0.0.1:5672';
};
class ExplorerService1 {
}
exports.ExplorerService1 = ExplorerService1;
let CqrsRMQModule = CqrsRMQModule_1 = class CqrsRMQModule {
    static forRoot(name = 'referral') {
        return {
            module: CqrsRMQModule_1,
            global: true,
            imports: [
                outbox_module_1.OutboxModule.forRoot(),
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
                    uri: getRabbitUri().split(','),
                }),
            ],
            providers: [
                cqrs_1.CommandBus,
                cqrs_1.QueryBus,
                cqrs_1.EventBus,
                cqrs_1.UnhandledExceptionBus,
                cqrs_1.EventPublisher,
                explorer_service_1.ExplorerService,
                publisher_1.RabbitMQPublisher,
                subscriber_1.RabbitMQSubscriber,
            ],
            exports: [
                cqrs_1.CommandBus,
                cqrs_1.QueryBus,
                cqrs_1.EventBus,
                cqrs_1.UnhandledExceptionBus,
                cqrs_1.EventPublisher,
            ],
        };
    }
    constructor(explorerService, eventBus, commandBus, queryBus, eventSubscriber, eventPublisher) {
        this.explorerService = explorerService;
        this.eventBus = eventBus;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.eventSubscriber = eventSubscriber;
        this.eventPublisher = eventPublisher;
    }
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
};
CqrsRMQModule = CqrsRMQModule_1 = __decorate([
    (0, common_1.Module)({}),
    __metadata("design:paramtypes", [explorer_service_1.ExplorerService,
        cqrs_1.EventBus,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        subscriber_1.RabbitMQSubscriber,
        publisher_1.RabbitMQPublisher])
], CqrsRMQModule);
exports.CqrsRMQModule = CqrsRMQModule;
//# sourceMappingURL=rmq.cqrs.module.js.map