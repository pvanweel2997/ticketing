import{ useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => {
      console.log(payment)
    }
  });

  useEffect(()  => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    }
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);  // call every second

    return () => {    // this method is invoked by useEffect when navigating away from the current page
      clearInterval(timerId);
    }
  },[order])

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }
 
  return (
    <div>Time left to pay: {timeLeft} seconds
    <StripeCheckout
      token={({ id }) => doRequest({ token: id })}
      stripeKey="pk_test_51HuNXIL68uRTFa7GvnYPr4H2mKKFc9sd8YGrxp7UjqLPIJUVZrEL4gXaKIM5hT3Kf20t5AFNvdGA9TyaTcRl1A5U00EU0ifHgX"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
    </div>
  )
};

OrderShow.getInitialProps = async (context, client) => {
  // pull orderId out of the url
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data}
}

export default OrderShow;