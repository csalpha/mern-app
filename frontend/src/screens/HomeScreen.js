import React, { useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { getError } from '../utils';

// Manage state by reducer hook
// define reducer function

// reducer accept 2 parameters 
// first: current state
// second: action that change the state and create a new state
const reducer = (state, action)=> {
  switch(action.type){
    // it happens when we start sending ajax request
    case 'FETCH_REQUEST':
      return {
        ...state, // keep the previous state values
        loading: true // only update loading to true ( show loading box )
      }
    case 'FETCH_SUCCESS':
      return{
        ...state, // keep the previous state values
        products: action.payload.products, //contains all products from backend
        sellers: action.payload.sellers, //constains all sellers from backend
        loading: false // no need to show loading box
      }
    case 'FETCH_FAIL':
      return{
        ...state, // keep the previous state values
        loading: false,
        error: action.payload // fill the error with the error message inside action.payload
      }
    default: 
      return state; // current state
  }
}



export default function HomeScreen() {

  // define a array that contain two values
  // 1st - object that contains loading. error, products, sellers
  // 2nd - dispatch - call an action and update the state 
  // useReducer accept two parameters 
  // 1st one - reducer
  // 2nd one - default state object
  const [{ loading, error, products, sellers }, dispatch] = useReducer(
    reducer,
    {
      loading: true, // show loading in the begining
      error: '',   // no error in the begining
    }
  );

  // useEffect ( async function , array )
  useEffect(() => {
    // async function
    const fetchData = async () => {
      // set loading to true by dispatching FETCH_REQUEST action
      dispatch({ type: 'FETCH_REQUEST' }); // accept a object
      try {
        // call an Api ( with ajax request ) and get products from backend
        const { data: products } = await Axios.get(
          '/api/products/top-products'
        );
        //call an Api ( with ajax request ) and get sellers from backend
        const { data: sellers } = await Axios.get(
          '/api/users/top-sellers'
        );
        // call FETCH_SUCCESS action and update a state with products and sellers from backend
        dispatch({ type: 'FETCH_SUCCESS', payload: { products, sellers } });
      } catch (error) {
        // if there is a an error
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    // call async function
    fetchData();
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
          <h2>Featured Products</h2>
          {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
          <Row>
            {products.map((product) => (
              <Col sm={6} md={4} lg={3} key={product._id} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>

        </>
      )}
    </div>
  );
}
