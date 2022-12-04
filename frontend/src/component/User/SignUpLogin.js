import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AiOutlineMail } from "react-icons/ai"
import { CiLock } from "react-icons/ci"
import { MdOutlineTagFaces } from "react-icons/md"
import "./SignUpLogin.css"
import userAvatar from "../../images/User.png"
import { useDispatch, useSelector } from "react-redux"
import { userLogin, userRegister, clearErrors } from '../../Redux/actions/userAction'
import Loader from '../layout/Loader/Loader'
import { useAlert } from "react-alert"
import MetaData from '../layout/MetaData'

const SignUpLogin = () => {

    const alert = useAlert()
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    const Location = useLocation()


    const { error, loading, isAuthenticated } = useSelector(state => state.user)

    //Controller RegBtn
    const [regBtn, setRegBtn] = useState(true)

    //Collect Login Data
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")

    //Handel Login Submit
    const HandelLoginSubmit = (e) => {
        e.preventDefault()
        dispatch(userLogin(userEmail, userPassword))

    }
    const redirect = Location.search ? Location.search.split("=")[1] : "/me";

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            alert.success("Login SuccessFully..!!")
            Navigate(redirect)
        }
    }, [isAuthenticated, error, Navigate, redirect, alert, dispatch])

    //Handel User Avatar Image
    const [avatar, setAvatar] = useState()
    const [avatarPreview, setAvatarPreview] = useState(userAvatar)

    //Collect User Register Form Data
    const [userData, SetUserData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const { name, email, password } = userData

    //Validation Form Data
    const validateFormData = (e, validate) => {
        if (e.target.value.length > validate) {
            e.target.style.border = "1px solid green"
        }
        else {
            e.target.style.border = "1px solid red"
        }
    }

    //HandelRegister Form Data
    const HandelRegisterForm = (e) => {
        e.preventDefault()
        if (name.length > 4 && password.length > 8 && avatar !== "") {
            const formData = new FormData()
            formData.set('name', name)
            formData.set('email', email)
            formData.set('password', password)
            formData.set('avatar', avatar)
            dispatch(userRegister(userData))
        }
        else {
            alert.info("Please Enter Valid Information")
        }
    }

    //Handel User Data Change
    const HandelUserDataChange = (e) => {
        if (e.target.name === 'avatar') {
            if (e.target.files[0].size / 1024 <= 500) {
                setRegBtn(false)
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (reader.readyState === 2) {
                        setAvatar(reader.result)
                        setAvatarPreview(reader.result)
                        SetUserData({ ...userData, avatar: reader.result })
                        // console.log(reader.result)
                    }
                }
                reader.readAsDataURL(e.target.files[0])
                // console.log(e.target.files[0])
            }
            else {
                alert.info("Oops Image Size Must Be Less Than 500KB")
                setRegBtn(true)
            }
        }
        else {
            SetUserData({ ...userData, [e.target.name]: e.target.value })
        }
    }

    //Form Style Section
    const loginTab = useRef();
    const registerTab = useRef();
    const switcherTab = useRef();
    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }

    };

    return (
        <Fragment>
            <MetaData title={'Sign Up & Login'} />
            {loading ? <Loader /> : <Fragment>
                <div className="LoginSignUpContainer">
                    <div className="LoginSignUpBox">
                        <div>
                            <div className="login_signUp_toggle">
                                <p onClick={(e) => switchTabs(e, "login")} >LOGIN</p>
                                <p onClick={(e) => switchTabs(e, "register")} >REGISTER</p>
                            </div>
                            <button ref={switcherTab}></button>
                        </div>
                        <form className="loginForm" ref={loginTab} onSubmit={(e) => { HandelLoginSubmit(e) }}>
                            <div className="loginEmail">
                                <AiOutlineMail />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </div>
                            <div className="loginPassword">
                                <CiLock />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                />
                            </div>
                            <Link to="/password/forgot">Forget Password ?</Link>
                            <input type="submit" value="Login" className="loginBtn" />
                        </form>
                        <form
                            className="signUpForm"
                            encType="multipart/form-data"
                            ref={registerTab}
                            onSubmit={(e) => { HandelRegisterForm(e) }}>
                            <div className="signUpName">
                                <MdOutlineTagFaces />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    required
                                    name="name"
                                    onChange={(e) => {
                                        validateFormData(e, 4)
                                        HandelUserDataChange(e)
                                    }}
                                />
                            </div>
                            <div className="signUpEmail">
                                < AiOutlineMail />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    name="email"
                                    onChange={(e) => HandelUserDataChange(e)}
                                />
                            </div>
                            <div className="signUpPassword">
                                <CiLock />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    name="password"
                                    onChange={(e) => {
                                        validateFormData(e, 8)
                                        HandelUserDataChange(e)
                                    }}
                                />
                            </div>
                            <div id="registerImage">
                                <img alt="Avatar Preview" src={avatarPreview} />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    required
                                    onChange={(e) => HandelUserDataChange(e)}
                                />
                            </div>
                            <input type="submit"
                                value="Register"
                                className="signUpBtn"
                                disabled={regBtn ? true : false}
                            />
                        </form>
                    </div>
                </div>
            </Fragment>}
        </Fragment>
    )
}

export default SignUpLogin