import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_To_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case ADD_To_CART:
            return {...state,
                        userData : {
                            ...state.userData,
                            cart : action.payload
                            // users.js -> .send(userInfo.cart) 해당 부분이 payload
                        } 
                    }
        case GET_CART_ITEMS:
            return {...state , cartDetail : action.payload}
            //user_actions -> getCartItems -> return response.data
        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartDetail: action.payload.productInfo,
                userData: {
                    ...state.userData,
                    cart: action.payload.cart
                }
            }
        default:
            return state;
    }
}