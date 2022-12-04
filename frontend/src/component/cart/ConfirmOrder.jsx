import { Typography } from '@material-ui/core'
import "./ConfirmOrder.css"
import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutSteps from './CheckoutSteps'
import MetaData from '../layout/MetaData'


const ConfirmOrder = () => {
    const Navigate = useNavigate()
    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)
    const { name } = user.user

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );
    const shippingCharges = subtotal < 1000 ? 0 : 150;

    const tax = subtotal * 0.18

    const totalPrice = shippingCharges + tax + subtotal
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        }
        //We Use Session Storage Because When We Close Tab Then Data Will Be Delete
        sessionStorage.setItem("orderInfo", JSON.stringify(data));
        Navigate("/process/payment")
    }

    return (

        <Fragment>
            <div className="CheckOutSteps">
                <MetaData title={"Confirm Order"} />
                <CheckoutSteps activeStep={1} />
                <div className="confirmOrderPage">
                    <div>
                        <div className="confirmshippingArea">
                            <Typography>Shipping Info</Typography>
                            <div className="confirmshippingAreaBox">
                                <div>
                                    <p>Name:</p>
                                    <span>{name}</span>
                                </div>
                                <div>
                                    <p>Phone:</p>
                                    <span>{shippingInfo.phoneNumber}</span>
                                </div>
                                <div>
                                    <p>Address:</p>
                                    <span>{address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="confirmCartItems">
                            <Typography>Your Cart Items:</Typography>
                            <div className="confirmCartItemsContainer">
                                {cartItems &&
                                    cartItems.map((item) => (
                                        <div key={item.product}>
                                            <img src={item.image} alt="Product" />
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>{" "}
                                            <span>
                                                {item.quantity} X ₹{item.price} ={" "}
                                                <b>₹{item.price * item.quantity}</b>
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div>
                        <div className="orderSummary">
                            <Typography>Order Summery</Typography>
                            <div>
                                <div>
                                    <p>Subtotal:</p>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div>
                                    <p>Shipping Charges:</p>
                                    <span>₹{shippingCharges}</span>
                                </div>
                                <div>
                                    <p>GST:</p>
                                    <span>₹{tax}</span>
                                </div>
                            </div>

                            <div className="orderSummaryTotal">
                                <p>
                                    <b>Total:</b>
                                </p>
                                <span>₹{totalPrice}</span>
                            </div>
                            <button onClick={proceedToPayment}>Proceed To Payment</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ConfirmOrder