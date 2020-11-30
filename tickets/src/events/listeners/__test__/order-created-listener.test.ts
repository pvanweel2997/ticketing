import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../../listeners/order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@pvwtickets/common';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '1345'
  })

  await ticket.save();

  // create the fake data
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt:'12342342',
    ticket: {
        id: ticket.id,
        price: ticket.price
    }

  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg};
}

it('sets the id of the order', async () => {
  const { listener, data, msg, ticket} = await setup();

  await listener.onMessage(data,msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id)

})

it('acks the message', async () => {
  const { listener, data, msg, ticket} = await setup();

  await listener.onMessage(data,msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(msg.ack).toHaveBeenCalled();

})

it('publishes a ticket updated event', async() => {
  const { listener, data, msg, ticket} = await setup();

  await listener.onMessage(data,msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  const {id, title, price, orderId } = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  
  expect(title).toEqual(ticket.title);
  expect(price).toEqual(ticket.price);
  expect(orderId).toEqual(data.id);
})