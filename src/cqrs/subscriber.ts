import { Injectable, Logger } from '@nestjs/common';
import { IEvent, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import 'reflect-metadata';

import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { Event } from './msg/event';

@Injectable()
export class RabbitMQSubscriber implements IMessageSource {
  private bridge: Subject<any>;

  readonly logger = new Logger();
  events: Array<any>;

  constructor(private readonly amqpConnection: AmqpConnection) {}

  register(events: any[]) {
    this.events = events;
  }

  async connect(name: string) {
    await this.amqpConnection.createSubscriber<{ name: string; data: any }>(
      async (message) => {
        this.logger.log(`Handled ${message.name} event`);
        if (this.bridge) {
          const clazz = Reflect.getMetadata(message.name, Event);
          console.log(clazz);
          if (clazz) {
            this.logger.log(
              `Start message proccessing. ${message.name} ${JSON.stringify(message.data)}`,
            );
            const receivedEvent = Object.assign(new clazz(), message.data);
            this.bridge.next(receivedEvent);
            this.logger.log(`Message ${message.name} processed.`);
          } else {
            this.logger.warn(`Event ${message.name} skipped`);
          }
          return new Nack(false);
        }

        // throw new Error('))');
      },
      {
        exchange: 'client',
        routingKey: `*.event.#`,
        errorHandler: (channel, msg, e) => {
          throw e;
        },
        queue: `${name}.event`,
      },
      `handler_${name}`,
    );
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject;
  }
}
