import { Publisher, Subjects, OrderCreatedEvent } from '@pvwtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}