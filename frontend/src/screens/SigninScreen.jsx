import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

// React Component
export default function SigninScreen() {

  // navigate - is commig from useNavigate hook 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useLocation - is a hook from react-router-dom
  // search - is a object inside useLocation
  const { search } = useLocation();

    // from the search get there redirectInUrl 
  // by instancing URLSearchParams and passing the search object
  // and get the redirect from the query string
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  // get state and ctxDispatch from useContext
  const { state, dispatch: ctxDispatch } = useContext(Store);

  // get user info from state
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // send an ajax request to backend for /api/users/signin
      // pass email and password for /api/users/signin as a post request
      // get the response and extract data from the response
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });

      // dispatch an action and pass an object
      ctxDispatch({ type: 'USER_SIGNIN', // action type
                    payload: data });    // data from backend

       // save user information in a browser storage
      localStorage.setItem( 'userInfo', // data converted to string
                            JSON.stringify(data) );  //convert to string, data that we get from backend
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    // check user info
    if (userInfo) { // if already exist
      navigate(redirect); // redirect user to the redirect variable
    }
  }, // dependecy array with all variables
   [navigate, redirect, userInfo]); 


  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
