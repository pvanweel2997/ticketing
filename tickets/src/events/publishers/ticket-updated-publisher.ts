import { Publisher, Subjects, TicketUpdatedEvent } from '@pvwtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

