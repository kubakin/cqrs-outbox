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
exports.MessageCleaner = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const luxon_1 = require("luxon");
const schedule_1 = require("@nestjs/schedule");
const outbox_datasource_1 = require("./entity/outbox-datasource");
const event_1 = require("../msg/event");
let MessageCleaner = class MessageCleaner {
    constructor(service) {
        this.service = service;
    }
    async clean() {
        await this.service.dataSource.manager.getRepository(event_1.Message).delete({
            published: true,
            publishedAt: (0, typeorm_1.LessThan)(luxon_1.DateTime.fromJSDate(new Date()).minus({ days: 1 }).toJSDate()),
        });
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessageCleaner.prototype, "clean", null);
MessageCleaner = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [outbox_datasource_1.OutboxDatabaseService])
], MessageCleaner);
exports.MessageCleaner = MessageCleaner;
//# sourceMappingURL=message-cleaner.js.map