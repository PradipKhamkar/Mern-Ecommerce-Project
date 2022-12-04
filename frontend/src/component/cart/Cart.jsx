import React, { Fragment } from 'react'
import "./cart.css"
import CartItem from './CartItem'
import { useDispatch, useSelector } from 'react-redux'
import { IoBagCheckOutline } from "react-icons/io5"
import { MdRemoveShoppingCart } from "react-icons/md"
import MetaData from '../layout/MetaData'
import { Typography } from "@material-ui/core";
import { addItemToCart, removeCartItem } from '../../Redux/actions/cartAction'
import { Link, useNavigate } from 'react-router-dom'




const Cart = () => {

    const dispatch = useDispatch()
    const Navigate = useNavigate()
    const { cartItems } = useSelector(state => state.cart)

    const increaseQty = (id, quantity, stock) => {
        if (quantity >= stock) return;
        const newQty = quantity + 1;
        dispatch(addItemToCart(id, newQty))
    }
    const decreaseQty = (id, quantity) => {
        if (quantity <= 1) return;
        const newQty = quantity - 1;
        dispatch(addItemToCart(id, newQty))
    }

    const removeItem = (id) => {
        dispatch(removeCartItem(id))
    }

    const handelCheckOut = () => {
        Navigate("/login?redirect=/shipping");
    }
    return (

        <Fragment>
            <MetaData title={"My Cart"} />
            {cartItems.length === 0 ?

                <div className="emptyCart">
                    <MdRemoveShoppingCart />
                    <Typography>No Product in Your Cart</Typography>
                    <Link to="/products">View Products</Link>
                </div>

                :
                <Fragment>
                    <MetaData title={`My Cart `} />

                    <div className="cartPage">
                        <h1>MY CART</h1>
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>
                        {cartItems && cartItems.map((item) =>
                            <div className="cartContainer" key={item.product}>
                                <CartItem item={item} removeCartItemFun={removeItem} />
                                <div className="cartInput">
                                    <button onClick={() => { decreaseQty(item.product, item.quantity) }}>
                                        -
                                    </button>
                                    <input type="number" value={item.quantity} readOnly />
                                    <button onClick={() => { increaseQty(item.product, item.quantity, item.stock) }}>
                                        +
                                    </button>
                                </div>
                                <p className="cartSubtotal">{`₹${item.price * item.quantity
                                    }`} </p>
                            </div>

                        )}
                        <div className="cartGrossProfit">
                            <div></div>
                            <div className="cartGrossProfitBox">
                                <p>Gross Total </p>
                                <p>{`₹${cartItems.reduce(
                                    (acc, item) => acc + item.quantity * item.price, 0
                                )}`}</p>
                            </div>
                            <div></div>
                            <div className="checkOutBtn">
                                <button onClick={handelCheckOut}> <IoBagCheckOutline /> Check Out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>}
        </Fragment>
    )
}

export default Cart