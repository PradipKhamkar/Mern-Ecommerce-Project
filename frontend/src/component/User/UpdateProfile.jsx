import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SiGmail } from "react-icons/si"
import { MdTagFaces } from "react-icons/md"
import userAvatar from "../../images/User.png"
import { useDispatch, useSelector } from "react-redux"
import { updateUserProfile, userLoad, clearErrors } from '../../Redux/actions/userAction'
import Loader from '../layout/Loader/Loader'
import { UPDATE_PROFILE_RESET } from '../../Redux/constants/userConstant'
import MetaData from '../layout/MetaData'
import { useAlert } from "react-alert"

const UpdateProfile = () => {

    const alert = useAlert()
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    //Get User Data
    const { user } = useSelector(state => state.user)
    const { name, email, avatar } = user.user
    const { error, isUpdated, loading } = useSelector(state => state.profile)

    const [avatarPreview, setAvatarPreview] = useState(userAvatar)

    // //Collect User Update Form Data
    const [userData, SetUserData] = useState({
        name: "",
        email: ""
    })

    const HandelUpdateForm = (e) => {
        e.preventDefault()
        dispatch(updateUserProfile(userData))
    }

    useEffect(() => {
        if (user) {
            SetUserData({ name: name, email: email })
            setAvatarPreview(avatar.url)
        }
        if (error) {
            alert.error(error)
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Profile Update SuccessFully...!!")
            dispatch(userLoad())
            Navigate('/me')
            dispatch({
                type: UPDATE_PROFILE_RESET
            });
        }
    }, [isUpdated, error, Navigate, alert, dispatch, SetUserData, user, name, email, avatar])

    const HandelUserDataChange = (e) => {
        if (e.target.name === 'avatar') {
            if (e.target.files[0].size / 1024 <= 500) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (reader.readyState === 2) {
                        setAvatarPreview(reader.result)
                        SetUserData({ ...userData, avatar: reader.result })

                    }
                }
                reader.readAsDataURL(e.target.files[0])
                // console.log(e.target.files[0])
            }
            else {
                alert.info("Oops Image Size Must Be Less Than 500KB")
            }
        }
        else {
            SetUserData({ ...userData, [e.target.name]: e.target.value })
        }
    }
    return (
        <Fragment>
            <MetaData title={'Update Profile'} />
            {loading ? <Loader /> :
                <Fragment>
                    <div className="LoginSignUpContainer">
                        <div className="LoginSignUpBox">
                            <h2 className="formHeading">Update Profile</h2>
                            <form
                                className="loginForm"
                                encType="multipart/form-data"
                                onSubmit={HandelUpdateForm}
                            >
                                <div className="signUpName">
                                    <MdTagFaces />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={userData.name}
                                        onChange={(e) => { HandelUserDataChange(e) }}
                                    />
                                </div>
                                <div className="signUpEmail">
                                    < SiGmail />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={userData.email}
                                        onChange={(e) => { HandelUserDataChange(e) }}
                                    />
                                </div>

                                <div id="registerImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={(e) => HandelUserDataChange(e)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update Profile"
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

export default UpdateProfile