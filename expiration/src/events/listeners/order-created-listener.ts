import { Listener, OrderCreatedEvent, Subjects } from '@pvwtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg:Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('delay2',delay);

    await expirationQueue.add(
      {
        orderId: data.id
      },
      {
        delay: delay,
      }
    );

    msg.ack();
  }
}