import { createStore, combineReducers, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import { cartReducer } from "./Redux/reducers/cartReducer"
import { allOrdersReducer, myOrderDetailsReducer, myOrdersReducer, newOrderReducer, orderReducer } from "./Redux/reducers/orderReducer"
import productReducer, { productDetailsReducer, newReviewReducer, newProductReducer, productsReducer, productReviewsReducer, deleteReviewReducer } from "./Redux/reducers/productReducer"
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./Redux/reducers/userReducer"


const rootReducer = combineReducers({
    allProducts: productReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: myOrderDetailsReducer,
    newReviews: newReviewReducer,
    newProduct: newProductReducer,
    product: productsReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUser: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review: deleteReviewReducer
})

const initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) :
            [],
        shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) :
            [],
    }
}

const middleware = [thunk]

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store