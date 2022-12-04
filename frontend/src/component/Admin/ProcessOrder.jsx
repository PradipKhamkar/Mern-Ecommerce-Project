import { Typography } from '@material-ui/core'
import "./ProcessOrder.css"
import React, { Fragment } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getOrderDetails, updateOrder, clearErrors } from '../../Redux/actions/orderAction'
import Loader from '../layout/Loader/Loader'
import MetaData from '../layout/MetaData'
import Sidebar from "./Sidebar"
import { Button } from '@material-ui/core'
import { MdAccountTree } from "react-icons/md"
import { UPDATE_ORDER_RESET } from '../../Redux/constants/orderConstant'
import { useAlert } from 'react-alert'



const ProcessOrder = () => {

    const alert = useAlert()
    const dispatch = useDispatch();

    const { id } = useParams();

    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { error: updateError, isUpdated, loading: updateLoading } = useSelector((state) => state.order);

    const [status, setStatus] = useState("")

    const orderStatusHandler = (e) => {
        e.preventDefault();
        dispatch(updateOrder(id, status))
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Order Updated SuccessFully..!!");
            dispatch({
                type: UPDATE_ORDER_RESET
            })
        }
        dispatch(getOrderDetails(id))
    }, [dispatch, id, error, isUpdated, updateError, alert]);

    return (
        <Fragment>
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <MetaData title={"PROCESS ORDER --ADMIN"} />
                    {loading ? <Loader /> :
                        <div
                            className="confirmOrderPage"
                            style={{
                                display: order.orderStatus === "Delivered" ? "block" : "grid",
                            }}
                        >
                            <div>
                                <div className="confirmshippingArea">
                                    <Typography>Shipping Info</Typography>
                                    <div className="orderDetailsContainerBox">
                                        <div>
                                            <p>Name:</p>
                                            <span>{order.user && order.user.name}</span>
                                        </div>
                                        <div>
                                            <p>Phone:</p>
                                            <span>
                                                {order.shippingInfo && order.shippingInfo.phoneNumber}
                                            </span>
                                        </div>
                                        <div>
                                            <p>Address:</p>
                                            <span>
                                                {order.shippingInfo &&
                                                    `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                                            </span>
                                        </div>
                                    </div>

                                    <Typography>Payment</Typography>
                                    <div className="orderDetailsContainerBox">
                                        <div>
                                            <p
                                                className={
                                                    order.paymentInfo &&
                                                        order.paymentInfo.status === "succeeded"
                                                        ? "greenColor"
                                                        : "redColor"
                                                }
                                            >
                                                {order.paymentInfo &&
                                                    order.paymentInfo.status === "succeeded"
                                                    ? "PAID"
                                                    : "NOT PAID"}
                                            </p>
                                        </div>
                                        <div>
                                            <p>Amount:</p>
                                            <span>{order.totalPrice && order.totalPrice}</span>
                                        </div>
                                    </div>



                                    <Typography>Order Status</Typography>
                                    <div className="orderDetailsContainerBox">
                                        <div>
                                            <p
                                                className={
                                                    order.orderStatus &&
                                                        order.orderStatus === "Delivered"
                                                        ? "greenColor"
                                                        : "redColor"
                                                }
                                            >
                                                {order.orderStatus && order.orderStatus}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="confirmCartItems">
                                    <Typography> Order Items:</Typography>
                                    <div className="confirmCartItemsContainer">
                                        {order.orderItem && order.orderItem.map((item) => {
                                            return (
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
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            {/*  */}
                            <div style={{
                                display: order.orderStatus === "Delivered" ? "none" : "block",
                            }}>
                                <div className="orderSummary">
                                    <form
                                        className="updateOrderForm"
                                        onSubmit={(e) => { orderStatusHandler(e) }}
                                    >
                                        <h1>Order Update</h1>
                                        <div>
                                            <MdAccountTree />
                                            <select
                                                name='status'
                                                onChange={(e) => setStatus(e.target.value)} >
                                                <option value="">Select Status</option>
                                                {order.orderStatus === "Processing" && <option value="Shipped">Shipped</option>}
                                                {order.orderStatus === "Shipped" && <option value="Delivered">Delivered</option>}
                                                {order.orderStatus === "Delivered" && <option value="Delivered">Delivered</option>}
                                            </select>
                                        </div>
                                        <Button
                                            id="createProductBtn"
                                            type="submit"
                                            disabled={loading ? true : false || status === "" ? true : false}
                                        >
                                            {updateLoading ? "WAIT UPDATING STATUS..!!" : "UPDATE"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        </Fragment >
    )
}

export default ProcessOrder