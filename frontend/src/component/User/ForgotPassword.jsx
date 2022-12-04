import React, { Fragment, useEffect, useState } from 'react'
import { SiGmail } from "react-icons/si"
import "./ForgotPassword.css"
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword, clearErrors } from '../../Redux/actions/userAction'
import Loader from '../layout/Loader/Loader'
import MetaData from '../layout/MetaData'
import { useAlert } from "react-alert"


const ForgotPassword = () => {

    const alert = useAlert()
    const dispatch = useDispatch()


    const { error, message, loading } = useSelector(state => state.forgotPassword)

    const [email, setEmail] = useState()
    const HandelForgotSubmit = (e) => {
        e.preventDefault()
        dispatch(forgotPassword(email))
    }
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors());
        }
        if (message) {
            alert.info(message)
        }
    }, [message, error, alert, dispatch])
    return (
        <Fragment>
            <MetaData title={'Forget Password'} />
            {loading ? <Loader /> :
                <Fragment>
                    <div className="ForgetPasswordContainer">
                        <div className="ForgetPasswordBox">
                            <h2 className="formHeading">Forgot Password </h2>
                            <form
                                className="ForgetPasswordForm"
                                onSubmit={HandelForgotSubmit}
                            >
                                <div className="ForgetPasswordInput">
                                    < SiGmail />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Send"
                                    className="forgetBtn"
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

export default ForgotPassword