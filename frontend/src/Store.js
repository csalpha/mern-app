import { createContext, useReducer } from 'react';
// import logger from 'use-reducer-logger';

// i wanna use react context to save the cart items in a global state
// and use it in Components

// Create Store
export const Store = createContext();

// define initialState
const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
  },
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

// define reducer
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {

      // new item
      const newItem = action.payload;
      

      // exist item
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );


      // cart items
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // keep all values in the field ...state
      // keep all values in the Cart Object in the state ...state.cart
      // update cartItems
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            location: action.payload,
          },
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };

    default:
      return state;
  }
}

// StoreProvider - is a Wrapper for React App and pass global props to children
export function StoreProvider(props) {

  // define useReducer
  const [state, dispatch] = useReducer(
    //process.env.NODE_ENV === 'development' ? logger(reducer) : reducer,
    reducer,
    initialState
  );

  // define value object
  // the value contain current state in the context and 
  // the dispatch to update state in the context
  const value = { state, dispatch };

  // return Store ( is comming from react context )
  // get Provider from the Store object
  // render {props.children}
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
