import request from 'supertest';
import { app } from '..//../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';

it('it fetches the order', async () => {
  
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })

  await ticket.save();
  const user = global.signin();
  

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201); 

  // make a request to fetch this order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie',user)
    .send()
    .expect(200)
    expect(fetchedOrder.id).toEqual(order.id);
})

it('it returns an error if one user tries to fetch an order of another user', async () => {
  
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })

  await ticket.save();
  const user = global.signin();
  

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201); 

  // make a request to fetch this order with a wrong user id
   await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie',global.signin())
    .send()
    .expect(401)
})

