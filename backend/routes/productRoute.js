const express = require("express")
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, addProductReviews, getAllReviews, getAdminProducts, deleteReview } = require("../controllers/productController.js")
const { isAuthenticated, isAuthorizeRoles } = require("../middleware/auth.js")
const route = express.Router()



route.get("/products", getAllProducts)
route.get("/product/:id", getProductDetails)


route.post("/reviews", isAuthenticated, addProductReviews)
route.get("/reviews", getAllReviews)
route.delete("/reviews", deleteReview)


//Admin Routes
route.post("/product/new", isAuthenticated, isAuthorizeRoles("admin"), createProduct)
route.put("/product/:id", isAuthenticated, isAuthorizeRoles("admin"), updateProduct)
route.delete("/product/:id", isAuthenticated, isAuthorizeRoles("admin"), deleteProduct)
route.get("/admin/products/", isAuthenticated, isAuthorizeRoles("admin"), getAdminProducts)



module.exports = route