import Axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge'
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { Store } from '../Store';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';


// Manage state by reducer hook
// define reducer function

// reducer accept 2 parameters and return an object
// first: current state
// second: action that change the state and create a new state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': 

      return { ...state, // keep the previous state values
               loading: true  };// only update loading to true ( show loading box )    

    case 'FETCH_SUCCESS':
      return { ...state, // keep the previous state values
                product: action.payload, // fill the product with the product inside action.payload
                loading: false }; // updadte loading to false

    case 'FETCH_FAIL':
      return { ...state, // keep the previous state values
                loading: false, // updadte loading to false
                error: action.payload // fill the error with the error message inside action.payload
              };
    default:
      return state; // return current state
  }
};

export default function ProductScreen() {

  // to add a item to the cart, i need to dispatch an action on the react context
  
  // Get the context
  // Rename dispatch to 'ctxDispatch' - context dispatch
  // by using useContext we can have access to the state of the context
  // and change the context
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart } = state;
  const [{ loading, error, product }, dispatch] =
    useReducer(reducer, { loading: true, error: ''});
  
  // useNavigate hook
  const navigate = useNavigate();

  const params = useParams();
  const { id: slug } = params;

  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // call an Api ( with ajax request ) and get product from backend
        const { data } = await Axios.get(`/api/products/slug/${slug}`);
        dispatch({ 
          type: 'FETCH_SUCCESS',  // action
          payload: data // new state
      });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL', // action
          payload: getError(error),  // new state
        });
      }
    };

    fetchData();
  }, [dispatch, slug]);

  // to add a item to the cart i need to dispatch 
  // an action on the react context

  const addToCartHandler = async () => {
    // exist item
    const existItem = cart.cartItems.find((x) => x._id === product._id);

    // quantity
    const quantity = existItem ? existItem.quantity + 1 : 1;

    // ajax request to get data product
    const { data } = await Axios.get(`/api/products/${product._id}`);

    //
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    // dispatch action 
    // payload - pass the product and the quantity
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    
    // Redirect user to the cart screen
    navigate('/cart');
  };
  
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={selectedImage || product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : €{product.price}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  Seller{' '}
                  <h2>
                    <Link to={`/seller/${product.seller._id}`}>
                      {product.seller.seller.name}
                    </Link>
                  </h2>
                  <Rating
                    rating={product.seller.seller.rating}
                    numReviews={product.seller.seller.numReviews}
                  ></Rating>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Pirce:</Col>
                    <Col>€{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
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
