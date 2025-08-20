const User = require("../models/User");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("../utils/validate");

const register = async (req, res) => {
    try {

        validateSignUpData(req)

        const {name, email, password} = req.body

        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({message: "Can not use these credentials to register."})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({name, email, password: hashedPassword})
        await user.save()

        res.status(201).json({message: "User registered successfully"})
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message
        })
    }
}

const login = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        // console.log(user)
        if(!user) return res.status(400).json({message: "Invalid credentials!"})
        // if(!user.isEmailVerified) return res.status(403).json({message: "Verify your email from the link sent to your email address to login."})

        const isPasswordValid = await user.validatePassword(password)

        if(isPasswordValid) {
            const token = await user.getJWT()

            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000),})
            res.status(200).json({
                message: "Login successful",
                user: {id: user._id, name: user.name, email: user.email}
            })
        }else {
            throw new Error("Invalid credentials!");
        }
        
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message})
    }
}

const logout = async(req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        })
        res.status(200).json({message: "Logged out successfully!"})    
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message})
    }
}

module.exports = {register, login, logout}