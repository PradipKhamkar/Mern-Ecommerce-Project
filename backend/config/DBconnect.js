const moongose = require("mongoose")

const connectDB = async () => {
    try {

        await moongose.connect(process.env.DB_URI, { "useUnifiedTopology": true });
        console.log("Application Is Connected To Database :) ")

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDB

