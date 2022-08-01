import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';


// React Component
export default function Product(props) {
  const { product } = props;

  return (
    /* JSX */
    <Card key={product._id}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title as="h3">{product.name}</Card.Title>
        </Link>

        <Rating
          rating={product.rating}
          numReviews={product.numReviews}>
          </Rating>

        <Card.Text>{product.price} €</Card.Text>
        {product.seller && product.seller.seller && (
          <Link to={`/seller/${product.seller._id}`}>
            {product.seller.seller.name}
          </Link>
        )}
      </Card.Body>
    </Card>
    /* JSX */
  );
}