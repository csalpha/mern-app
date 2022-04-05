import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import SearchBox from './components/SearchBox';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';

function App(){
  
    const { state } = useContext(Store);
    const { cart } = state;
    const { cartItems } = cart;

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

                        <Link className="nav-link" to="/signin">
                          Sign In
                        </Link>
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
                      onClick={() => setSidebarIsOpen(false)}
                    >
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
                {/* <Route path="/cart" element={<CartScreen />}></Route> */}
              </Routes>
            </main>
            <footer>
              
            </footer>
          </div>
        </BrowserRouter>
      );
}

export default App;