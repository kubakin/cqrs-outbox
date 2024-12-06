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
exports.OutboxService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const outbox_entity_1 = require("./outbox.entity");
const outbox_datasource_1 = require("./outbox-datasource");
let OutboxService = class OutboxService {
    constructor(connection, service) {
        this.connection = connection;
        this.service = service;
        this.isRun = false;
    }
    async publish() {
        if (!this.service.dataSource.isInitialized) {
            await this.service.dataSource.initialize();
        }
        const queryRunner = this.service.dataSource.createQueryRunner();
        await queryRunner.connect();
        const repo = queryRunner.manager.getRepository(outbox_entity_1.Message);
        try {
            if (this.isRun)
                return;
            this.isRun = true;
            await queryRunner.startTransaction('SERIALIZABLE');
            const unPublishedMessages = await repo.find({
                where: { published: false },
                order: { number: 'ASC' },
                transaction: true,
                lock: {
                    mode: 'pessimistic_write',
                },
            });
            unPublishedMessages.forEach((message) => message.publish());
            for (const message of unPublishedMessages)
                await this.connection.publish('client', message.name, {
                    name: message.name,
                    data: message.data,
                });
            await repo.save(unPublishedMessages, {
                transaction: true,
            });
            await queryRunner.commitTransaction();
        }
        catch (e) {
        }
        finally {
            this.isRun = false;
            await queryRunner.release();
        }
    }
};
__decorate([
    (0, schedule_1.Interval)(10),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OutboxService.prototype, "publish", null);
OutboxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_rabbitmq_1.AmqpConnection,
        outbox_datasource_1.OutboxDatabaseService])
], OutboxService);
exports.OutboxService = OutboxService;
//# sourceMappingURL=outbox.service.js.map