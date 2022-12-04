import React, { Fragment } from 'react'
import "./product.css"
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getProducts } from "../../Redux/actions/productAction"
import ProductCard from '../Home/ProductCard'
import Loader from '../layout/Loader/Loader'
import { useParams } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import { useState } from 'react'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import MetaData from '../layout/MetaData'
import { Rating } from "@material-ui/lab";


const Product = () => {


    //Filter State
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 50000])
    const [Category, SetCategory] = useState()
    const [Ratings, SetRatings] = useState(0)


    const dispatch = useDispatch()
    const { keyword } = useParams()

    let { products, loading, productCount, resultPerPage, filterProductCount } = useSelector(state => state.allProducts)

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }
    const priceHandler = (event, newPrice) => {
        setCurrentPage(1)
        setPrice(newPrice)
    }

    const ratingsHandler = (e) => {
        setCurrentPage(1)
        SetRatings(e.target.value)
    }

    const categoryHandler = (category) => {
        setCurrentPage(1)
        SetCategory(category)
    }

    useEffect(() => {
        dispatch(getProducts
            (keyword ? keyword : "",
                currentPage ? currentPage : 1,
                price, Category, Ratings
            ))
    }, [dispatch, keyword, currentPage, price, Category, Ratings])

    //Clear Filter
    const clearFilter = () => {

        setCurrentPage(1)
        setPrice([0, 50000])
        SetCategory("")
        SetRatings(0)

        dispatch(getProducts
            (
                currentPage,
                price, Category, Ratings
            ))
    }
    const categories =
        [
            "Laptop",
            "Mobile",
            "Bottom",
            "Top"
        ]

    return (
        <Fragment>
            <MetaData title={'Products'} />
            <div className="mainProductDiv">
                <div className="productSection">
                    <h1 className="productsHeading">Products</h1>
                    {loading ? <Loader /> :
                        <Fragment>
                            <div className="productSection-1">
                                {products && products.map((product) => { return <ProductCard key={product._id} products={product} /> })}
                            </div>
                            <div className="mainFilter">
                                <div className="filterBox">
                                    {products.length === 0 ?
                                        <h6 className='redBg'>Product NOT Available </h6> : <h6>{`${products.length} Product OF ${filterProductCount} `}</h6>}
                                    <Typography>Price</Typography>
                                    <Slider
                                        value={price}
                                        onChange={priceHandler}
                                        valueLabelDisplay="on"
                                        aria-labelledby='range-slider'
                                        min={0}
                                        max={50000}
                                    />
                                    <Typography>Categories</Typography>
                                    <ul className="categoryBox">
                                        {categories.map((category) => (
                                            <li
                                                className="category-link"
                                                key={category}
                                                onClick={() => categoryHandler(category)}>
                                                {category}
                                            </li>
                                        ))}
                                    </ul>
                                    <Typography>Ratings</Typography>
                                    <Rating
                                        onChange={(e) => ratingsHandler(e)}
                                        size="medium"
                                        value={Ratings}
                                        className="RatingFilter"
                                    />
                                    <button className='clearFilterBtn'
                                        onClick={() => clearFilter()}
                                    >CLEAR FILTER</button>
                                </div>
                            </div>
                            {resultPerPage <= filterProductCount &&
                                <div className="paginationBox">
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={resultPerPage}
                                        totalItemsCount={productCount}
                                        onChange={setCurrentPageNo}
                                        nextPageText="Next"
                                        prevPageText="Prev"
                                        lastPageText="Last"
                                        firstPageText="First"
                                        itemClass='page-item'
                                        linkClass='page-link'
                                        activeClass='pageItemActive'
                                        activeLinkClass='pageLinkActive'
                                    />
                                </div>

                            }


                        </Fragment>}

                </div>
            </div>
        </Fragment>
    )
}

export default Product