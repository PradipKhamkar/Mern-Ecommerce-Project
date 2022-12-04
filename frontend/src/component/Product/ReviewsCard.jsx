import React from 'react'
import userAvatar from "../../images/User.png"
import "./productDetails.css"
import { Rating } from "@material-ui/lab";

const ReviewsCard = ({ allReviews }) => {

    const options = {
        value: allReviews.rating,
        readOnly: true,
        precision: 0.5,
    }

    return (
        <div className="reviewsCard">
            <img src={allReviews.avatar ? allReviews.avatar : userAvatar} alt="" className='userAvatar' />
            <p>{allReviews.name}</p>
            <Rating {...options} />
            <span className="reviewCardComment">{allReviews.comment}</span>
        </div>
    )
}

export default ReviewsCard