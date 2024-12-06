import "reflect-metadata";

export const MESSAGE_METADATA = "_message";

export const Message =
  (name: string): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(MESSAGE_METADATA, name, target);
  };

export const EVENT_METADATA = "_event";

export const Event =
  (name: string): ClassDecorator =>
  (target: any) => {
    Message(name)(target);
    Reflect.defineMetadata(name, target, Event);
  };
