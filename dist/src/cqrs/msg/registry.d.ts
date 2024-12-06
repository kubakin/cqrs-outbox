import { Type } from '@nestjs/common';
import { IMessage } from './msg';
import { MessageHandlerRef } from './handlers';
export declare class MessageRegistry {
    messages: Map<string, Type<IMessage>>;
    get(messageName: string): Type<IMessage>;
    has(messageName: string): boolean;
    fromRaw(name: string, data: Record<string, unknown>): IMessage;
    register(message: Type<IMessage>): void;
    registerFromHandlers(refs?: MessageHandlerRef[]): void;
}
