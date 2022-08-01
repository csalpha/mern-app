// // // libraries import
// // import React from 'react';

// // // components import
// // import Comment from './components/Comment'; 

// // // titulos diferentes em cada comentário e autor diferente

// // // main function
// // function App(){
// //   // return jsx
// //   // Adjacent JSX elements must be wrapped in an enclosing tag.
// //   // envolver o meu return num único elemento contentor ( um único elemento pai )

 

// //   const c1 = "Comentário 1"
// //   const c2 = "Comentário 2"
// //   const c3 = "Comentário 3"

// //   const a1 = "Carlos Serôdio"
// //   const a2 = "Manuel Farinha"
// //   const a3 = "João Silva"

// //   function Maiusculas(texto){
// //     return texto.toUpperCase();
// //   }


// //   // Eu posso passar propriedades para o interior do meu componente
// //   // props - propriedades que nós podemos passar quando usamos os componentes
// //   // não é possível alterar o  valor das props dentro do componente

// //   // é possível no javascript adicionar uma função dentro de outra função

// //   return(
// //     <>
// //       <h1>Comentários</h1>
// //       {/* passar para o interior do meu componente uma propriedade chamada title */}
// //       <Comment title={Maiusculas(c1)} author={a1}/>
// //       <Comment title={Maiusculas(c2)} author={a2}/>
// //       <Comment title={Maiusculas(c3)} author={a3}/>
// //     </>    
// //   );
// // } 

// // //export component
// // export default App;

// // import React from 'react'
// // import Texto from './components/Texto';
// // import Footer from './components/Footer'

// // function App(){
// //   return(
// //     <div>
// //       <h1>React App</h1>
// //       <Texto />
// //       <Texto></Texto>
      
// //     </div>
// //   );
// // }

// // export default App;

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
import SignupScreen from './screens/SignupScreen';
import { Helmet } from 'react-helmet-async';
import { toast, ToastContainer } from 'react-toastify';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import OrderScreen from './screens/OrderScreen';
import Footer from './components/Footer';




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

      // remove shipping from the localStorage
      localStorage.removeItem('paymentMethod');

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
                <Route path="/signup" element={<SignupScreen />}></Route>
                <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
                <Route path="/payment" element={<PaymentMethodScreen />}></Route>
                <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>
                <Route path="/order/:id" element={<OrderScreen />}></Route>
              </Routes>
            </main>
            <Footer/>
          </div>
        </BrowserRouter>
      );
}


// // Para que eu possa ter o component disponivel 
// // dentro do index.js eu vou ter que o exportar
export default App;



// // // importação de bibliotecas, componentes ... etc
// // // desde o React 17 deixou de ser preciso importar o React
// // import React from 'react';
// // import Texto from './components/Texto';

// // // constução da lógica do componente
// // function App(){
// // return(
// //   <div>
// //     <h1>Olá Mundo!!</h1>
// //     <Texto />
// //     <Texto></Texto>
// //   </div>
// // );
// // }

// // /* exportação da aplicação para poder ser
// //         utilizada no ficheiro index.js */
// // export default App;

// // // importação da biblioteca de React permite interpretar JSX
// // // // import React from 'react'


// // // create function component
// // // criar  funções como sendo componentes
// // /* convenção: componentes começam com letra maiúcula
// //    ficheiros começam com letra minúscula   */

// // // criação da função/ componente chamada App
// // // construção da lógica do componente
// // // // function App(){
// // // //   // corpo da função ( body function )
// // // //   // devolução/ retorno
// // // //   return (
// // // //     // Não é HTML, é JSX - É uma extensão de javaScript 
// // // //     //para poder escrever algo muito semenhante a HTML
// // // //     /* JSX */
// // // //     <div>
// // // //       <h1>Olá React</h1>
// // // //     </div>
// // // //     /* JSX */
// // // //   )

// // // // }

// // // exportação da função para que ela fique disponível para ser usada noutro ficheiro
// // // // export default App;
// // /* se eu não exportar o ficheiro, o sistema 
// // não vai reconhecer a existência deste componente */
// // /*Não é possível importar um Componente 
// // se ele antes não tiver sido exportado*/

