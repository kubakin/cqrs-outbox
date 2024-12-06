import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IMessage } from './msg';
export type IMessageHandler<T extends IMessage = IMessage> = (message: T) => Promise<void>;
export declare class MessageHandlerRef {
    provider: Type;
    method: string;
    message: Type<IMessage>;
}
export declare class MessageHandlers {
    private readonly moduleRef;
    private logger;
    handlers: Map<string, IMessageHandler[]>;
    constructor(moduleRef: ModuleRef);
    get<T extends IMessage>(message: T): IMessageHandler<T>[];
    has(message: IMessage): boolean;
    register(refs: MessageHandlerRef[]): void;
    registerRef(ref: MessageHandlerRef): void;
}
