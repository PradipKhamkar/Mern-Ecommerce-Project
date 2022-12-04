import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiLockOpenAlt } from "react-icons/bi"
import { MdVpnKey } from "react-icons/md"
import "./UpdateProfile.css"
import { useDispatch, useSelector } from "react-redux"
import { updateUserPassword, userLoad, clearErrors } from '../../Redux/actions/userAction'
import Loader from '../layout/Loader/Loader'
import { UPDATE_PASSWORD_RESET } from '../../Redux/constants/userConstant'
import { useAlert } from "react-alert"
import MetaData from '../layout/MetaData'

const UpdatePassword = () => {

    const alert = useAlert()
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    const updateProfileBtn = useRef()

    //Get User Data
    const { error, isUpdated, loading } = useSelector(state => state.profile)

    //Collect User Update Form Data
    const [userData, SetUserData] = useState({
        oldpassword: "",
        newpassword: "",
        confirmpassword: ""
    })


    //Validation Form Data
    const validateFormData = (e, validate) => {
        if (e.target.value.length >= validate) {
            e.target.style.border = "1px solid green"
        }
        else {
            e.target.style.border = "1px solid red"
        }
    }

    //Form Data Change
    const HandelUserDataChange = (e) => {
        SetUserData({ ...userData, [e.target.name]: e.target.value })
    }

    //Handel Submit Form Data
    const HandelUpdatePasswordForm = (e) => {
        e.preventDefault()
        dispatch(updateUserPassword(userData))
    }

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors());
        }
        if (isUpdated) {
            dispatch(userLoad())
            alert.success("Password Update SuccessFully")
            Navigate('/me')
            dispatch({
                type: UPDATE_PASSWORD_RESET
            });
        }
    }, [isUpdated, error, Navigate, alert, dispatch, SetUserData,])


    return (
        <Fragment>
            <MetaData title={"Update Password"} />
            {loading ? <Loader /> :
                <Fragment>
                    <div className="LoginSignUpContainer">
                        <div className="LoginSignUpBox">
                            <h2 className="formHeading">Change Password</h2>
                            <form
                                className="loginForm"
                                onSubmit={HandelUpdatePasswordForm}
                            >
                                <div className="signUpName">
                                    <MdVpnKey />
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        name="oldpassword"
                                        value={userData.oldpassword}
                                        onChange={(e) => {
                                            validateFormData(e, 8)
                                            HandelUserDataChange(e)
                                        }}
                                    />

                                </div>
                                <div className="signUpEmail">
                                    < BiLockOpenAlt />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        name="newpassword"
                                        value={userData.newpassword}
                                        onChange={(e) => {
                                            validateFormData(e, 8)
                                            HandelUserDataChange(e)
                                        }}
                                    />
                                </div>
                                <div className="signUpEmail">
                                    < BiLockOpenAlt />
                                    <input
                                        type="text"
                                        placeholder="Confirm Password"
                                        required
                                        name="confirmpassword"
                                        value={userData.confirmpassword}
                                        onChange={(e) => {
                                            validateFormData(e, 8)
                                            HandelUserDataChange(e)
                                        }}
                                    />
                                </div>
                                <input
                                    ref={updateProfileBtn}
                                    type="submit"
                                    value="Change Password"
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

export default UpdatePassword