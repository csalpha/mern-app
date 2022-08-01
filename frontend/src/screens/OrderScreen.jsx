import Axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';


// Manage state by reducer hook
// define reducer function

// reducer accept 2 parameters 
// first: current state
// second: action that change the state and create a new state
function reducer(state, action) {

  // check action.type
  switch (action.type) {
    
    case 'FETCH_REQUEST':
      return { ...state, // keep the previous state values
               loading: true, // only update loading to true ( show loading box )
               error: ''      }; // fill the error with empty string
    case 'FETCH_SUCCESS':
      return { ...state, // keep the previous state values
               loading: false, // update loading to false 
               order: action.payload, // fill the order with the order inside action.payload
               error: ''    }; //fill the error with empty string
    case 'FETCH_FAIL':
      return { ...state, // keep the previous state values
               loading: false, // update loading to false
               error: action.payload }; // fill the error with the error message inside action.payload
    case 'PAY_REQUEST':
      return { ...state, // keep the previous state values
               loadingPay: true }; // update loadingPay to true
    case 'PAY_SUCCESS':
      return { ...state, // keep the previous state values
               loadingPay: false, // update loadingPay to false
               successPay: true }; // update successPay to true
    case 'PAY_FAIL':
      return { ...state, // keep the previous state values
               loadingPay: false, // update loadingPay to false
               errorPay: action.payload }; // fill the error with the error message inside action.payload
    case 'PAY_RESET':
      return { ...state, // keep the previous state values
               loadingPay: false, // update loadingPay to false
               successPay: false, // update successPay to false
               errorPay: '' }; //fill the errorPay with empty string
    case 'DELIVER_REQUEST':
      return { ...state, // keep the previous state values
               loadingDeliver: true }; // update loadingDeliver to true
    case 'DELIVER_SUCCESS':
      return { ...state, // keep the previous state values
               loadingDeliver: false, // update loadingDeliver to false
               successDeliver: true }; // update successDeliver to true
    case 'DELIVER_FAIL':
      return { ...state, // keep the previous state values
               loadingDeliver: false, // update loadingDeliver to false
               errorDeliver: action.payload }; // fill the errorDeliver with the error message inside action.payload
    case 'DELIVER_RESET':
      return {
        ...state, // keep the previous state values
        loadingDeliver: false, // update loadingDeliver to false
        successDeliver: false, // update successDeliver to false
        errorDeliver: '', //fill the errorDeliver with empty string
      };
    default:
      // return current state
      return state;
  }
}

// React Component
export default function OrderScreen() {

  // get state from useContext
  const { state } = useContext(Store);

  // get userInfo from state
  // user info is commig from react context
  const { userInfo } = state;

  // get params from useParams
  const params = useParams();

   // get navigate from useNavigate 
  const navigate = useNavigate();

  // get the id from the url parameter (rename id to orderId) 
  const { id: orderId } = params;

  // isPending - state of loadingScript
  // paypalDispatch - function to load this script
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // define order information and dispatch from useReducer
  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true, 
    order: {}, // empty object
    error: '', // empty string
  });

  // define useEffect to get the order information from backend
  useEffect(() => {

    // check userInfo
    if (!userInfo) {
      // redirect user to the login page
      return navigate('/login');
    }

    // define fetchOrder function
    const fetchOrder = async () => {
      try {
        // dispatch an action type 'FETCH_REQUEST' to show loading message
        dispatch({ type: 'FETCH_REQUEST' });

        // send ajax request to '/api/orders/${orderId}' api
        const { data } = await Axios.get(`/api/orders/${orderId}`, {
          //set headers for an authorized request
          // pass an userInfo.token in Bearer
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        // after success api response 
        // dispatch an action type 'FETCH_SUCCESS'
        // and pass the order data inside payload to the reducer
        dispatch({ type: 'FETCH_SUCCESS', payload: data });

      } catch (err) {
        // if there is an error show the error message
        // and get errors comming from utils.js
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    // if order._id does not exist
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) 
    {
      // call fetchOrder function
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      // load paypal script in the frontend
      const loadPaypalScript = async () => 
      {
        // send an ajax request to the backend to get paypal client id
        const { data: clientId } = await Axios.get('/api/keys/paypal', // paypal api
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        // dispatch this action
        paypalDispatch({
          // seting options
          type: 'resetOptions',
          value: {
            'client-id': clientId, // set client-id
            currency: 'EUR', // set currency
          },
        });
        
        // dispatch action type 'setLoadingStatus' to 'pending'
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      // call fucntion
      loadPaypalScript();
    }
  }, 
   // dependecy array to pass all elements and variables that you use in useEffect
   [
    order,
    successPay,
    successDeliver,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
  ]);

  // define createOrder function
  function createOrder(data, actions) {
    // call create on actions.order object and pass the amount
    // based on a order.totalPrice
    // create this order successfully
    return actions.order
      .create({
        purchase_units: [
          {

            amount: { value: order.totalPrice },
          },
        ],
      })
      // then it returns the order id from the paypal
      .then((orderID) => {
        return orderID;
      });
  }

  // define onApprove function
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await Axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });

        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await Axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }
 
  // check loading
  return loading? ( //Loading is true, show LoadingBox
    <LoadingBox></LoadingBox>
  ) : error ? ( //else if error is true, show MessageBox
    <MessageBox variant="danger">{error}</MessageBox>
  ) : ( // else show Order details
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>€{order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>€{order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>€{order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>€{order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </ListGroup.Item>
                )}

                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
