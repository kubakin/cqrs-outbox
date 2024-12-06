"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EVENT_METADATA = exports.Message = exports.MESSAGE_METADATA = void 0;
require("reflect-metadata");
exports.MESSAGE_METADATA = "_message";
const Message = (name) => (target) => {
    Reflect.defineMetadata(exports.MESSAGE_METADATA, name, target);
};
exports.Message = Message;
exports.EVENT_METADATA = "_event";
const Event = (name) => (target) => {
    (0, exports.Message)(name)(target);
    Reflect.defineMetadata(name, target, exports.Event);
};
exports.Event = Event;
//# sourceMappingURL=event.js.map