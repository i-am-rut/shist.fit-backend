const mongoose = require("mongoose")

const foodEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    food: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    mealType: {
        type: String,
        enum: ["Breakfast", "Lunch", "Snack", "Dinner"],
        default: "Breakfast",
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true } )

module.exports = mongoose.model('FoodEntry', foodEntrySchema)