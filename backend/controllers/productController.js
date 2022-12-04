
const productModel = require("../models/products-model.js");
const ApiFeature = require("../utils/apiFeature.js");
const cloudinary = require("cloudinary")

//Create Product API: --Admin
const createProduct = async (req, res, next) => {
    try {
        let { images, name, price, category, Stock, description } = req.body;

        let imagesData = [...images];

        const imagesLinks = [];

        for (let i = 0; i < imagesData.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        images = imagesLinks;
        const product = await productModel.create({
            name,
            price,
            description,
            category,
            Stock,
            images,
            user: req.user.id
        });
        res.status(201).json({
            message: "Product Created SuccessFully",
            success: true,
            product,
        });
    } catch (error) {
        res.status(200).json(
            {
                "success": false,
                error: [error.message]
            }
        )
    }

}

//Get All Products API 
const getAllProducts = async (req, res) => {
    try {
        const productCount = await productModel.countDocuments()
        const resultPerPage = 6;
        const apiFeature = new ApiFeature(productModel.find(), req.query)
            .search()
            .filter()
        let products = await apiFeature.query;

        const filterProductCount = products.length;

        apiFeature.pagination(resultPerPage)

        products = await apiFeature.query.clone()

        res.status(200).json({
            success: true,
            message: "Get All Data SuccessFully :) ",
            products,
            productCount,
            resultPerPage,
            filterProductCount
        })
    } catch (error) {
        console.log(error.message)
    }
}

//Get Product Details
const getProductDetails = async (req, res, next) => {

    try {
        let product = await productModel.findById(req.params.id)

        if (!product) {
            return res.status(500).json({
                "success": false,
                "message": "Product Not Found :("
            })
        }
        res.status(200).json({
            "success": true,
            "msg": "Product Found :)",
            product
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            message: error.name == "CastError" ? "Product Not Found" : "Internal Server Error"
        })
    }
}


//Update Product(Admin)
const updateProduct = async (req, res, next) => {
    try {
        let { images, name, price, category, Stock, description } = req.body;

        let product = await productModel.findById(req.params.id)

        if (!product) {
            return res.status(500).json({
                "success": false,
                message: "Sorry Product Not Found :)"
            })
        }

        if (images.length > 0) {

            // Deleting Images From Cloudinary
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            let imagesData = [...images];

            const imagesLinks = [];

            // Updating/Adding New Image 

            for (let i = 0; i < imagesData.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            req.body.images = imagesLinks;
        }
        else {
            delete req.body["images"]
        }
        product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: "after"
        })
        res.status(200).json(
            {
                success: true,
                message: "Product Update SuccessFully :)",
                product
            }
        )
    } catch (error) {
        res.status(200).json(
            {
                success: false,
                error: [error.message]
            }
        )
    }
}

// Get ALL Product (Admin)
const getAdminProducts = async (req, res, next) => {
    try {
        const products = await productModel.find();
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        res.status(404).json({
            "success": false,
        })
    }
}

//Delete Product(Admin)
const deleteProduct = async (req, res, next) => {
    try {
        let product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json(
                {
                    "success": false,
                    "message": "Sorry Product Not Found :)"
                }
            )
        }
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        product = await productModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            "success": true,
            "message": "Product Delete SuccessFully :) ",
            product
        })
    } catch (error) {
        console.log(error.message);
    }

}


//Product Reviews
const addProductReviews = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment: comment,
            avatar: req.user.avatar.url
        }

        const product = await productModel.findById(productId)
        const isReviewed = product.reviews.filter((rev) => rev.user.toString() == req.user.id.toString())
        if (isReviewed.length != 0) {
            //console.log(isReviewed)
            isReviewed.filter((rev) => {
                rev.comment = comment;
                rev.rating = rating;
            })
            await product.save()
            res.status(200).json({ success: true, message: "Review Update SuccessFully" })
        }
        else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length
            await product.save()
            res.status(200).json({ success: true, message: "Review Add SuccessFully" })
        }

        let totalRating = 0
        product.reviews.forEach((rev) => {
            totalRating += rev.rating
        })
        product.ratings = totalRating / product.reviews.length
        product.save()

    } catch (error) {
        res.status(400).json({ success: false, massage: "Product Not Found" })
    }
}

// Get All Reviews Of Single Product
const getAllReviews = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.query.productId)
        if (!product) {
            res.status(404).json({ success: false, message: "Product Not Found" })
        }
        else {
            const reviews = product.reviews
            res.status(200).json({ success: true, reviews })
        }
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error
        })
    }
}


// Delete Review
const deleteReview = async (req, res, next) => {
    try {
        console.log(req.query)
        const product = await productModel.findById(req.query.productId);

        if (!product) {
            res.status(400).json({
                success: false,
                message: "Product Not Found With This ID..!!"
            });
        }
        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );

        let avg = 0;

        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        let ratings = 0;

        if (reviews.length === 0) {
            ratings = 0;
        } else {
            ratings = avg / reviews.length;
        }

        const numOfReviews = reviews.length;

        await productModel.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                ratings,
                numOfReviews,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            success: false,
        });
    }
};
module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, addProductReviews, getAllReviews, getAdminProducts, deleteReview }