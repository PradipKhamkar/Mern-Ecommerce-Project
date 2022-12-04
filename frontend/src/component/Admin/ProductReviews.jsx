import React, { Fragment, useEffect, useState } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import "./ProductReview.css"
import { useDispatch, useSelector } from "react-redux"
import { getAllReviews, deleteReviews, clearErrors } from '../../Redux/actions/productAction'
import { useNavigate } from "react-router-dom"
import { Button } from '@material-ui/core'
import MetaData from '../layout/MetaData'
import Sidebar from "./Sidebar"
import { MdDeleteForever } from "react-icons/md"
import { BsBookmarkStar } from "react-icons/bs"
import { DELETE_REVIEW_RESET } from '../../Redux/constants/productConstant'
import { useAlert } from 'react-alert'

const ProductReviews = () => {

    const alert = useAlert()
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const { error: deleteError, isDeleted } = useSelector(
        (state) => state.review
    );

    const { error, reviews, loading } = useSelector(
        (state) => state.productReviews
    );

    const [productId, setProductId] = useState("");

    const deleteReviewHandler = (reviewId) => {
        console.log(reviewId);
        dispatch(deleteReviews(reviewId, productId));
    };

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllReviews(productId));
    };

    useEffect(() => {

        if (productId.length === 24) {
            dispatch(getAllReviews(productId));
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if (isDeleted) {
            alert.success("Reviews Delete SuccessFully...!!")
            Navigate("/admin/reviews")
            dispatch({
                type: DELETE_REVIEW_RESET
            })
        }
    }, [error, dispatch, deleteError, isDeleted, Navigate, productId, alert])

    const columns = [
        { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

        {
            field: "user",
            headerName: "User",
            minWidth: 200,
            flex: 0.6,
        },

        {
            field: "comment",
            headerName: "Comment",
            minWidth: 350,
            flex: 1,
        },

        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 180,
            flex: 0.4,
            cellClassName: (params) => {
                return params.getValue(params.id, "rating") >= 3
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Button onClick={() => { deleteReviewHandler(params.getValue(params.id, "id")) }}>
                            <MdDeleteForever />
                        </Button>
                    </Fragment>
                );
            },
        }
    ]
    const rows = []
    reviews &&
        reviews.forEach((item) => {

            rows.push({
                id: item._id,
                user: item.name,
                comment: item.comment,
                rating: item.rating,
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL REVIEWS - Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productReviewsContainer">
                    <form
                        className="productReviewsForm"
                        onSubmit={productReviewsSubmitHandler}
                    >
                        <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

                        <div>
                            <BsBookmarkStar />
                            <input
                                type="text"
                                placeholder="Product Id"
                                required
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />
                        </div>

                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={
                                loading ? true : false || productId === "" ? true : false
                            }
                        >
                            Search
                        </Button>
                    </form>
                    {reviews && reviews.length > 0 ? (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            className="productListTable"
                            autoHeight
                        />
                    ) : (
                        <h1 className="productReviewsFormHeading">No Reviews Found</h1>
                    )}
                </div>
            </div>
        </Fragment>


    )
}


export default ProductReviews