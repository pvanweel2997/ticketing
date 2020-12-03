import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@pvwtickets/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns a 404 when purching an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie',global.signin())
    .send({
      token: 'xdfasdfas',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns a 401 when purching an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created
  })

  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie',global.signin())
    .send({
      token: 'xdfasdfas',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purching a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 20,
    status: OrderStatus.Cancelled
  })

  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie',global.signin(userId))
  .send({
    token: 'xdfasdfas',
    orderId: order.id
  })
  .expect(400);
  
});

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 20,
    status: OrderStatus.Created
  })

  await order.save();
  await request(app)
  .post('/api/payments')
  .set('Cookie',global.signin(userId))
  .send({
    token: 'tok_visa',
    orderId: order.id
  })
  .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});