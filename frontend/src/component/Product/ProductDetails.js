import React, { Fragment, useEffect, useState } from 'react'
import "./productDetails.css"
import { getProductDetails, newReview, clearErrors } from '../../Redux/actions/productAction'
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Loader from '../../component/layout/Loader/Loader'
import ReviewsCard from "../Product/ReviewsCard"
import MetaData from '../layout/MetaData'
import { addItemToCart } from '../../Redux/actions/cartAction'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from '../../Redux/constants/productConstant'
import { useAlert } from "react-alert"
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { TbFaceIdError } from "react-icons/tb"

const ProductDetails = () => {
  const alert = useAlert()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, loading, error } = useSelector(state => state.productDetails)

  const { message, success, error: reviewError } = useSelector(
    (state) => state.newReviews
  );



  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  useEffect(() => {

    if (reviewError) {
      alert.error(reviewError)
      dispatch(clearErrors())
    }

    if (success) {
      alert.success(message);
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getProductDetails(id))

  }, [dispatch, id, success, reviewError, message, alert])


  const options = {
    size: "large",
    value: product && product.ratings ? product.ratings : 0,
    readOnly: true,
    precision: 0.5,
  }

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id)

    dispatch(newReview(myForm));
    setOpen(false);
  };


  const increaseQuantity = () => {
    if (quantity >= product.Stock) return;
    const qty = quantity + 1
    setQuantity(qty)
  }

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    const qty = quantity - 1
    setQuantity(qty)
  }

  const HandelAddToCart = () => {
    dispatch(addItemToCart(id, quantity))
    alert.success("Product Added To Cart")
  }


  return (
    <Fragment>
      {loading ?
        <>
          <Loader />
          <MetaData title={`Product Details(Not Found)`} />
        </>

        :

        <>

          {product && product._id ?

            <Fragment>
              <MetaData title={`Product Details(${product && product.name ? product.name : ""})`} />
              <div className="ProductDetails">
                <div className="ProductImages">
                  <div className="singleImage">
                    <div>
                      <img src={product.images && product.images[0].url} alt="Product Image" id='SingleImage' />
                    </div>
                  </div>
                  <div className="multiImages">
                    {product.images && product.images.map((item, i) => {
                      return (
                        <div className="sliderImage" key={i} >
                          <img
                            src={item.url}
                            alt="product image"
                            onClick={(e) => document.getElementById("SingleImage").setAttribute("src", e.target.src)}
                          />
                        </div>)
                    })}
                  </div>
                </div>
                <div className="detailsSection">
                  <div className="detailsBlock-1">
                    <h2>{product.name}</h2>
                    <p>Product # {product._id}</p>
                  </div>
                  <div className="detailsBlock-2">
                    <Rating {...options} />
                    <span className="detailsBlock-2-span">
                      ({product.numOfReviews} Reviews)
                    </span>
                  </div>

                  <div className="detailsBlock-3">
                    <h1>{`₹ ${product.price}`}</h1>
                    <div className="detailsBlock-3-1">
                      <div className="detailsBlock-3-1-1">
                        <button onClick={decreaseQuantity}> -</button>
                        <input readOnly type="number" value={quantity} />
                        <button onClick={increaseQuantity}>+</button>
                      </div>
                      <button
                        disabled={product.Stock < 1 ? true : false} onClick={HandelAddToCart}> Add to Cart</button>
                    </div>
                    <p>
                      Status:
                      <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                        {product.Stock < 1 ? " OUT OF STOCK" : ` ${product.Stock} IN STOCK `}
                      </b>
                    </p>
                  </div>

                  <div className="detailsBlock-4">
                    Description : <p>{product.description}</p>
                  </div>

                  <button className="submitReview" onClick={submitReviewToggle}>
                    Submit Review
                  </button>
                  {/* Main Div */}
                </div>
              </div>

              <h1 className='reviewsHeading'>Reviews</h1>
              <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={submitReviewToggle}
              >
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent className="submitDialog">
                  <Rating
                    onChange={(e) => setRating(e.target.value)}
                    value={rating}
                    size="large"
                  />
                  <textarea
                    className="submitDialogTextArea"
                    cols="30"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </DialogContent>
                <DialogActions>
                  <Button onClick={submitReviewToggle} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={reviewSubmitHandler} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
              <div className="reviews ">
                {product.reviews && product.reviews[0] ? product.reviews.map((reviews, id) =>
                  <ReviewsCard key={id} allReviews={reviews} />
                ) : <h6>No Reviews Yet</h6>}
              </div>
            </Fragment>


            :

            <div className="PageNotFound">
              <TbFaceIdError />
              <Typography>Product Not Found </Typography>
              <Link to="/products">PRODUCTS</Link>
            </div>
          }


        </>

      }

    </Fragment>
  )
}

export default ProductDetails