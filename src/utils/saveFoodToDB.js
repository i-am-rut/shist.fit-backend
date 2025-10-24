const FoodDB = require("../models/FoodDB");

const saveFoodData = async (foodData) => {
  try {

    const { food_id } = foodData;

    const existing = await FoodDB.findOne({ food_id: food_id });
    if (existing) {
      console.log('Food already exists!');
      return;
    }

    let servingsArray = food.servings.serving;
    if (!Array.isArray(servingsArray)) {
      servingsArray = [servingsArray];
    }

    const cleanedServings = servingsArray.map(serving => {
      const { serving_url, ...rest } = serving; 
      return rest;
    });

    const newFood = new Food({
      food_id: food.food_id,
      food_name: food.food_name,
      food_type: food.food_type,
      servings: cleanedServings
    });

    await newFood.save();
    console.log('Food saved!', newFood.food_name);
  } catch (err) {
    console.error('Error saving food:', err);
  }
};

module.exports = saveFoodData