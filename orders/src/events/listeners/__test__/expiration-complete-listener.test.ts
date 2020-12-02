import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { OrderStatus, ExpirationCompleteEvent } from '@pvwtickets/common';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'movie',
    price: 20

  })

  await ticket.save();

  const order = Order.build({
    userId: 'xsdfsdfs',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // create a fake Message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, ticket, data, msg}

};

it('updates the order status to cancelled', async () => {
  const { ticket, order, data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});


it('emits an ordercancelled event', async () => {
  const {  order, data, msg, listener } = await setup();

  await listener.onMessage(data, msg);
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acks the message', async () => {
  const { order, data, msg, listener } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});