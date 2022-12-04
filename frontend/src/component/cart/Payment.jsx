import { Typography } from '@material-ui/core'
import "./Payment.css"
import React, { useRef, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { BsFillCreditCard2FrontFill, BsFillCalendarEventFill } from "react-icons/bs"
import { MdVpnKey } from "react-icons/md"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { createOrder, clearErrors } from '../../Redux/actions/orderAction'
import { useAlert } from 'react-alert'




const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const alert = useAlert()
    const Navigate = useNavigate()
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);


    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);
    const { name, email } = user.user

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100), //multiple by 100 because stripe get money in pease
    };
    const order = {
        shippingInfo,
        orderItem: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice
    }
    const submitHandel = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;
        payBtn.current.value = "Processing Payment..!!"
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
            }
            const { data } = await axios.post(
                "/api/v1/payment/process",
                paymentData,
                config
            );
            const client_secret = data.client_secret;

            if (!stripe || !elements) return;
            // payBtn.current.value = "Processing Payment"
            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: name,
                        email: email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        }
                    }
                }
            });
            if (result.error) {
                alert.error(result.error.message)
                payBtn.current.value = `Pay - ₹${orderInfo.totalPrice}`
                payBtn.current.disabled = false;
            }
            else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        transactionId: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }
                    alert.success("Payment Complete SuccessFully..!!")
                    dispatch(createOrder(order))
                    Navigate("/success")
                }
                else {
                    alert.error("Here's some issues while processing payment")
                }
            }
        } catch (error) {
            payBtn.current.disabled = false;
        }
    }
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [error, alert, dispatch])

    return (
        <Fragment>
            <MetaData title="Payment" />
            < div className="CheckOutSteps" >
                <CheckoutSteps activeStep={2} />
                <div className="paymentContainer">
                    <form className="paymentForm" onSubmit={(e) => { submitHandel(e) }}>
                        <Typography>Card Info</Typography>
                        <div>
                            <BsFillCreditCard2FrontFill />
                            <CardNumberElement className="paymentInput" />
                        </div>
                        <div>
                            <BsFillCalendarEventFill />
                            <CardExpiryElement className="paymentInput" />
                        </div>
                        <div>
                            <MdVpnKey />
                            <CardCvcElement className="paymentInput" />
                        </div>
                        <input
                            type="submit"
                            value={`Pay - ₹${orderInfo.totalPrice}`}
                            ref={payBtn}
                            className="paymentFormBtn"
                        />
                    </form>
                </div>
            </ div>
        </Fragment >
    )
}

export default Payment