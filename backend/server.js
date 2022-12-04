

//Config 
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: 'backend/config/config.env' })
}

const app = require("./app.js")
const productModel = require("./models/products-model.js")
const cloudinary = require("cloudinary")
const connectDB = require("./config/DBconnect.js")

//Connect DB
connectDB()

//Config Cloudniary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
})

app.listen(process.env.PORT, () => {
    console.log(`Server Run Is Running On http://localhost:${process.env.PORT}`)
})
