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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQSubscriber = void 0;
const common_1 = require("@nestjs/common");
require("reflect-metadata");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const event_1 = require("./msg/event");
let RabbitMQSubscriber = class RabbitMQSubscriber {
    constructor(amqpConnection) {
        this.amqpConnection = amqpConnection;
        this.logger = new common_1.Logger();
    }
    register(events) {
        this.events = events;
    }
    async connect(name) {
        await this.amqpConnection.createSubscriber(async (message) => {
            this.logger.log(`Handled ${message.name} event`);
            if (this.bridge) {
                const clazz = Reflect.getMetadata(message.name, event_1.Event);
                if (clazz) {
                    this.logger.log(`Start message proccessing. ${message.name} ${JSON.stringify(message.data)}`);
                    const receivedEvent = Object.assign(new clazz(), message.data);
                    this.bridge.next(receivedEvent);
                    this.logger.log(`Message ${message.name} processed.`);
                }
                else {
                    this.logger.warn(`Event ${message.name} skipped`);
                }
                return new nestjs_rabbitmq_1.Nack(false);
            }
        }, {
            exchange: 'client',
            routingKey: `*.event.#`,
            errorHandler: (channel, msg, e) => {
                throw e;
            },
            queue: `${name}.event`,
        }, `handler_${name}`);
    }
    bridgeEventsTo(subject) {
        this.bridge = subject;
    }
};
RabbitMQSubscriber = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_rabbitmq_1.AmqpConnection])
], RabbitMQSubscriber);
exports.RabbitMQSubscriber = RabbitMQSubscriber;
//# sourceMappingURL=subscriber.js.map