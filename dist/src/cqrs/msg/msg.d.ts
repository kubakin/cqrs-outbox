import { Type } from '@nestjs/common';
export interface IMessage {
}
export declare class Messages {
    static validate(message: IMessage): void;
    static getName(message: Type<IMessage>): any;
    static getNameFromInstance(message: IMessage): any;
    static getClass(message: IMessage): Type<IMessage>;
    static getClassName(message: IMessage): string;
    static build<T extends IMessage>(type: Type<T>, data: T): T;
}
