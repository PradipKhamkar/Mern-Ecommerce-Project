const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model.js")

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            res.status(401).json({
                success: false,
                msg: "Please Login First..!!"
            })
        }
        else {
            const decodedData = jwt.verify(token, "JDJJJEWREJFNEJN4NI45N43RN34JN3I4")
            req.user = await userModel.findById(decodedData.id)
            next()
        }
    } catch (error) {
        res.status(400).json({
            success: false,
        })
    }
}


//Checks Authorized User
const isAuthorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
        {
             //console.log(req.user.role)
            res.status(403).json({
                success: false,
                massage: "Not Authorized User"
            })
        }
        else {
            //console.log(req.user.role)
            next()
        }
    }
}

module.exports = { isAuthenticated, isAuthorizeRoles }