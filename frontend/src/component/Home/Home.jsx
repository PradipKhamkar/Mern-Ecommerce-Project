import React, { Fragment } from 'react'
import { CgMouse } from "react-icons/cg"
import "./Home.css"
import Product from "./ProductCard"
import MetaData from '../layout/MetaData'
import { getProducts, clearErrors } from '../../Redux/actions/productAction'
import { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import Loader from '../layout/Loader/Loader'
import { Link, useParams } from 'react-router-dom'
import { useAlert } from "react-alert"

const Home = () => {

  const alert = useAlert()
  const dispatch = useDispatch()
  const { keyword } = useParams()
  const { loading, error, products } = useSelector((state) => state.allProducts)


  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProducts(keyword ? keyword : ""))
  }, [dispatch, error, keyword, alert])

  return (
    <Fragment>
      {loading ? <Loader /> :
        <Fragment>
          <MetaData title={" Ecommerce"} />
          <div className="banner">
            <p>Welcome To Ecommerce</p>
            <h1>FIND AMAZING PRODUCT BELOW</h1>
            <Link to="/products">
              <button>
                Explore <CgMouse />
              </button>
            </Link>
          </div>
          <h2 className="homeheading"> Featured Products</h2>
          <div className="pconatiner" id='pcontanier'>
            {products && products.map((Products) => <Product key={Products._id} products={Products} />)}
          </div>
        </Fragment>}
    </Fragment>
  )
}

export default Home