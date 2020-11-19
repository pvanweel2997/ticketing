import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@pvwtickets/common';
import { TicketCreatedListener  } from '../ticket-created-listener';  
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';


const setup = async () => {
  // create and instance of a listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // create a fake Message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg};
 
}

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await   setup();

  // call onMessage function with the data object and message object
  await listener.onMessage(data, msg);

  // write assertions that the ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await   setup();

  // call onMessage function with the data object and message object
  await listener.onMessage(data, msg);

  // write assertions too make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});