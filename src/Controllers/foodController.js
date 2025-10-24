const FoodEntry = require("../models/FoodEntry")
const getAccessToken = require('../utils/fatsecret')
const axios = require('axios')


const addFood = async (req, res) => {
    try {
        const { food_id, mealType, date, time, amount, servingIdx } = req.body;

        const token = await getAccessToken();
        const foodResponse = await axios.get("https://platform.fatsecret.com/rest/server.api", {
            params: {
                method: "food.get.v2",
                food_id,
                format: "json"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const food = foodResponse.data.food;
        const serving = food.servings.serving[0]; 

        const macros = {
            protein: parseFloat(serving.protein),
            carbs: parseFloat(serving.carbohydrate),
            fats: parseFloat(serving.fat)
        };
        const calories = parseFloat(serving.calories);

        const newEntry = new FoodEntry({
            user: req.user._id,
            food: food.food_name,
            calories,
            mealType,
            date,
            time,
            amount,
            macros
        });

        await newEntry.save();
        res.status(201).json({ message: "Food entry added", entry: newEntry });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add food entry", error: err.message });
    }
}

const getFoodEntries = async(req, res) => {
    try {
        const entries = await FoodEntry.find({user: req.user._id}).sort({date: -1})

        const groupedByDate = {}
        entries.forEach(entry => {
            const datekey = entry.date.toISOString().split('T')[0]
            if(!groupedByDate[datekey]) {
                groupedByDate[datekey] = {
                    date: datekey,
                    totalCalories: 0,
                    meals: []
                }
            }

            groupedByDate[datekey].totalCalories += entry.calories
            groupedByDate[datekey].meals.push(entry)
        })
        res.json(Object.values(groupedByDate))
    } catch (err) {
        res.status(500).json({message: "Failed to fetch food entries", error: err.message})
    }
}

const deleteFoodEntry = async (req, res) => {
    try {
        const entry = await FoodEntry.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })

        if(!entry) return res.status(404).json({error: "Entry not found"})
        
        res.json({message: "Food entry deleted."})
    } catch (err) {
        res.status(500).json({message: "Failed to delete entry", error: err.message})
    }
}

module.exports = { addFood, getFoodEntries, deleteFoodEntry}