import { createContext, useReducer } from 'react';

//# Create React Context -use React Context to save Cart Items 
// in a Global State and use it in Components


// #1 - Create Store
export const Store = createContext();

// define Initial State
const initialState = {
    cart: {
        cartItems : [], // by default there is no items in the shopping cart
    }
}

// define reducer
function reducer(state, action){
    switch(action.type){
        case 'CART_ADD_ITEM':
            //Add to Cart
            return {
                ...state, // keep all values in the field
                cart: {
                    ...state.cart, // keep all values in the cart object
                    // only update cart items
                    cartItems:[
                        ...state.cart.cartItems, // keep previous items in the cart
                        action.payload // add the new item
                    ]
                }
            }
        default:
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