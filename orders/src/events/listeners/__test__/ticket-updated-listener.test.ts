import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedListener } from '../../listeners/ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@pvwtickets/common';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })

  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 30,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  // returns all this stuff
  return { listener, data, msg, ticket};
}

it('finds, updates and saves a ticket', async () => {
  const { data, msg, listener, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(1);
})

it('acks the message', async () => {
  const { data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { data, msg, listener, ticket } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data,msg);
  } catch (error) {

  }

  expect(msg.ack).not.toHaveBeenCalled();

})