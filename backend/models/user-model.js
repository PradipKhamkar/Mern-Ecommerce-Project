const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name Cannot exceed 30 Characters"],
        minLength: [4, "Name Should have more then 4 characters "]
    },
    email:
    {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    password:
    {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password Should have more then 8 characters "],
        select: false
    },
    avatar:

    {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }

    },
    role:
    {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

});


//Demo
// userSchema.pre('save', async function () {
//     this.name = await this.name + "Customer"
// })


// Save Event Which Run Before Document Save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    else {
        this.password = await bcrypt.hash(this.password, 10)
        next();
    }
})



//All Are The Instance Methods


//JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET,
        { expiresIn: '5d' })
}

//Compare Password
userSchema.methods.comparePass = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}

//Generating Password Resent Token
userSchema.methods.getResetPasswordToken = function () {
    //Generating Password Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex")

    //Hashing And adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}





const userModel = mongoose.model("user", userSchema)

module.exports = userModel