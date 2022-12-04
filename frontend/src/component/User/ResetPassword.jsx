import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BiLockOpenAlt, BiLockAlt } from "react-icons/bi"
import "./UpdateProfile.css"
import { useDispatch, useSelector } from "react-redux"
import { resetPassword, clearErrors } from '../../Redux/actions/userAction'
import Loader from '../layout/Loader/Loader'
import { useAlert } from "react-alert"
import MetaData from '../layout/MetaData'

const ResetPassword = () => {

    const alert = useAlert()
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    const { token } = useParams()
    const updateProfileBtn = useRef()

    //Get User Data
    const { error, success, loading } = useSelector(state => state.forgotPassword)

    //Collect User Update Form Data
    const [userData, SetUserData] = useState({
        password: "",
        confirmPassword: ""
    })

    const HandelUpdatePasswordForm = (e) => {
        e.preventDefault()
        dispatch(resetPassword(token, userData))
    }

    const HandelUserDataChange = (e) => {
        SetUserData({ ...userData, [e.target.name]: e.target.value })
    }
    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success("Password Reset SuccessFully...!!")
            Navigate('/login')
        }
    }, [error, Navigate, success, alert, dispatch])

    return (
        <Fragment>
            <MetaData title={'Reset Password'} />
            {loading ? <Loader /> :
                <Fragment>
                    <div className="LoginSignUpContainer">
                        <div className="LoginSignUpBox">
                            <h2 className="formHeading">Reset Password</h2>
                            <form
                                className="loginForm"
                                onSubmit={HandelUpdatePasswordForm}
                            >
                                <div className="signUpName">
                                    < BiLockAlt />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        name="password"
                                        value={userData.password}
                                        onChange={(e) => {

                                            if (e.target.value.length > 8) {
                                                e.target.style.border = " 2px solid green"
                                            }
                                            else {
                                                e.target.style.border = " 2px solid red"
                                            }
                                            HandelUserDataChange(e)
                                        }}
                                    />
                                </div>
                                <div className="signUpName">
                                    < BiLockOpenAlt />
                                    <input
                                        type="text"
                                        placeholder="Confirm Password"
                                        required
                                        name="confirmPassword"
                                        value={userData.confirmPassword}
                                        onChange={(e) => {
                                            if (e.target.value.length > 8) {
                                                e.target.style.border = " 2px solid green"
                                            }
                                            else {
                                                e.target.style.border = " 2px solid red"
                                            }
                                            HandelUserDataChange(e)
                                        }}
                                    />
                                </div>
                                <input
                                    ref={updateProfileBtn}
                                    type="submit"
                                    value="Reset Password"
                                    className="signUpBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

export default ResetPassword