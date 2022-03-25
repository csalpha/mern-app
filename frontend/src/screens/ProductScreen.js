import Axios from 'axios';
import React, {
  useEffect,
  useReducer,
  useContext
} from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge'
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';

//Manage state by reducer hook
// State is complex
// Next state depends on the previous on
// define reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductScreen() {

  const [{ loading, error, product}, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const params = useParams();
  const { id: slug } = params;

  // useEffect ( async function , array )
  useEffect(() => {
    // async function
    const fetchData = async () => {
      //
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // call an Api ( with ajax request ) and get product from backend
        const { data } = await Axios.get(`/api/products/slug/${slug}`);
        // call FETCH_SUCCESS action and update a state with data
        dispatch({ 
          type: 'FETCH_SUCCESS', // action
          payload: data // new state
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL', // action
          payload: getError(error), // new state
        });
      }
    };
    // call async functionn
    fetchData();
  }, [dispatch, slug]);

    // Get the context
  // Rename dispatch to 'ctxDispatch' - context dispatch
  // by using useContext we can have access to the state of the context
  // and change the context
  const { state, dispatch: ctxDispatch } = useContext(Store);

// to add a item to the cart i need to dispatch 
  // an action on the react context
  const addToCartHandler = async () => {
    ctxDispatch(
      {
        type: 'CART_ADD_ITEM',
        payload: {
          ...product, 
          quntity: 1
        }
      }
    );
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
            src={product.image}
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
            <ListGroup.Item>Pirce : {product.price} €</ListGroup.Item>
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
                    <Col>{product.price} €</Col>
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
