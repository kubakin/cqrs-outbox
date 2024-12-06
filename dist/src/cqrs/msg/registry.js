"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRegistry = void 0;
const common_1 = require("@nestjs/common");
const msg_1 = require("./msg");
let MessageRegistry = class MessageRegistry {
    constructor() {
        this.messages = new Map();
    }
    get(messageName) {
        const messageClass = this.messages.get(messageName);
        if (!messageClass)
            throw new Error(`Message class for '${messageName}' not found.`);
        return messageClass;
    }
    has(messageName) {
        return this.messages.has(messageName);
    }
    fromRaw(name, data) {
        const clazz = this.get(name);
        return Object.assign(new clazz(), data);
    }
    register(message) {
        const messageName = msg_1.Messages.getName(message);
        this.messages.set(messageName, message);
    }
    registerFromHandlers(refs = []) {
        refs.map((it) => it.message).forEach((it) => this.register(it));
    }
};
MessageRegistry = __decorate([
    (0, common_1.Injectable)()
], MessageRegistry);
exports.MessageRegistry = MessageRegistry;
//# sourceMappingURL=registry.js.map