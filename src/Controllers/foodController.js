const FoodEntry = require("../models/FoodEntry");
const User = require("../models/User");
const getAccessToken = require('../utils/fatsecret')
const axios = require('axios')


const addFood = async (req, res) => {
    try {
        const { food_id, mealType, date, time, amount = 1, servingIdx = 0 } = req.body;

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

        // Handle the choice of servings
        const servings = Array.isArray(food.servings.serving)
            ? food.servings.serving
            : [food.servings.serving];
        const serving = servings[servingIdx] || servings[0];

        // Base values setting
        const baseCalories = parseFloat(serving.calories) || 0;
        const baseProtein = parseFloat(serving.protein) || 0;
        const baseCarbs = parseFloat(serving.carbohydrate) || 0;
        const baseFats = parseFloat(serving.fat) || 0;

        // Scale macros by the amount
        const calories = baseCalories * amount;
        const macros = {
            protein: baseProtein * amount,
            carbs: baseCarbs * amount,
            fats: baseFats * amount
        };

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

        // streak logic
        const user = await User.findById(req.user._id);
        if (user) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            // Finding the most recent food log before today
            const lastLog = await FoodEntry.findOne({
                user: user._id,
                date: { $lt: today }
            }).sort({ date: -1 });

            let shouldIncrease = false;
            let shouldReset = false;

            if (!lastLog) {
                // First ever food log
                user.streak = 1;
            } else {
                const lastLogDate = new Date(lastLog.date);
                lastLogDate.setHours(0, 0, 0, 0);

                if (lastLogDate.getTime() === yesterday.getTime()) {
                    // Logged yesterday → increase streak
                    shouldIncrease = true;
                } else if (lastLogDate.getTime() < yesterday.getTime()) {
                    // Missed a day → reset
                    shouldReset = true;
                }
            }

            // Check to prevent multiple increments
            const loggedToday = await FoodEntry.findOne({
                user: user._id,
                date: { $gte: today }
            });

            if (loggedToday && !shouldIncrease && !shouldReset && user.streak === 0) {
                // First meal ever today
                user.streak = 1;
            } else if (shouldIncrease && !loggedToday._id.equals(newEntry._id)) {
                user.streak += 1;
            } else if (shouldReset) {
                user.streak = 1; 
            }

            await user.save();
        }

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

const getTodaysTotalCalories = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const entries = await FoodEntry.find({
            user: req.user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const totalCalories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);

        res.json({ date: startOfDay.toISOString().split('T')[0], totalCalories });
    } catch (err) {
        res.status(500).json({ message: "Failed to get today's total calories", error: err.message });
    }
};

const getTodaysTotalMacros = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const entries = await FoodEntry.find({
            user: req.user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const totals = entries.reduce((acc, entry) => {
            acc.protein += entry.macros?.protein || 0;
            acc.carbs += entry.macros?.carbs || 0;
            acc.fats += entry.macros?.fats || 0;
            return acc;
        }, { protein: 0, carbs: 0, fats: 0 });

        res.json({ date: startOfDay.toISOString().split('T')[0], totals });
    } catch (err) {
        res.status(500).json({ message: "Failed to get today's total macros", error: err.message });
    }
};

const getTodayFood = async (req, res) => {
    try {
        const userId = req.user._id;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todaysEntries = await FoodEntry.find({
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ time: 1 }); // Sort by time ascending 

        res.status(200).json({
            date: startOfDay.toISOString().split("T")[0],
            totalMeals: todaysEntries.length,
            meals: todaysEntries
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch today's food entries.",
            error: err.message
        });
    }
};


const getRecentMeals = async (req, res) => {
    try {
        const recentMeals = await FoodEntry.find({ user: req.user._id })
            .sort({ date: -1, time: -1 }) // newest first
            .limit(4);

        res.json({ recentMeals });
    } catch (err) {
        res.status(500).json({ message: "Failed to get recent meals", error: err.message });
    }
};


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

module.exports = { addFood, getFoodEntries, deleteFoodEntry, getRecentMeals, getTodaysTotalCalories, getTodaysTotalMacros, getTodayFood}