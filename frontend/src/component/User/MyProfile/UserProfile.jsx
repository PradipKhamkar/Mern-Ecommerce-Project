import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import MetaData from '../../layout/MetaData'
import "./userProfile.css"
import { userLogOut } from '../../../Redux/actions/userAction'


const UserProfile = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const { name, avatar, email, createdAt, role } = user.user
    const logOutMe = () => {
        dispatch(userLogOut())
    }

    return (
        <Fragment>
            <MetaData title={`${name}'s Profile`} />
            <div className="userProfileContainer">
                <h1>My Profile</h1>
                <div className="userProfileBox">
                    <div className="userProfileImageBox">
                        <img src={avatar.url} alt="Avatar" />
                        <Link to="/me/update">Edit Profile</Link>
                        <Link onClick={logOutMe}>Log Out</Link>
                        {role && role === "admin" ? <Link to='/admin/dashboard' className=''>Dashboard</Link> : []}
                    </div>
                    <div className="userProfileDetailsBox">
                        <div>
                            <h4>Full Name</h4>
                            <p>{name}</p>
                        </div>
                        <div>
                            <h4>Email</h4>
                            <p>{email}</p>
                        </div>
                        <div>
                            <h4>Joined On</h4>
                            <p>{String(createdAt).substr(0, 10)}</p>
                        </div>
                        <div className='profileLinks'>
                            <Link to="/orders">My Orders</Link>
                            <Link to="/password/update">Change Password</Link>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default UserProfile