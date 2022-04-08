import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';


export default function ShippingAddressScreen(){

   // get state and ctxDispatch from useContext
   const { state, dispatch: ctxDispatch } = useContext(Store);

   // get the shippingAddress from cart in the state
   // get userInfo from the state
   const { userInfo, cart: { shippingAddress },} = state;

   // navigate - is commig from useNavigate hook 
   const navigate = useNavigate();

   // define react hook

   //if shippingAddress.fullName exists use  it, otherwise make it empty string
   const [fullName, setFullName] = useState(shippingAddress.fullName || '');

   //if shippingAddress.address exists use  it, otherwise make it empty string
   const [address, setAddress] = useState(shippingAddress.address || '');

   //if shippingAddress.city exists use  it, otherwise make it empty string
   const [city, setCity] = useState(shippingAddress.city || '');

   //if shippingAddress.postalCode exists use  it, otherwise make it empty string
   const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
 
   //if shippingAddress.country exists use  it, otherwise make it empty string
   const [country, setCountry] = useState(shippingAddress.country || '');
    
  useEffect( () =>{
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]
  )

    const submitHandler = (e) => {
        // prevent refreshing the page
        e.preventDefault();

        ctxDispatch({
          // dispatch action
          type: 'SAVE_SHIPPING_ADDRESS',
          // dispatch shippingAdress object 
          payload: {
            fullName,
            address,
            city,
            postalCode,
            country
          }
        });

        // save the shipping address in localStorage
        localStorage.setItem(
          'shippingAddress',
          // convert js object to json string
          JSON.stringify(
          {
            fullName,
            address,
            city,
            postalCode,
            country
          }
          )
        );

        // navigate user to the payment page
        navigate('/payment');
    }

    return(
      <div>
        <CheckoutSteps step1 step2></CheckoutSteps>
        <div className="container small-container">

          <Helmet>
            <title>Shipping Address</title>
          </Helmet>
          
          <h1 className="my-3">Shipping Address</h1>

          <form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
              value={fullName}
              onChange={(e)=> setFullName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
              value={address}
              onChange={(e)=>setAddress(e.target.value)}
              required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
              value={city}
              onChange={(e)=>setCity(e.target.value)}
              required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
              value={postalCode}
              onChange={(e)=>setPostalCode(e.target.value)}
              required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
              value={country}
              onChange={(e)=>setCountry(e.target.value)}
              required
              />
            </Form.Group>

            <div className="mb-3">
              <Button
                id="chooseOnMap"
                type="button"
                variant="light"
              >
                Choose Location On Map
              </Button>
            </div>

            <div className="mb-3">
              <Button variant="primary" type="submit">
                Continue
              </Button>
            </div>

          </form>

        </div>

      </div>
    );
}