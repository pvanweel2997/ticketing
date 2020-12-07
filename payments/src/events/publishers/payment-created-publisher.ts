import { Publisher, Subjects, PaymentCreatedEvent } from '@pvwtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}