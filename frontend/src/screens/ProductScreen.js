import React, { useEffect, useState } from "react";
import {Link,useParams} from 'react-router-dom';
import Axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';


export default function ProductScreen(){
    
    const [product, setProducts] = useState([]);
    const params = useParams();
    const { id: slug } = params;

    useEffect(() => {
        const fetchData = async () => {
          
          try {
            const { data } = await Axios.get(`/api/products/slug/${slug}`);
            setProducts(data);
          } catch (error) {
            
         
          }
        };
        fetchData();
      }, []);
      

      // // console.log(product.seller._id)

    return(
    <div>
      <Row>
        <Col md={6}>
          <img className="img-large"
          src={product.image}
          alt={product.name}>
          </img>
        </Col>

        <Col md={3}>
          <ListGroup.Item>
            <h1>{product.name}</h1>
          </ListGroup.Item>

          <ListGroup.Item>
            Price: {product.price} €
          </ListGroup.Item>
          
          <ListGroup.Item>
            Description:
            <p>{product.description}</p>
          </ListGroup.Item>
        
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  Seller{' '}

                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Price:
                    </Col>

                    <Col>
                      {product.price} €
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Status:
                    </Col>

                    <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg="success">In Stock</Badge>
                    ):
                    (<Badge bg="danger">Unavailable</Badge>)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button variant="primary">
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

































