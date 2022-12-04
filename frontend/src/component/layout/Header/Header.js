import React, { useState } from 'react'
import './Header.css'
import { BsFillCartCheckFill, BsFillPersonFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi"
import { FaSistrix } from "react-icons/fa"
import logo from "../../../images/PngItem_12001.png"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import UserOptions from '../UserOptions/UserOptions';


const Header = () => {
    const { user, isAuthenticated } = useSelector(state => state.user)
    const { cartItems } = useSelector(state => state.cart)

    const history = useNavigate()
    const [keyword, setKeyword] = useState()
    const searchSubmitHandler = (e) => {
        e.preventDefault()
        if (keyword) {
            history(`/products/${keyword}`)
        }
        else {
            history("/products")
        }
    }
    return (
        <>
            <header>
                <div className="main_header">
                    <div className="header_div">
                        <div className="logo">
                            <button><GiHamburgerMenu /></button>
                            <Link to={'/'}><img src={logo} alt="Site Logo" /></Link>
                        </div>
                        <div className="serachbox">
                            <form action="" onSubmit={(e) => { searchSubmitHandler(e) }}>
                                <input type="search"
                                    placeholder='search product here'
                                    onChange={(e) => setKeyword(e.target.value)} />
                                <button> <FaSistrix /> Serach</button>
                            </form>
                        </div>
                        <div className="icons">
                            <Link to={isAuthenticated ? '/me' : '/login'}>
                                <div className="myaccount ">
                                    {isAuthenticated ? <UserOptions authUser={user} /> : <span className=''>Login <BsFillArrowRightCircleFill /> <BsFillPersonFill /></span>}
                                </div>
                            </Link>
                            <div className="myaccount myCart">
                                <Link to="/cart">  <span><BsFillCartCheckFill /></span> <span className='cartCount'>{cartItems.length}</span></Link>
                            </div>
                            {/* <div className="mycart myaccount">
                                <Link to="/cart">  <span><BsFillCartCheckFill /></span> <span className='text-white fw-bold'>{cartItems.length}</span></Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header