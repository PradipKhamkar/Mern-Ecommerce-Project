const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pinCode: { type: Number, required: true, maxLength: 6 },
        phoneNumber: { type: Number, required: true, maxLength: 10 },
    },
orderItem: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            product: { type: mongoose.Schema.ObjectId, ref: "product", required: true }
        }
    ],

user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },

paymentInfo: {
         transactionId: { type: String, required: true },
         status: { type: String, required: true },
    },

paidAt: {
        type: Date,
        required: true
    },
itemsPrice:
    {
        type: Number,
        required: true
    },
taxPrice:
    {
        type: Number,
        required: true
    },
shippingPrice:
    {
        type: Number,
        required: true
    },
totalPrice:
    {
        type: Number,
        required: true
    },
orderStatus:
    {
        type: String,
        required: true,
        default: "Processing",

    },
deliverAt: Date,
createdAt: {
        type: Date,
        default: Date.now()
    }

})

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel