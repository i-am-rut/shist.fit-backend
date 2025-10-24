const mongoose = require("mongoose") 
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 50,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if(!validator.isEmail(value)) {
                    throw new Error("Invalid email address: " + value)
                }
            },
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 1000,
            validate(value) {
                if(!validator.isStrongPassword(value)) {
                    throw new Error("Enter a strong password (Minimum 8 characters long, containing atleast 1 number, 1 lowercase, 1 uppercase, 1 special character)")
                }
            }
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        age: {
            type: Number,
            min: 5,
            max: 120,
        },
        height: {
            type: Number,
            min: 50,
            max: 300,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say']
        }
    },
    {
        timestamps: true,
    }
)

userSchema.methods.getJWT = async function () {
    const user = this

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'},)

    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const passwordHash = this.password
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash        
    )

    return isPasswordValid
}

module.exports = mongoose.model('User', userSchema)