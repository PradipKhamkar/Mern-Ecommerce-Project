const express = require("express")
const bodyParser = require("body-parser")
const expressFileUpload = require("express-fileupload")
const cookieParser = require("cookie-parser")
const userModel = require("./models/user-model.js")
const cors = require("cors")
const app = express()
const product = require("./routes/productRoute.js")
const user = require("./routes/userRoute.js")
const order = require("./routes/orderRoute.js")
const payment = require("./routes/paymentRoute")
const productModel = require("./models/products-model.js")
const path = require("path")


app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

//Use Express File Upload
app.use(expressFileUpload())

//Use Cookies-Parser
app.use(cookieParser())

//Json Data Parser
app.use(express.json({ limit: '200mb' }))

app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use("/api/v1", payment)

//Access Front End Static Files
app.use(express.static(path.join(__dirname, "../frontend/build")));

//Access Front End All URL
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
});

module.exports = app