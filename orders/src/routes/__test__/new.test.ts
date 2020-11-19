import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';


it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie',global.signin())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved',async () => {
    const ticket = await Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20
    });

    await ticket.save();
    const order = await Order.build({
      userId: 'pat',
      status: OrderStatus.Created,
      ticket,
      expiresAt: new Date()
    })
    await order.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie',global.signin())
      .send({ ticketId: ticket.id })
      .expect(400)

})

it('reserves a ticket',async () => {
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const response = await request(app)
  .post('/api/orders')
  .set('Cookie',global.signin())
  .send({ ticketId: ticket.id })
  .expect(201)

  const ticketOrdered = response.body.ticket;
  expect(ticketOrdered.title).toEqual(ticket.title);
  expect(ticketOrdered.price).toEqual(ticket.price);
});

it('emits and order created event', async () => {
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const response = await request(app)
  .post('/api/orders')
  .set('Cookie',global.signin())
  .send({ ticketId: ticket.id })
  .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});