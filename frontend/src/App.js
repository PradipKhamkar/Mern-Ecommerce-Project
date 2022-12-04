import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from './component/layout/Header/Header'
import webFont from "webfontloader"
import Home from './component/Home/Home'
import "./App.css"
import ProductDetails from './component/Product/ProductDetails'
import Product from './component/Product/Product'
import Login from './component/User/SignUpLogin'
import { userLoad } from './Redux/actions/userAction'
import { useDispatch, useSelector } from 'react-redux'
import UserProfile from './component/User/MyProfile/UserProfile'
import UpdateProfile from './component/User/UpdateProfile'
import UpdatePassword from './component/User/UpdatePassword'
import ForgotPassword from './component/User/ForgotPassword'
import ResetPassword from './component/User/ResetPassword'
import Cart from './component/cart/Cart'
import ShippingInfo from './component/cart/ShippingInfo'
import ConfirmOrder from './component/cart/ConfirmOrder'
import Payment from './component/cart/Payment'
import axios from 'axios'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import OrderSuccess from './component/cart/OrderSuccess'
import MyOrders from './component/Order/MyOrders'
import OrderDetails from './component/Order/OrderDetails'
import Footer from './component/layout/Footer/Footer'
import DashBoard from "./component/Admin/DashBoard"
import ProductList from './component/Admin/ProductList'
import NewProduct from './component/Admin/NewProduct'
import UpdateProduct from './component/Admin/UpdateProduct'
import OrderList from './component/Admin/OrderList'
import ProcessOrder from './component/Admin/ProcessOrder'
import UsersList from './component/Admin/UsersList'
import UpdateUser from './component/Admin/UpdateUser'
import ProductReviews from './component/Admin/ProductReviews'
import NotFound from './component/layout/Not Found/NotFound'
import About from "./component/layout/About/About"
import Contact from './component/layout/Contact/Contact'

const App = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector(state => state.user)

  const [publishableKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Drovid Sans", "Chilanka"],
      }
    })
    dispatch(userLoad())
    getStripeApiKey()
  }, [dispatch])

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (

    <BrowserRouter>
      <Header />
      <Routes>

        <Route exact path='/' element={<Home />} />
        <Route exact path='/product/:id' element={<ProductDetails />} />
        <Route exact path='/products' element={<Product />} />
        <Route path='/products/:keyword' element={<Product />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/password/forgot' element={<ForgotPassword />} />
        <Route exact path='/password/reset/:token' element={< ResetPassword />} />
        <Route exact path='/cart' element={< Cart />} />

        <Route exact path='/me' element={isAuthenticated ? <UserProfile /> : <Login />} />

        <Route exact path='/me/update' element={isAuthenticated ? <UpdateProfile /> : <Login />} />

        <Route exact path='/password/update' element={isAuthenticated ? <UpdatePassword /> : <Login />} />

        <Route exact path='/shipping' element={isAuthenticated ? <ShippingInfo /> : <Login />} />

        <Route exact path='/order/confirm' element={isAuthenticated ? <ConfirmOrder /> : <Login />} />

        <Route exact path="/process/payment" element={isAuthenticated ? publishableKey && <Elements stripe={loadStripe(publishableKey)}> <Payment /> </Elements> : <Login />} />

        <Route exact path='/success' element={isAuthenticated ? <OrderSuccess /> : <Login />} />

        <Route exact path='/orders' element={isAuthenticated ? <MyOrders /> : <Login />} />

        <Route exact path='/order/:id' element={isAuthenticated ? <OrderDetails /> : <Login />} />

        <Route exact path='/admin/dashboard' element={isAuthenticated && user.user.role === "admin" ? <DashBoard /> : <Login />} />

        <Route exact path='/admin/products' element={isAuthenticated && user.user.role === "admin" ? <ProductList /> : <Login />} />

        <Route exact path='/admin/product' element={isAuthenticated && user.user.role === "admin" ? <NewProduct /> : <Login />} />

        <Route exact path='/admin/product/:id' element={isAuthenticated && user.user.role === "admin" ? <UpdateProduct /> : <Login />} />

        <Route exact path='/admin/orders/' element={isAuthenticated && user.user.role === "admin" ? <OrderList /> : <Login />} />

        <Route exact path='/admin/order/:id' element={isAuthenticated && user.user.role === "admin" ? <ProcessOrder /> : <Login />} />

        <Route exact path='/admin/users/' element={isAuthenticated && user.user.role === "admin" ? <UsersList /> : <Login />} />

        <Route exact path='/admin/user/:id' element={isAuthenticated && user.user.role === "admin" ? <UpdateUser /> : <Login />} />

        <Route exact path='/admin/reviews/' element={isAuthenticated && user.user.role === "admin" ? <ProductReviews /> : <Login />} />

        <Route path='*' element={window.location.pathname === "/process/payment" ? null : <NotFound />} />

        <Route exact path='/about' element={<About />} />

        <Route exact path='/contact' element={<Contact />} />

      </Routes>

      <Footer />
    </BrowserRouter >

  )
}

export default App