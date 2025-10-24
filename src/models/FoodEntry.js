const mongoose = require("mongoose")

const macrosSchema = new mongoose.Schema({
    protein: { type: Number, default: 0, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    fats: { type: Number, default: 0, min: 0 },
}, { _id: false }); 

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
    macros: {
        type: macrosSchema,
        default: () => ({protein: 0, carbs: 0, fats: 0})
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
      time: {
        type: String,
        // match: /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,  
        required: true
    },
    amount: {
        type: Number,
        default: 1,
        required: true,
        min: 0,
    },
}, { timestamps: true } )

module.exports = mongoose.model('FoodEntry', foodEntrySchema)