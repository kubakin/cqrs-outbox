import { Injectable, Type } from '@nestjs/common';
import { IMessage, Messages } from './msg';
import { MessageHandlerRef } from './handlers';

@Injectable()
export class MessageRegistry {
  messages: Map<string, Type<IMessage>> = new Map();

  get(messageName: string): Type<IMessage> {
    const messageClass = this.messages.get(messageName);
    if (!messageClass)
      throw new Error(`Message class for '${messageName}' not found.`);

    return messageClass;
  }

  has(messageName: string) {
    return this.messages.has(messageName);
  }

  fromRaw(name: string, data: Record<string, unknown>): IMessage {
    const clazz = this.get(name);
    return Object.assign(new clazz(), data);
  }

  register(message: Type<IMessage>) {
    const messageName = Messages.getName(message);
    this.messages.set(messageName, message);
  }

  registerFromHandlers(refs: MessageHandlerRef[] = []) {
    refs.map((it) => it.message).forEach((it) => this.register(it));
  }
}
