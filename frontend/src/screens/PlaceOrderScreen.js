import Axios from 'axios';
import React, { useContext, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';

// Manage state by reducer hook
// define reducer function

// reducer accept 2 parameters 
// first: current state
// second: action that change the state and create a new state
const reducer = (state, action) => {

  // check action.type
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, // keep the previous state values
               product: action.payload }; // fill the product with the product inside action.payload
               
    // dispatch this action right before sending ajax request to create an Order
    case 'FETCH_REQUEST':
      return { ...state, // keep the previous state values
               loading: true }; // only update loading to true ( show loading box )
    case 'FETCH_SUCCESS':
      return { ...state, // keep the previous state values
               product: action.payload, // fill the product with the product inside action.payload
               loading: false }; // updadte loading to false
    case 'FETCH_FAIL':
      return { ...state, // keep the previous state values
               loading: false, 
               error: action.payload }; // fill the error with the error message inside action.payload
    case 'CREATE_REQUEST':
      return { ...state, // keep the previous state values
               loadingCreateReview: true }; // set loading to true
    case 'CREATE_SUCCESS':
      return { ...state, // keep the previous state values
               loadingCreateReview: false }; // set loading to false
    case 'CREATE_FAIL':
      return { ...state, // keep the previous state values
               loadingCreateReview: false }; // set loading to false
    default:
      // return current state
      return state;
  }
};

export default function PlaceOrderScreen(props) {

  // navigate - is commig from useNavigate hook 
  const navigate = useNavigate();

  // get loading, error and dispatch from useReducer
  // define a array that contain two values
  // 1st - object that contains loading and error
  // 2nd - dispatch - call an action and update the state 
  // useReducer accept two parameters 
  // 1st one - reducer
  // 2nd one - default state object
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,  // show loading in the begining
    error: '', // no error in the begining
  });

   // get state and ctxDispatch from useContext
  const { state, dispatch: ctxDispatch } = useContext(Store);

  // get cart and userInfo from state
  const { cart, userInfo } = state;

  // if cart.paymentMethod does not exist
  if (!cart.paymentMethod) {
    // redirect user to payment
    navigate('/payment');
  }

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  //cart.taxPrice = round2(0 * cart.itemsPrice);
  cart.taxPrice = round2(0);
  //cart.taxPrice = round2(0.23 * cart.itemsPrice);

  
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => 
  {
    // define try catch block
    try 
    {
      // dispatch CREATE_REQUEST action
      dispatch({ type: 'CREATE_REQUEST' });

      // send ajax request using Axios library
      // call an Api ( with ajax request ) and get orders from backend
      // send ajax request to api : '/api/orders'
      // data is commig from backend
      const { data } = await Axios.post(
        '/api/orders', // api orders
        // data that i'm going to send to the backend to create an order
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          // with this option this api is authenticated in the server
          // I can detect if the request is comming from a logged in user or a hacker
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // dispatch CART_CLEAR action
      // this one goes to the Store.js
      ctxDispatch({ type: 'CART_CLEAR' });

      // dispatch CREATE_SUCCESS action
      // this one goes to the reducer
      dispatch({ type: 'CREATE_SUCCESS' });

      // remove items from localStorage
      // shopping cart should be clear for the next order
      localStorage.removeItem('cartItems');

      // redirect user to the order details page
      // pass the created order ( data.order._id ) from backend to frontend 
      navigate(`/order/${data.order._id}`);
    } 
    catch (err)
    {
      // dispatch CREATE_FAIL action
      // this one goes to the reducer
      dispatch({ type: 'CREATE_FAIL' });

      // use toast.error to show the error message to the user
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
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
                      <Col md={3}>€{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>€{cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>€{cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>€{cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>€{cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                  {error && <MessageBox variant="danger">{error}</MessageBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
