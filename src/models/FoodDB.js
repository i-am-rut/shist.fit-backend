const mongoose = require('mongoose');

const ServingSchema = new mongoose.Schema({
    serving_id: String,
    serving_description: String,
    measurement_description: String,
    metric_serving_amount: String,
    metric_serving_unit: String,
    number_of_units: String,
    calories: String,
    carbohydrate: String,
    fat: String,
    protein: String,
    fiber: String,
    sugar: String,
    saturated_fat: String,
    monounsaturated_fat: String,
    polyunsaturated_fat: String,
    cholesterol: String,
    sodium: String,
    potassium: String,
    iron: String,
    calcium: String,
    vitamin_a: String,
    vitamin_c: String
}, { _id: false }); 

const FoodSchema = new mongoose.Schema({
    food_id: { type: String, required: true, unique: true },
    food_name: String,
    food_type: String,
    servings: [ServingSchema]
});

module.exports = mongoose.model('FoodDB', FoodSchema);
