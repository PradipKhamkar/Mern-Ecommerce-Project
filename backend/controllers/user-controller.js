const userModel = require("../models/user-model.js");
const sendToken = require("../utils/jwtToken.js");
const { sendEmail } = require("../utils/sendEmail.js");
const cloudinary = require("cloudinary")
const crypto = require("crypto");


//Register User
const registerUser = async (req, res, next) => {
    try {

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatar",
            width: 200,
            crop: "scale"
        })
        const { name, email, password } = req.body;
        const user = await userModel.create({
            name: name,
            email: email,
            password: password,
            avatar:
            {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        })
        sendToken(user, res, 201)
    } catch (error) {
        console.log(error)
        if (error.code == 11000) {
            error.massage = "Email Address Are Already Exit"
        }
        res.status(404).json({
            "error": error.massage
        })
    }
}


//Login User
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //checking if user given password and email both
        if (!email || !password) {
            res.status(401).json({
                success: false,
                massage: "Please Enter Email And Password"
            })
        }
        const user = await userModel.findOne({ email: email }).select("+password")
        //console.log(user)
        if (user) {
            const isPasswordMatched = await user.comparePass(password)
            // console.log(isPasswordMatched)
            if (isPasswordMatched) {
                sendToken(user, res, 200, req)
            }
            else {
                res.status(404).json({
                    success: false,
                    massage: "Please Enter Valid Email And Password"
                })
            }
        }
        else {
            res.status(401).json({
                "success": false,
                "massage": "Please Enter Valid Email And Password"
            })
        }

    } catch (error) {
        res.status(401).json({
            error: error.messages
        })
    }

}


//LogOut User
const logOut = async (req, res, next) => {

    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    res.status(200).json({
        success: true,
        message: "Logged Out Successfully..!!"
    })
}


//Forget Password
const forgotPassword = async (req, res, next) => {
    try {

        const user = await userModel.findOne({ email: req.body.email })

        // console.log(user);
        if (!user) {
            res.status(404).json({
                message: "User Not Found"
            })
        }
        else {
            //Get Reset Password Tokens
            const resetToken = user.getResetPasswordToken();

            //Save resetPasswordToken to userSchema
            await user.save()

            const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
            const message = `Your Password Reset token is  : \n\n ${resetPasswordUrl} \n\n If You Have Not Requested This Email Then, Please ignore it`

            try {
                await sendEmail({
                    name: user.name,
                    email: user.email,
                    subject: `Ecommerce Password Recovery`,
                    message: message
                })
                res.status(200).json({
                    success: true,
                    message: `Reset Password Link Is Send To ${user.email}`,
                })
            } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save()
                res.status(500).json({
                    success: false,
                    error
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        })

    }
}

//Set Forget Password
const setPassword = async (req, res, next) => {
    try {

        //creating token hash
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await userModel.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        })

        if (!user) {
            res.status(400).json({
                message: "Reset Password Token is invalid or Has been expired"
            })
        }
        else {
            if (req.body.password !== req.body.confirmPassword) {
                res.status(400).json({
                    message: "Password Does Not Match"
                })
            }
            if (req.body.password == req.body.confirmPassword) {
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save()
                sendToken(user, res, 200);
            }
        }

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }

}

//Change Password
const changeUserPassword = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id).select("+password")

        if (!req.body.newpassword && !req.body.confirmpassword) {
            res.status(400).json({ success: false, message: "Please Enter Password" })
        }

        const isPasswordMatched = await user.comparePass(req.body.oldpassword)

        if (!isPasswordMatched) {
            res.status(400).json({ success: false, message: "Old Password Does Not Match" })
        }

        if (req.body.newpassword != req.body.confirmpassword) {
            res.status(400).json({ success: false, message: "Password Does Not Match" })
        }
        else {
            user.password = req.body.newpassword
            await user.save()
            sendToken(user, res, 201)
        }
    } catch (error) {
        console.log(error.message)
    }

}

//Update User Profile
const updateUserProfile = async (req, res, next) => {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email
        }
        if (req.body.avatar) {
            const user = await userModel.findById(req.user.id)

            const imageId = user.avatar.public_id
            await cloudinary.v2.uploader.destroy(imageId)

            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatar",
                width: 200,
                crop: "scale",
                chunk_size: 6000000
            })
            userData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        const user = await userModel.findByIdAndUpdate(req.user.id, userData, { returnDocument: "after" })
        res.status(200).json({
            success: true,
            message: "Profile Update SuccessFully"
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }

}

//Get Profile Details
const getUserProfile = async (req, res, next) => {
    try {
        if (req.user) {
            const user = await userModel.findById(req.user.id)
            res.status(200).json({ success: true, user })
        }
        else {
            res.status(404).json({
                success: false,
                message: "User Not Found :)"
            })
        }
    } catch (error) {
        console.log(error.message);
    }

}

//Get All User(Admin)
const getAllUser = async (req, res, next) => {
    try {
        const userCount = await userModel.find().countDocuments()
        const users = await userModel.find()
        if (!users) {
            res.status(404).json({ success: false, message: "No User Register Yet" })
        }
        res.status(200).json({ success: true, userCount, users })
    } catch (error) {
        console.log(error.message);
    }

}

//Get Single User(Admin)
const getSingleUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.id)
        if (!user) {
            res.status(404).json({ success: false, message: "User Not Found" })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error.message);
    }
}

//Update User Role(Admin)
const updateUserRole = async (req, res, next) => {
    try {
        const { name, email, role } = req.body
        const user = await userModel.findByIdAndUpdate(req.params.id, { name: name, email: email, role: role }, { returnDocument: "after" })
        if (!user) {
            res.status(404).json({ success: false, message: "User Not Found" })
        }
        res.status(200).json({ success: true, message: "User Role Update SuccessFully", user })
    } catch (error) {
        console.log(error.message)
    }
}

//Delete User (Admin)
const deleteUser = async (req, res, next) => {

    try {
        const user = await userModel.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(404).json({ success: false, message: "User Not Found" })
        }
        const imageId = user.avatar.public_id
        await cloudinary.v2.uploader.destroy(imageId)

        res.status(200).json({ success: true, message: "Profile Deleted SuccessFully" })
    } catch (error) {
        console.log(error.message);
    }

}



module.exports = {
    registerUser, loginUser, logOut, forgotPassword,
    setPassword, getUserProfile, changeUserPassword,
    updateUserProfile, getAllUser, getSingleUser,
    updateUserRole, deleteUser
}