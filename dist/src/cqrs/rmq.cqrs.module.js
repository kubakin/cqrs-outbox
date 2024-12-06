"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CqrsRMQModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CqrsRMQModule = exports.ExplorerService1 = void 0;
const common_1 = require("@nestjs/common");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const publisher_1 = require("./publisher");
const subscriber_1 = require("./subscriber");
const common_2 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const explorer_service_1 = require("@nestjs/cqrs/dist/services/explorer.service");
const outbox_module_1 = require("./outbox/outbox.module");
__exportStar(require("@nestjs/cqrs"), exports);
class ExplorerService1 {
}
exports.ExplorerService1 = ExplorerService1;
let CqrsRMQModule = CqrsRMQModule_1 = class CqrsRMQModule {
    static forRoot(options) {
        return {
            module: CqrsRMQModule_1,
            global: true,
            imports: [
                outbox_module_1.OutboxModule.forRoot(options),
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
            providers: [
                { provide: 'OPTIONS', useValue: options },
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
    constructor(explorerService, eventBus, commandBus, queryBus, eventSubscriber, eventPublisher, options) {
        this.explorerService = explorerService;
        this.eventBus = eventBus;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.eventSubscriber = eventSubscriber;
        this.eventPublisher = eventPublisher;
        this.options = options;
    }
    async onApplicationBootstrap() {
        console.log('init');
        await this.eventSubscriber.connect(this.options.name);
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
    (0, common_2.Module)({}),
    __param(6, (0, common_1.Inject)('OPTIONS')),
    __metadata("design:paramtypes", [explorer_service_1.ExplorerService,
        cqrs_1.EventBus,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        subscriber_1.RabbitMQSubscriber,
        publisher_1.RabbitMQPublisher, Object])
], CqrsRMQModule);
exports.CqrsRMQModule = CqrsRMQModule;
//# sourceMappingURL=rmq.cqrs.module.js.map