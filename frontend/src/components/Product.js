import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

export default function Product(props) {
  const { product } = props;

  return (
    <Card key={product._id}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title as="h3">{product.name}</Card.Title>
        </Link>

        <Card.Text>{product.price} €</Card.Text>
      </Card.Body>
    </Card>
  );
}
