const orderModel = require("../models/orderModel.js");
const productModel = require("../models/products-model.js");

//create new order
const newOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItem,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body

        const order = await orderModel.create({
            shippingInfo,
            orderItem,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        })

        res.status(201).json({ success: true, order })
    }
    catch (error) {

        res.status(400).json({ success: false, error })
    }
}

//getSingle Order
const getSingleOrder = async (req, res, next) => {
    try {
        const order = await orderModel.findById(req.params.id).populate("user", "name email")
        if (!order) {
            res.status(404).json({ success: false, massage: 'Order Not Found' })
        }
        else {
            res.status(200).json({ success: true, order })
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

//get All Order Of Logged User
const myOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.find({ user: req.user._id })
        if (!orders) {
            res.status(404).json({ success: false, massage: 'Order Not Found With This Id' })
        }
        else {
            res.status(200).json({
                success: true,
                orders,
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }

}

//Get All Orders --Admin
const getAllOrders = async (req, res, next) => {
    try {
        const orderCount = await orderModel.find().countDocuments()
        const orders = await orderModel.find().populate("user", "name email")
        //Calculate Total Amount
        let totalAmount = 0
        orders.forEach((value) => { totalAmount += value.totalPrice })
        res.status(200).json({ success: true, orderCount, totalAmount, orders, })
    } catch (error) {
        console.log(error.message);
    }

}


//Update Order
const updateOrder = async (req, res, next) => {
    try {

        const order = await orderModel.findById(req.params.id)
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order Not Found With This Id',
            })
        }
        if (order.orderStatus == 'Delivered') {
            res.status(404).send({
                message: "Order Already Delivered"
            })
        }

        if (req.body.status === "Shipped") {
            order.orderItem.forEach(async (item) => {
                await updateStock(item.product, item.quantity)
            });
        }

        order.orderStatus = req.body.status;
        if (req.body.status == "Delivered") {
            order.deliverAt = Date.now()
        }
        await order.save()
        res.status(200).json({ success: true })

    } catch (error) {
        console.log(error.message);
    }

}

//Update Stock Function
async function updateStock(id, qty) {
    const product = await productModel.findById(id);
    product.Stock -= qty
    await product.save()
}


//Delete Order
const deleteOrder = async (req, res, next) => {
    try {
        const order = orderModel.findById(req.params.id)
        if (!order) {
            res.status(404).json({ success: false, message: 'Order Not Found' })
        }
        else {
            await orderModel.findByIdAndDelete(req.params.id)
            res.status(200).json({ success: true, message: 'Order Delete SuccessFully' })
        }
    } catch (error) {
        console.log(error);
    }

}
module.exports = { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrder }