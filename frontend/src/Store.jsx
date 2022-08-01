import { createContext, useReducer } from 'react';

//# Create React Context -use React Context to save Cart Items 
// in a Global State and use it in Components

// #1 - Create Store
export const Store = createContext();

// define Initial State
const initialState = {
    cart: {
        // if cartItems exist in a localStorage
        cartItems: localStorage.getItem('cartItems') ? 
        // use JSON.parse to convert cartItems string to javaScript object 
        JSON.parse(localStorage.getItem('cartItems')) 
        // otherwise, set it to empty array
        :[], 

        // if userInfo exist in a localStorage
        userInfo: localStorage.getItem('userInfo')
        // use JSON.parse to convert userInfo string to javaScript object 
        ? JSON.parse(localStorage.getItem('userInfo'))
        // otherwise, set it to null
        : null,

        // if shippingAddress exist in a localStorage
        shippingAddress: localStorage.getItem('shippingAddress')
         // use JSON.parse to convert shippingAddress string to javaScript object 
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        // otherwise, set empty object
        : { location: {} },

        // if paymentMethod exist in a localStorage
        paymentMethod: localStorage.getItem('paymentMethod')
        ? localStorage.getItem('paymentMethod')
        : '',
    }
}

// define reducer
function reducer(state, action){
    switch(action.type){
        case 'CART_ADD_ITEM': {
            // new item
            const newItem = action.payload;
            
            // exist item
            const existItem = state.cart.cartItems.find(
              (item) => item._id === newItem._id
            );
      
            // cart items
            const cartItems = existItem ? //true
            state.cart.cartItems.map(
                (item) => item.name === existItem.name ? //true
            newItem : //false
            item ) : // false
            [ ...state.cart.cartItems, // keep all values in the field
              newItem // new item    
            ];

            // save items in localStorage
            // convert cartItems to a string and save them in the cart items
            localStorage.setItem(   'cartItems', 
                                    JSON.stringify(cartItems)
                                                                );

            return { ...state, // keep all values in the field
                     cart: { 
                     ...state.cart, // keep all values in the Cart Object state
                     cartItems // update cartItems
                   } 
                  };
        }
        case 'CART_REMOVE_ITEM': 
        {
            // cartItems - filter out item that i passed as action.payload
            const cartItems = state.cart.cartItems.filter(
              (item) => item._id !== action.payload._id
            );
            
            // save items in localStorage
            // convert cartItems to a string and save them in the cart items
            localStorage.setItem( 'cartItems', 
                                  JSON.stringify(cartItems)
                                                                );

        return { 
                ...state, // keep all values in the field
                cart: { 
                        ...state.cart, // keep all values in the Cart Object state
                        cartItems // update cartItems
                } 
            };
        }
        case 'CART_CLEAR':
          return { ...state, // keep the previous state values
                   cart: { ...state.cart, // keep the state of cart
                           cartItems: [] } }; // change cart items to empty array
        case 'USER_SIGNIN':
          return { 
              ...state,  // keep the previous state
              userInfo: action.payload // update user info
            };  
        case 'USER_SIGNOUT':
          return {
            ...state,
            userInfo: null,
            cart: {
              cartItems: [], // clean cart
              shippingAddress: {}, // clean shippingAddress
              paymentMethod: '',
            },
          };  
        case 'SAVE_SHIPPING_ADDRESS':
          return {
            ...state, // keep the previous state
            cart: {
              ...state.cart, // keep the previous cart state
              shippingAddress: {
                ...state.cart.shippingAddress,
                ...action.payload, // save shippingAddress
              },
            },
          };
          case 'SAVE_PAYMENT_METHOD':
            return {
              ...state, // keep the previous state
              cart: { 
                ...state.cart, // keep the previous cart state
                paymentMethod: action.payload // save payment method
              },
            };
            default:
            // current state
            return state;
    }
}

// #2 - Store Provider - it's a Wrapper for our React Application
// pass global props to children
export function StoreProvider(props){
    // define useReducer
    const [state, dispatch] = useReducer(reducer, initialState);

    //define value object
    const value = {
        state, // current state
        dispatch // action to update state in the context
    };

    return <Store.Provider value={value}>
        {props.children}
    </Store.Provider>
}