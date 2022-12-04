import React, { Fragment } from 'react'
import "./userOptions.css"
import userAvatar from "../../../images/User.png"


const UserOptions = (props) => {
    const { user } = props.authUser
    return (
        <Fragment>
            {/* <span className="userOptionsMsg">{user.name.toUpperCase()}</span> */}
            <span className='userOptionAvatar'><img src={user.avatar.url ? user.avatar.url : userAvatar} alt="" /></span>
        </Fragment>
    )
}

export default UserOptions