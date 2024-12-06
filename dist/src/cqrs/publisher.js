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
exports.RabbitMQPublisher = void 0;
const common_1 = require("@nestjs/common");
const msg_1 = require("./msg/msg");
const outbox_datasource_1 = require("./outbox/entity/outbox-datasource");
const outbox_entity_1 = require("./outbox/entity/outbox.entity");
const typeorm_1 = require("@nestjs/typeorm");
let RabbitMQPublisher = class RabbitMQPublisher {
    constructor(service) {
        this.service = service;
    }
    connect() {
        console.log('Cqrs rabbit connected');
    }
    publish(event) {
        const routingKey = msg_1.Messages.getNameFromInstance(event);
        const message = new outbox_entity_1.Message((0, typeorm_1.generateString)(), routingKey, event, new Date());
        this.messageRepo.save(message).then().catch(console.log);
    }
    get messageRepo() {
        return this.service.dataSource.manager.getRepository(outbox_entity_1.Message);
    }
};
RabbitMQPublisher = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [outbox_datasource_1.OutboxDatabaseService])
], RabbitMQPublisher);
exports.RabbitMQPublisher = RabbitMQPublisher;
//# sourceMappingURL=publisher.js.map