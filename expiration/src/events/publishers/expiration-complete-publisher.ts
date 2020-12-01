import { Publisher, Subjects, ExpirationCompleteEvent } from '@pvwtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}