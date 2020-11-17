import { Publisher, OrderCancelledEvent,Subjects } from '@pvwtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}