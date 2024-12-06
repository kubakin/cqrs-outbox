import { Injectable, Logger, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IMessage, Messages } from './msg';

export type IMessageHandler<T extends IMessage = IMessage> = (
  message: T,
) => Promise<void>;

export class MessageHandlerRef {
  provider: Type;
  method: string;
  message: Type<IMessage>;
}

@Injectable()
export class MessageHandlers {
  private logger = new Logger(MessageHandlers.name);

  handlers: Map<string, IMessageHandler[]> = new Map();

  constructor(private readonly moduleRef: ModuleRef) {}

  get<T extends IMessage>(message: T): IMessageHandler<T>[] {
    const clazz = Messages.getClass(message);

    const handler = this.handlers.get(clazz.name);
    if (!handler) {
      this.logger.warn(`Handler for '${clazz.name}' is not found`);
      return [];
    }

    return handler;
  }

  has(message: IMessage) {
    const clazz = Messages.getClass(message);
    return this.handlers.has(clazz.name);
  }

  register(refs: MessageHandlerRef[]) {
    refs.forEach((it) => this.registerRef(it));
  }

  registerRef(ref: MessageHandlerRef) {
    const className = ref.message.name;
    const provider = this.moduleRef.get(ref.provider, { strict: false });
    const handler = (message: IMessage) => provider[ref.method](message);

    const handlers = this.handlers.get(className) || [];
    handlers.push(handler);
    this.handlers.set(className, handlers);
  }
}
