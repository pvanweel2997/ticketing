import { Publisher, Subjects, TicketCreatedEvent } from '@pvwtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

