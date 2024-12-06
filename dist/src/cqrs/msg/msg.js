"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const event_1 = require("./event");
class Messages {
    static validate(message) {
        const { constructor } = Object.getPrototypeOf(message);
        if (!Reflect.hasMetadata(event_1.MESSAGE_METADATA, constructor)) {
            throw new Error(`Class '${constructor.name}' is not a message`);
        }
    }
    static getName(message) {
        if (!Reflect.hasMetadata(event_1.MESSAGE_METADATA, message)) {
            throw new Error(`Class '${message.name}' is not a message`);
        }
        return Reflect.getMetadata(event_1.MESSAGE_METADATA, message);
    }
    static getNameFromInstance(message) {
        const clazz = Messages.getClass(message);
        return Messages.getName(clazz);
    }
    static getClass(message) {
        const { constructor } = Object.getPrototypeOf(message);
        return constructor;
    }
    static getClassName(message) {
        return Messages.getClass(message).name;
    }
    static build(type, data) {
        return Object.assign(new type(), data);
    }
}
exports.Messages = Messages;
//# sourceMappingURL=msg.js.map