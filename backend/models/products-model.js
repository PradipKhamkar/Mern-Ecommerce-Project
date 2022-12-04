const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Product Name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    ratings:
    {
        type: Number,
        default: 0
    },
    images:
        [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }

            }
        ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    Stock:
    {
        type: Number,
        required: [true, "Please Enter Stock Number"],
        maxLength: [4, "Stock Cannot exceed 4 character"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true
            },
            avatar: {
                type: String,
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            }
            ,
            comment: {
                type: String
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    createdAt:
    {
        type: Date,
        default: Date.now(),
    }
})

const productModel = mongoose.model("Product", productSchema)

module.exports = productModel