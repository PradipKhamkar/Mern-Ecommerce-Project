import React, { Fragment } from 'react'
import "./NewProduct.css"
import { useSelector, useDispatch } from "react-redux"
import Sidebar from "./Sidebar"
import { Button } from '@material-ui/core'
import { BsSpellcheck } from "react-icons/bs"
import { MdVerifiedUser, MdOutgoingMail } from "react-icons/md"
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserDetails, updateUser, clearErrors } from '../../Redux/actions/userAction'
import { UPDATE_USER_RESET } from '../../Redux/constants/userConstant'
import { useAlert } from "react-alert"
import MetaData from '../layout/MetaData'


const UpdateUser = () => {

    const alert = useAlert()
    const { id } = useParams()
    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const { error, user } = useSelector(state => state.userDetails)

    const {
        loading: updateLoading,
        error: updateError,
        isUpdated,
    } = useSelector(state => state.profile);

    //Collect User Product Form Data
    const [userData, SetUserData] = useState({
        name: "",
        email: "",
        role: ""
    })

    useEffect(() => {
        if (user && user._id !== id) {
            dispatch(getUserDetails(id));
        } else {
            SetUserData({
                name: user.name,
                email: user.email,
                role: user.role,
            })
        }
        if (error) {
            alert.error(error)
            dispatch(clearErrors())

        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success("User Updated Successfully");
            Navigate("/admin/users");
            dispatch({ type: UPDATE_USER_RESET });
        }
    }, [error, Navigate, isUpdated, dispatch, user, SetUserData, id, updateError, alert])

    const UpdateUserSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser(id, userData));
    };

    return (
        <Fragment>
            <div className="dashboard">
                <MetaData title={'UPDATE USER --ADMIN'} />
                <Sidebar />
                <div className="newProductContainer">
                    <form
                        className="createProductForm"
                        encType="multipart/form-data"
                        onSubmit={(e) => { UpdateUserSubmitHandler(e) }}
                    >
                        <h1>Update User</h1>
                        <div>
                            <BsSpellcheck />
                            <input
                                type="text"
                                placeholder="Product Name"
                                required
                                name="name"
                                value={userData.name}
                                onChange={(e) => SetUserData({ ...userData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <MdOutgoingMail />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                name="email"
                                value={userData.email}
                                onChange={(e) => SetUserData({ ...userData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <MdVerifiedUser />
                            <select value={userData.role} onChange={(e) => SetUserData({ ...userData, role: e.target.value })}>
                                <option value="">Choose Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={
                                updateLoading ? true : false || userData.role === "" ? true : false
                            }
                        >
                            Update
                        </Button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateUser