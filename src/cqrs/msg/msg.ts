import { Type } from '@nestjs/common';
import { MESSAGE_METADATA } from './event';

export interface IMessage {}

export class Messages {
  public static validate(message: IMessage) {
    const { constructor } = Object.getPrototypeOf(message);

    if (!Reflect.hasMetadata(MESSAGE_METADATA, constructor)) {
      throw new Error(`Class '${constructor.name}' is not a message`);
    }
  }

  public static getName(message: Type<IMessage>) {
    if (!Reflect.hasMetadata(MESSAGE_METADATA, message)) {
      throw new Error(`Class '${message.name}' is not a message`);
    }

    return Reflect.getMetadata(MESSAGE_METADATA, message);
  }

  public static getNameFromInstance(message: IMessage) {
    const clazz = Messages.getClass(message);
    return Messages.getName(clazz);
  }

  public static getClass(message: IMessage): Type<IMessage> {
    const { constructor } = Object.getPrototypeOf(message);
    return constructor;
  }

  public static getClassName(message: IMessage): string {
    return Messages.getClass(message).name;
  }

  public static build<T extends IMessage>(type: Type<T>, data: T): T {
    return Object.assign(new type(), data);
  }
}
