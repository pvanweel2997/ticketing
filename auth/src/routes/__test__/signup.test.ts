import request from 'supertest';
import { app } from '../../app';

it('it returns 201 on successful argument', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('it returns 400 with an invalid email', async()=> {
  return request(app)
  .post('/api/users/signup')
  .send({
    email: 'testtest.com',
    password: 'password'
  })
  .expect(400);
});

it('it returns 400 with an invalid password', async()=> {
  return request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'p'
  })
  .expect(400);
});

it('it returns 400 with missing email and password', async()=> {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com'
  })
  .expect(400);
  
  await request(app)
  .post('/api/users/signup')
  .send({
    password: 'p'
  })
  .expect(400);
});

it('disallows duplicate emails',async () => {
  await request(app)
   .post('/api/users/signup')
   .send({
     email: 'test@test.com',
     password: 'password'
  })
  .expect(201);

  await request(app)
   .post('/api/users/signup')
   .send({
     email: 'test@test.com',
     password: 'password'
  })
  .expect(400);
})

it('sets a cookie after successful signupt', async() => {
  const response = await request(app)
   .post('/api/users/signup')
   .send({
     email: 'test@test.com',
     password: 'password'
  })
  .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
})