const express = require("express")
const route = express.Router()
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderControllers");
const { isAuthenticated, isAuthorizeRoles } = require("../middleware/auth");

route.post("/order/new", isAuthenticated, newOrder)
route.get("/order/:id", isAuthenticated, getSingleOrder)
route.get("/myorders", isAuthenticated, myOrders)

route.get("/admin/orders", isAuthenticated, isAuthorizeRoles("admin"), getAllOrders)
route.put("/admin/orders/:id", isAuthenticated, isAuthorizeRoles("admin"), updateOrder)
route.delete("/admin/orders/:id", isAuthenticated, isAuthorizeRoles("admin"), deleteOrder)




module.exports = route