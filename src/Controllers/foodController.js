const FoodEntry = require("../models/FoodEntry")

const addFood = async(req, res) => {
    try {
        const {food, calories, mealtype, date} = req.body

        const newEntry = new FoodEntry({
            user: req.user._id,
            food,
            calories,
            mealtype,
            date
        })

        await newEntry.save()
        res.status(201).json({message: "Food entry added", entry: newEntry})
    } catch (err) {
        res.status(500).json({message: "Failed to add food entry", error: err.message})
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

        if(!entry) return res.status(404).json({message: "Entry not found"})
        
        res.json({message: "Food entry deleted."})
    } catch (err) {
        res.status(500).json({message: "Failed to delete entry", error: err.message})
    }
}

module.exports = { addFood, getFoodEntries, deleteFoodEntry}