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
var MessageHandlers_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandlers = exports.MessageHandlerRef = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const msg_1 = require("./msg");
class MessageHandlerRef {
}
exports.MessageHandlerRef = MessageHandlerRef;
let MessageHandlers = MessageHandlers_1 = class MessageHandlers {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
        this.logger = new common_1.Logger(MessageHandlers_1.name);
        this.handlers = new Map();
    }
    get(message) {
        const clazz = msg_1.Messages.getClass(message);
        const handler = this.handlers.get(clazz.name);
        if (!handler) {
            this.logger.warn(`Handler for '${clazz.name}' is not found`);
            return [];
        }
        return handler;
    }
    has(message) {
        const clazz = msg_1.Messages.getClass(message);
        return this.handlers.has(clazz.name);
    }
    register(refs) {
        refs.forEach((it) => this.registerRef(it));
    }
    registerRef(ref) {
        const className = ref.message.name;
        const provider = this.moduleRef.get(ref.provider, { strict: false });
        const handler = (message) => provider[ref.method](message);
        const handlers = this.handlers.get(className) || [];
        handlers.push(handler);
        this.handlers.set(className, handlers);
    }
};
MessageHandlers = MessageHandlers_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], MessageHandlers);
exports.MessageHandlers = MessageHandlers;
//# sourceMappingURL=handlers.js.map