import React from "react";
import "./OrderSuccess.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { BsCheck2Circle } from "react-icons/bs"
import MetaData from '../layout/MetaData'

const OrderSuccess = () => {
    return (
        <div className="orderSuccess">
            <MetaData title={"New Order Place"} />
            <BsCheck2Circle />
            <Typography>Your Order has been Placed successfully </Typography>
            <Link to="/orders">View Orders</Link>
        </div>
    );
}

export default OrderSuccess