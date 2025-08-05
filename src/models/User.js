const mongoose = require("mongoose") 
const validator = require("validator")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
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
            validate(value) {
                if(!validator.isStrongPassword) {
                    throw new Error("Enter a strong password (Minimum 8 characters long, containing atleast 1 number, 1 lowercase, 1 uppercase, 1 special character)")
                }
            }
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)