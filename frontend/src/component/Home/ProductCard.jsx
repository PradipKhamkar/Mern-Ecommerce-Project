import React from 'react'
import { Link } from "react-router-dom"
import { Rating } from '@material-ui/lab'


const ProductCard = (props) => {

    const { name, price, _id, images, ratings, numOfReviews } = props.products
    const options = {
        size: "large",
        value: ratings,
        readOnly: true,
        precision: 0.5,
    }
    return (
        <Link className='productCard' to={`/product/${_id}`} >
            <img src={images && images[0].url} alt="Image Not Found" />
            <p>{name}</p>
            <div className='productRating'>
                <Rating {...options} /> <span className='productCardSpan'>( {numOfReviews} Reviews )  </span>
            </div>
            <span> ₹ {price}</span>
        </Link>
    )
}

export default ProductCard