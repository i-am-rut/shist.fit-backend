const User = require("../models/User");

const createUserProfile = async (req, res) => {
    try {
        const { age, gender, height, heartrate } = req.body;

        
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found." });

        if (
            user.age !== undefined || 
            user.gender !== undefined || 
            user.height !== undefined || 
            user.heartrate !== undefined
        ) {
            return res.status(400).json({ message: "Profile data already exists. Use PATCH to update." });
        }
        if (age && (age < 5 || age > 120)) {
            return res.status(400).json({ message: "Age must be between 5 and 120." });
        }

        if (height && (height < 50 || height > 300)) {
            return res.status(400).json({ message: "Height must be between 50 and 300 cm." });
        }

        if (heartrate && (heartrate < 0 || heartrate > 300)) {
            return res.status(400).json({ message: "Heart rate must be between 0 and 300 BPM." });
        }

        if (gender && !["Male", "Female", "Other", "Prefer not to say"].includes(gender)) {
            return res.status(400).json({ message: "Invalid gender value." });
        }

        user.age = age;
        user.gender = gender;
        user.height = height;
        user.heartrate = heartrate;

        await user.save();

        res.status(201).json({ message: "Profile created successfully.", profile: user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create profile.", error: err.message });
    }
};


const updateUserProfile = async (req, res) => {
    try {
        const { age, gender, height, heartrate } = req.body;

        const updateFields = {};

        if (age !== undefined) {
            if (age < 5 || age > 120) {
                return res.status(400).json({ message: "Age must be between 5 and 120." });
            }
            updateFields.age = age;
        }

        if (gender !== undefined) {
            if (!["Male", "Female", "Other", "Prefer not to say"].includes(gender)) {
                return res.status(400).json({ message: "Invalid gender value." });
            }
            updateFields.gender = gender;
        }

        if (height !== undefined) {
            if (height < 50 || height > 300) {
                return res.status(400).json({ message: "Height must be between 50 and 300 cm." });
            }
            updateFields.height = height;
        }

        if (heartrate !== undefined) {
            if (heartrate < 0 || heartrate > 300) {
                return res.status(400).json({ message: "Heart rate must be between 0 and 300 BPM." });
            }
            updateFields.heartrate = heartrate;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found." });

        res.status(200).json({ message: "Profile updated successfully.", profile: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update profile.", error: err.message });
    }
};

module.exports = { updateUserProfile, createUserProfile}