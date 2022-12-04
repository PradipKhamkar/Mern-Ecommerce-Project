const express = require("express")
const{ registerUser, loginUser, logOut, forgotPassword, setPassword, getUserProfile, changeUserPassword, updateUserProfile, getSingleUser, getAllUser, deleteUser, updateUserRole }= require("../controllers/user-controller.js")
const { isAuthenticated, isAuthorizeRoles } = require("../middleware/auth.js")
const route = express.Router()


route.post("/register", registerUser)
route.post("/login", loginUser)
route.get("/logout",logOut)
route.post("/password/forgot",forgotPassword)
route.put("/password/reset/:token",setPassword)
route.get("/me", isAuthenticated, getUserProfile)
route.put("/password/change", isAuthenticated, changeUserPassword)
route.put("/me/update", isAuthenticated, updateUserProfile)

//Admin Router
route.get("/admin/users",isAuthenticated,isAuthorizeRoles("admin"), getAllUser)
route.get("/admin/user/:id", isAuthenticated, isAuthorizeRoles("admin"), getSingleUser)
route.put("/admin/user/:id", isAuthenticated, isAuthorizeRoles("admin"), updateUserRole)
route.delete("/admin/user/:id",isAuthenticated,isAuthorizeRoles("admin"),deleteUser)

module.exports = route