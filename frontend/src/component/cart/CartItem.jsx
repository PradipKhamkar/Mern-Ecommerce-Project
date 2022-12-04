import React from 'react'
import { Link } from 'react-router-dom'
import "./cartItem.css"
import { AiTwotoneDelete } from "react-icons/ai"



const CartItem = ({ item, removeCartItemFun }) => {
    return (
        <div className="CartItemCard">
            <img src={item.image} alt="ssa" />
            <div>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <span>{`Price: ₹${item.price}`}</span>
                <p onClick={() => removeCartItemFun(item.product)}> {<AiTwotoneDelete />} Remove</p>
            </div>
        </div>
    )
}

export default CartItem