const User = require("../models/User");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("../utils/validate");
const { generateEmailToken } = require("../utils/token");
const { sendVerificationEmail } = require('../utils/sendEmail')
const { verifyEmailToken } = require("../utils/token");
// const sendEmail = require('../utils/sendEmail')

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Missing token." });

    const { email } = verifyEmailToken(token);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    if (user.isEmailVerified) return res.status(200).json({ message: "Email already verified." });

    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token." });
  }
};



const register = async (req, res) => {
    try {
        validateSignUpData(req);
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({error: "Can not use these credentials to register."})

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // const token = generateEmailToken(email);

        // await sendVerificationEmail(email, token);
        // const emailRes = await sendEmail.run()

        res.status(201).json({ message: "User registered. Verification email sent."});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const resendVerificationEmailLink = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ error: "Email is already verified." });
        }

        // Generate a new verification token
        const token = generateEmailToken(email);

        // Send verification email
        await sendVerificationEmail(email, token);

        return res.status(200).json({ message: "Verification email sent." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const login = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(!user) return res.status(400).json({error: "Invalid credentials!"})
            
        // if(!user.isEmailVerified) {
        //     const token = generateEmailToken(email);
        //     await sendVerificationEmail(email, token);
            
        //     return res.status(403).json({error: 'Verify your email'})
        // }
        if (!user.isActive) {
            return res.status(403).json({ error: "Account has been deactivated." });
        }
        const isPasswordValid = await user.validatePassword(password)
        const {_id, name, isEmailVerified, age, height, streak, heartrate, gender} = user
        if(isPasswordValid) {
            const token = await user.getJWT()
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                // sameSite: "Lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return res.status(200).json({
                message: "Login successful",
                accessToken: token,
                user: {
                    id: _id,
                    name,
                    email: user.email,
                    isEmailVerified,
                    age,
                    height,
                    streak,
                    heartrate,
                    gender
                },
            });
        }else {
            throw new Error("Invalid credentials!");
        }
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const logout = async(req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        })
        res.status(200).json({message: "Logged out successfully!"})    
    } catch (err) {
        res.status(500).json({message: "Server error", error: err.message})
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // 1. Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirmation do not match." });
        }

        // 2. Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 3. Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }

        // 4. Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ message: "Password changed successfully." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to change password.", error: err.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.isActive) {
            return res.status(400).json({ error: "Account is already deactivated." });
        }

        // Soft-delete: set isActive to false
        user.isActive = false;
        await user.save();

        // Optionally, clear auth cookies
        res.clearCookie("token");

        res.status(200).json({ message: "Account has been successfully deactivated." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {verifyEmail, register, login, logout, resendVerificationEmailLink, changePassword, deleteAccount}