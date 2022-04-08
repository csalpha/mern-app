import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import SearchBox from './components/SearchBox';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { Helmet } from 'react-helmet-async';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';

function App(){
  
    // get state and ctxDispatch from useContext
    const { state,  dispatch: ctxDispatch } = useContext(Store);

    // from the state get cart and userInfo 
    const { cart, userInfo } = state;

    // from the cart get cartItems
    const { cartItems } = cart;

    // define signoutHandler
    const signoutHandler = () => {
      // call contextDispatch
      ctxDispatch({ type: 'USER_SIGNOUT'});

      // remove userInfo from the localStorage
      localStorage.removeItem('userInfo');

      // remove shipping from the localStorage
      localStorage.removeItem('ShippingAddress');

    };



    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const { data } = await Axios.get(`/api/products/categories`);
          setCategories(data);
        } catch (err) {
          
        }
      };
      fetchCategories();
    }, []);
  
    return (
        <BrowserRouter>
          <div
            className={
              sidebarIsOpen
                ? 'site-container active-cont d-flex flex-column'
                : 'site-container d-flex flex-column'
            }
          >
              <Helmet>
          <title>Games Store: ECommerce website </title>
        </Helmet>
        <ToastContainer position="bottom-center" limit={1} />
            <header>
              <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                  <Button
                    variant="dark"
                    onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                  >
                    <i className="fas fa-bars"></i>
                  </Button>
                  <LinkContainer to="/">
                    <Navbar.Brand>Store</Navbar.Brand>
                  </LinkContainer>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <SearchBox />
                    <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                    Cart
                    {cartItems.length > 0 && (
                      <span className='badge rounded-pill bg-danger'> 
                        {//use reduce function to calculate accumulator (a) and current item (c)
                        // default value to accumulator is zero
                        cartItems.reduce( (a, c) => a + c.quantity, 0)}
                      </span>
                    )}
                  </Link>
                  { // fetch user info from store
                    // check user info 
                  userInfo ? // userInfo does exist
                  (          // show user information
                      <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>

                        <NavDropdown.Divider />
                        <Link
                          className="dropdown-item"
                          to="#signout"
                          onClick={signoutHandler}
                        >
                          Sign Out
                        </Link>
                      </NavDropdown>
                  ) 
                  : // userInfo doesn't exist
                    // show sign in button
                  (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isSeller && 
                  (
                    <NavDropdown title="Seller" id="basic-nav-dropdown">
                      <LinkContainer to="/productlist/seller">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderlist/seller">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}

                  {userInfo && userInfo.isAdmin && 
                  (
                    <NavDropdown title="Admin" id="basic-nav-dropdown">
                      <LinkContainer to="/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/userlist">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/support">
                        <NavDropdown.Item>Support</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </header>
    
            <div
              className={
                sidebarIsOpen
                  ? ' active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                  : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
              }
            >
              <Nav className="flex-column text-white w-100 p-2">
                <Nav.Item>
                  <strong>Categories</strong>
                </Nav.Item>
                {categories.map((category) => (
                  <Nav.Item key={category}>
                    <LinkContainer
                      to={`/search?category=${category}`}
                      onClick={() => setSidebarIsOpen(false)}>
                      <Nav.Link>{category}</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))}
              </Nav>
            </div>
    
            <main
              className="container mt-
              3"
              onClick={() => setSidebarIsOpen(false)}
            >
              <Routes>
                <Route path="/product/:id" element={<ProductScreen/>}></Route>
                <Route path="/" element={<HomeScreen/>}></Route>
                <Route path="/cart" element={<CartScreen/>}></Route>
                <Route path="/signin" element={<SigninScreen />}></Route>
                <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
              </Routes>
            </main>
            <footer>
              
            </footer>
          </div>
        </BrowserRouter>
      );
}

export default App;