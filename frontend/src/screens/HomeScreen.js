import React, { useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Axios from 'axios';
import { getError } from '../utils';

// define reducer function
const reducer = (state, action) => 
{
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, 
        loading: false, 
        error: action.payload 
      };

    default:
      return state;
  }
};

export default function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data: products } = await Axios.get(
          '/api/products/top-products'
        );
        
        dispatch({ type: 'FETCH_SUCCESS', payload: { products } });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };

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
