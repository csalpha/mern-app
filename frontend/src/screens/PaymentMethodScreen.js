import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentMethodScreen() 
{

  // navigate - is commig from useNavigate hook 
  const navigate = useNavigate();

  // get state and ctxDispatch from useContext
  const { state, dispatch: ctxDispatch } = useContext(Store);

  // get the shippingAddress and paymentMethod from cart in the state
  const { cart: { shippingAddress, paymentMethod } } = state;

  useEffect(() => 
  {
    // if shippingAddress.addres does not exist
    if (!shippingAddress.address) {
        navigate('/shipping');
    }
  },[shippingAddress, navigate] // define variables that we use in useEffect
  );

  // define state for paymentMethodName
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  // define submitHandler function
  const submitHandler = (e) => 
  {
    // prevent refreshing the page
    e.preventDefault();

    // dispatch an action and pass an object
    ctxDispatch({ 
        type: 'SAVE_PAYMENT_METHOD', // action type
        payload: paymentMethodName   // data from backend
    });

    // save user payment Method Name in a browser storage
    localStorage.setItem('paymentMethod', paymentMethodName);

    // redirect user to the next step
    navigate('/placeorder');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
